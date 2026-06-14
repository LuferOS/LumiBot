export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v4.0.1* ⋯》
┊ ✨ *NOTAS DE LA ACTUALIZACIÓN (ALYAN UPDATE)* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *INTEGRACIÓN MASIVA (UPGRADES):*
┊ ⊳ *API Racing:* Los descargadores principales (.fb, .ig, .spotify, .play, .soundcloud) ahora compiten entre múltiples APIs y servidores para asegurar una tasa de éxito del 99% y descargas ultra-rápidas.
┊ ⊳ *Nuevas Utilidades con IA:* Más de 10 herramientas pro agregadas, incluyendo lector de imágenes (.ocr), escalador de calidad (.upscale), eliminador de voces (.vocalremover), buscador de canciones estilo Shazam (.whatmusic) e IA editora de fotos (.gpteditor).
┊ ⊳ *Expansión Anime y Roleplay:* Añadido el descargador masivo de episodios de Anime (.anime) y un módulo dinámico de reacciones (.hug, .kiss, .slap...) impulsado por Otakugifs.
┊ ⊳ *NSFW Ilimitado:* Añadido el comando .hentaila para descargar contenido sin filtros.
┊ ⊳ *Fusión de Emojis:* Crea stickers únicos fusionando emojis con .emojimix.
┊
┊ 🐛 *CORRECCIONES Y SEGURIDAD (BUG FIXES):*
┊ ⊳ *GIFs Borrosos en WhatsApp (Hotfix):* Se arregló el bug nativo de WhatsApp donde los GIFs de interacción (.pat, .hug) quedaban borrosos y no cargaban. LumiBot ahora intercepta el GIF y lo renderiza como MP4 a través de FFmpeg antes de enviarlo.
┊ ⊳ *Interacciones Solucionadas:* Se migró el motor de interacciones a Otakugifs por caídas de servidores y bloqueos de seguridad de Cloudflare.
┊ ⊳ *Unión Automática y Comunitaria:* Se integraron los protocolos nativos de Baileys para que tanto el bot principal como los subbots sigan automáticamente el Canal Oficial y el Grupo Comunitario en su primer arranque.
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
