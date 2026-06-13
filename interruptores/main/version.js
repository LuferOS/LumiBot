export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v3.1.0* ⋯》
┊ ✨ *NOTAS DE LA ACTUALIZACIÓN* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *MEJORAS DEL SISTEMA (UPGRADES):*
┊ ⊳ *Módulo IA Optimizado:* Se reestructuró la personalidad del chatbot a su comportamiento original (Sádica/Meme). Ahora incluye capacidades de Rol (reacciones con GIFs) integradas.
┊ ⊳ *Gatillo Inteligente de IA:* Eliminada la respuesta aleatoria. El bot ahora solo analiza y responde a mensajes que lo mencionan directamente o que son respuestas a sus propios mensajes, reduciendo el spam.
┊ ⊳ *Nuevos Módulos de Extracción:* Añadidos comandos de "Stalking" (.github, .igstalk, .tiktokstalk) con integración a la API de AlyaCore para extraer perfiles completos.
┊ ⊳ *Módulo de Capturas (SS):* Se reemplazó el proveedor obsoleto (Thum.io) por la red privada de AlyaCore para obtener capturas de pantalla ultra-rápidas y precisas (.ss).
┊
┊ 🐛 *CORRECCIONES (BUG FIXES):*
┊ ⊳ *Mitigación de Baneos:* Se eliminó el uso forzado de \`externalAdReply\` en módulos como el menú e infobot, evitando que WhatsApp marque los mensajes como spam ("Reenviado muchas veces").
┊ ⊳ *Manejo de Errores HTTP 429:* Implementado un escudo contra limitación de tasa (Rate Limiting) en las descargas de banners de Imgur. El bot ahora entrega la respuesta en texto plano sin crashear.
┊ ⊳ *Prevención de Saturación Inicial:* Al encender, el bot ignorará todos los mensajes que fueron enviados mientras estaba apagado, previniendo ráfagas de procesamiento y caídas por sobrecarga.
┊ ⊳ *Manejo de Fallos Multimedia:* Implementado un "Fallback" en la IA para asegurar que el texto se entregue intacto incluso si WhatsApp rechaza el envío del GIF de rol.
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
