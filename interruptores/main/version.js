export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      
      const versionText = `╭⋯ 💅 *LUMIBOT OVERRIDE: v3.1.0* ⋯》
┊ ✨ *NOVEDADES Y CORRECCIONES RECIENTES* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *MEJORAS (UPGRADES):*
┊ ⊳ *IA Reestructurada:* Lumi volvió a sus raíces de "pick-me girl" gótica, sádica y memera. Ahora tiene comandos de ROL con GIFs ocultos (¡llorará, reirá o te dará una bofetada visual!). 💅
┊ ⊳ *Gatillo Inteligente:* Se eliminó la aleatoriedad. La IA ahora solo te responderá si le respondes directamente a un mensaje de ella o la etiquetas mencionándola (@Lumi). Menos saturación, más precisión.
┊ ⊳ *Nuevos juguetes:* Añadidos módulos de Stalking completos usando AlyaCore API (.github, .igstalk, .tiktokstalk).
┊ ⊳ *Módulo .ss Renacido:* Ya no dependemos del obsoleto Thum.io. Ahora usamos la API privada de AlyaCore para capturas de pantalla ultra-rápidas.
┊
┊ 🐛 *CORRECCIONES (BUG FIXES):*
┊ ⊳ *Anti-Baneo WhatsApp:* Se eliminó el uso forzado de \`externalAdReply\` en comandos como .menu y .infobot, previniendo que WhatsApp marque los mensajes con la alerta roja de "Reenviado muchas veces".
┊ ⊳ *Escudo Anti-Caídas 429:* Si Imgur bloquea al bot por exceso de peticiones, ya no colapsará tu consola. El bot ahora captura el error y te entrega el texto de todos modos.
┊ ⊳ *Limpieza de Inicio:* El bot ignora todos los mensajes del grupo que se acumularon durante su tiempo offline.
┊ ⊳ *Fallback IA:* Corrección de silencio mortal. Si falla el envío de un GIF por parte de la IA, su texto siempre llegará a salvo.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

      let msgPayload = {};
      if (banner.includes('.mp4') || banner.includes('.webm')) {
        msgPayload.video = { url: banner };
        msgPayload.gifPlayback = true;
        msgPayload.caption = versionText;
      } else {
        msgPayload.image = { url: banner };
        msgPayload.caption = versionText;
      }

      try {
        await client.sendMessage(m.chat, msgPayload, { quoted: m });
      } catch (mediaError) {
        await client.sendMessage(m.chat, { text: versionText }, { quoted: m });
      }

    } catch (error) {
      console.error("[LUMIBOT DEBUG] Error en version:", error);
      await m.reply(`🙄 *Bruh...* Literal no pude cargar las novedades.\n> 🚩 Excusas técnicas: *${error.message}*`);
    }
  }
};
