import axios from 'axios';
import fs from 'fs';
import { getRecentMessages, getMessagesBeforeId } from '../../nucleo/system/markov_db.js';

export default {
  command: ["qs", "quote_sticker"],
  category: "utilidad",
  desc: "Crea un sticker citando hasta los últimos 5 mensajes del historial.",
  run: async (sock, m, args) => {
    try {
      let num = 2; // Por defecto 2 mensajes
      if (args[0] && !isNaN(args[0])) {
        num = parseInt(args[0]);
      }
      
      if (num > 5) num = 5;
      if (num < 1) num = 1;

      let selectedMessages = [];

      // Si respondió a un mensaje, buscamos ese mensaje y los anteriores en la BD
      if (m.quoted && m.quoted.id) {
        selectedMessages = await getMessagesBeforeId(m.chat, m.quoted.id, num);
        if (selectedMessages.length === 0) {
          return m.reply("❌ El mensaje citado es muy antiguo y ya no está en la Base de Datos.");
        }
      } else {
        // Traemos los últimos N mensajes recientes de la BD
        selectedMessages = await getRecentMessages(m.chat, num);
        if (selectedMessages.length === 0) {
          return m.reply("❌ El historial está vacío. Debes esperar a que haya mensajes.");
        }
      }

      await m.react('🕒');

      // Obtener avatares bajo demanda
      const pfpCache = {};
      
      const quoteMessages = [];
      for (const msg of selectedMessages) {
        let pfp = null;
        if (!pfpCache[msg.sender_jid]) {
          try {
            pfpCache[msg.sender_jid] = await sock.profilePictureUrl(msg.sender_jid, 'image');
          } catch (e) {
            pfpCache[msg.sender_jid] = 'https://i.imgur.com/8Q9N49Q.jpeg'; // Default táctico
          }
        }
        pfp = pfpCache[msg.sender_jid];

        quoteMessages.push({
          entities: [],
          avatar: true,
          from: { 
            id: msg.sender_jid, 
            name: msg.sender_name || msg.sender_jid.split('@')[0], 
            photo: { url: pfp } 
          },
          text: msg.message_text || '[Multimedia]',
          replyMessage: {}
        });
      }

      const quoteObj = { 
        type: 'quote', 
        format: 'png', 
        backgroundColor: '#0a0a0a', 
        width: 512, 
        height: 768, 
        scale: 2, 
        messages: quoteMessages 
      };

      const { data } = await axios.post('https://bot.lyo.su/quote/generate', quoteObj, { headers: { 'Content-Type': 'application/json' } });
      const buffer = Buffer.from(data.result.image, 'base64');

      const tmpFile = `./tmp/qs-${Date.now()}.webp`;
      fs.writeFileSync(tmpFile, buffer);
      
      const db = global.db?.data || {};
      const userGlobal = db.users?.[m.sender] || {};
      const name = userGlobal?.name || m.sender.split('@')[0];
      const meta1 = userGlobal.metadatos ? String(userGlobal.metadatos).trim() : 'LumiBOT Security';
      const meta2 = userGlobal.metadatos2 ? String(userGlobal.metadatos2).trim() : `Operador: ${name}`;

      await sock.sendImageAsSticker(m.chat, tmpFile, m, { packname: meta1, author: meta2 });
      fs.unlinkSync(tmpFile);
      await m.react('✔️');

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en qs.js:", e);
      await m.react('✖️');
      m.reply(`❌ Fallo en la conexión con el servidor de citas.\nDetalles: ${e.message}`);
    }
  }
};
