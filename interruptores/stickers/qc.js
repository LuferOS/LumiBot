import axios from 'axios';
import fs from 'fs';
import { generateQuoteSticker } from '../utils/quote_api.js';

export default {
  command: ['qc', 'cita', 'quote'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      let textFinal = args.join(' ') || m.quoted?.text;
      if (!textFinal) {
        return client.reply(m.chat, `╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Ingrese un texto o responda a un mensaje para generar la cita.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      }
      
      let target = m.quoted ? m.quoted.sender : m.sender;
      
      // ⚡ LUMIBOT OVERRIDE: Avatar de Diva por defecto en lugar de la waifu
      const pp = await client.profilePictureUrl(target).catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
      
      const db = global.db.data;
      const userGlobal = db.users[target] || {};
      const nombre = userGlobal?.name || target.split('@')[0];
      
      // ⚡ LUMIBOT OVERRIDE: Límite de caracteres expandido
      if (textFinal.length > 60) {
        await m.react('✖️');
        return client.reply(m.chat, `╭⋯ ⚠️ *DESBORDAMIENTO DE BÚFER* ⋯》\n┊ El texto excede la capacidad del lienzo (Máx: 60 caracteres).\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      }
      
      await m.react('🕒');
      
      // ⚡ LUMIBOT OVERRIDE: Renderizado con estética de terminal (fondo oscuro)
      const quoteObj = { 
        type: 'quote', 
        format: 'png', 
        backgroundColor: '#0a0a0a', 
        width: 512, 
        height: 768, 
        scale: 2, 
        messages: [{ 
          entities: [], 
          avatar: true, 
          from: { id: 1, name: nombre, photo: { url: pp } }, 
          text: textFinal, 
          replyMessage: {} 
        }] 
      };
      
      const base64Image = await generateQuoteSticker(quoteObj);
      const buffer = Buffer.from(base64Image, 'base64');
      
      const user = db.users[m.sender] || {};
      const name = user.name || m.sender.split('@')[0];
      const meta1 = user.metadatos ? String(user.metadatos).trim() : '';
      const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : '';
      
      // ⚡ LUMIBOT OVERRIDE: Marca de agua de Queen
      let texto1 = meta1 ? meta1 : 'LumiBOT Security';
      let texto2 = meta1 ? (meta2 ? meta2 : '') : `Operador: ${name}`;
      
      const tmpFile = `./tmp/qc-${Date.now()}.webp`;
      fs.writeFileSync(tmpFile, buffer);
      
      await client.sendImageAsSticker(m.chat, tmpFile, m, { packname: texto1, author: texto2 });
      fs.unlinkSync(tmpFile);
      await m.react('✔️');
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en qc.js:", e);
      await m.react('✖️');
      return m.reply(`╭⋯ ❌ *ERROR DE RENDERIZADO* ⋯》\n┊ Fallo en la conexión con el servidor de citas.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
};
