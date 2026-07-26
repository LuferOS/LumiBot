export default {
  command: ['vincular', 'link', 'serbot'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data;

    // Verificación de apertura de registros
    if (db.settings?.registrationEnabled === false) {
      return m.reply("╭⋯ ⚠️ *SISTEMA CERRADO* ⋯》\n┊ El sistema de subbots está temporalmente cerrado\n┊ por mantenimiento o falta de espacio.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
    }

    // Restricción a chat privado por seguridad
    if (m.isGroup) {
      return m.reply("╭⋯ 🛑 *POR SEGURIDAD* ⋯》\n┊ La vinculación expone códigos sensibles.\n┊ Escríbeme al *privado* usando *.vincular* para proceder.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
    }

    const txt = `╭⋯ 🤖 *CONVERTIRSE EN SUB-BOT* ⋯》
┊ Selecciona el método que prefieras para
┊ vincular tu cuenta y ser un bot temporal.
┊
┊ 📱 *CÓDIGO:* Recibirás un código de 8 dígitos 
┊ para poner en "Dispositivos Vinculados".
┊
┊ 📷 *QR:* Escanearás un código de barras 
┊ con otro celular.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

    const botones = [
      ['Generar Código', '.code'],
      ['Mostrar QR', '.qr']
    ];

    try {
      const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = await import('baileys-next');

      const btnCode = {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: `🔢 Generar Código`,
          id: `.code`
        })
      };

      const btnQr = {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: `📷 Mostrar QR`,
          id: `.qr`
        })
      };

      // Adjuntar una imagen fuerza a WhatsApp a renderizar los botones en chats privados
      const imageUrl = "https://telegra.ph/file/24fa902ead26340f3df2c.png";
      const media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: client.waUploadToServer });

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: txt }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: 'LumiBot Security 💅✨' }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: '',
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
              }),// MENSAJE INTERACTIVO
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [btnCode, btnQr]
              })
            })
          }
        }
      }, { quoted: m, userJid: client.user?.jid });

      await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
      await m.reply(txt + "\n\n> *Nota:* Ocurrió un error con los botones. Usa manualmente *.code* o *.qr* para continuar.");
    }
  }
};
