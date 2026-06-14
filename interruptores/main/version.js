export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v3.2.0* ⋯》
┊ ✨ *NOTAS DE LA ACTUALIZACIÓN* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *MEJORAS DEL SISTEMA (UPGRADES):*
┊ ⊳ *Nuevas APIs de Descarga e Info:* Añadido soporte nativo para descargas de Spotify (.spotify), SoundCloud (.soundcloud), letras de canciones (.lyrics) y resúmenes de Wikipedia (.wikipedia) gracias a AlyaCore/Causas.
┊ ⊳ *Meme Generator Mejorado:* El comando .meme ahora es mucho más preciso. Extrae el mensaje literal del usuario (Bottom Text), la IA genera el texto de arriba para burlarse, y tiene una **probabilidad del 5% de lanzar un video meme** aleatorio.
┊ ⊳ *Integración de Audiomemes:* Los más de 70 audios graciosos ocultos ahora están listados en el menú principal con el comando .audio.
┊ ⊳ *Nueva Descarga NSFW:* Añadido el comando .pornhub para descargar videos de la plataforma bypassando la seguridad.
┊
┊ 🐛 *CORRECCIONES (BUG FIXES):*
┊ ⊳ *IA Esquizofrénica Controlada:* Se arregló el bug donde la IA creaba nombres falsos ("Yunu") porque leía el historial de la persona mezclado con stickers. Ahora los stickers se filtran invisiblemente y nunca llegan a su cerebro temporal.
┊ ⊳ *Limpieza de Consola:* Arreglada la molesta advertencia de deprecación \`(node-fetch#buffer)\` en las capturas de pantalla web (.ss).
┊ ⊳ *Arreglos 404 de Memes:* La IA ahora solo usa un catálogo verificado de plantillas de memes, eliminando los crasheos por pedir fondos inexistentes.
┊ ⊳ *Arreglo de Audios:* Solucionado el fallo \`id is not defined\` en .audio al intentar obtener el nombre del usuario.
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
