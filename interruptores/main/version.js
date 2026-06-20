export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v5.0.0* ⋯》
┊ ✨ *NOTAS DE LA ACTUALIZACIÓN (DIVA ENGINE UPDATE)* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *INTEGRACIÓN DE IA CON SENTIMIENTOS:*
┊ ⊳ *Motor de Diva (Mood Engine):* Ahora LumiBot tiene sentimientos y una barra de paciencia. Si abusas de los comandos entrará en "Berrinche" y se negará a trabajar. Usa *.mimar* para comprarle regalos y subir su ánimo, o *.animo* para ver cómo está.
┊ ⊳ *La Policía Tóxica:* Nuevo sistema de bodas completo. Cásate con *.casarse* o divórciate con *.divorcio*. Si estando casado usas comandos románticos (.beso, .ship, etc) con OTRA persona, LumiBot interrumpirá el comando, te expondrá como infiel frente al grupo y sumará un punto en el comando *.infieles*.
┊ ⊳ *Red de Chismes Global:* LumiBot ahora lee pasivamente y guarda palabras clave de "salseo" en los grupos. Usa *.chisme* para revelar secretos anónimos robados de la base de datos SQL.
┊ 
┊ 🚀 *INTEGRACIÓN MASIVA (UPGRADES ANTERIORES):*
┊ ⊳ *API Racing:* Los descargadores principales compiten entre múltiples APIs.
┊ ⊳ *NSFW Ilimitado y Herramientas IA:* Nuevas utilidades de escalado, descargas Hentai y más.
┊
┊ 🐛 *CORRECCIONES Y SEGURIDAD (BUG FIXES):*
┊ ⊳ *Motor SQLite Multi-Hilo:* Ahora el registro de bodas, infidelidades, chismes y ánimo se guarda en SQLite usando WAL (Write-Ahead Logging) sin pausas asíncronas.
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
