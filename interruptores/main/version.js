export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v5.0.2* ⋯》
┊ ✨ *NOTAS DE LA ACTUALIZACIÓN (BAILEYS-NEXT 7.0.7)* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *RENDIMIENTO EXTREMO Y ESTABILIDAD:*
┊ ⊳ *Anti-OOM (Control de Memoria):* Actualizado el motor Baileys a la v7.0.7 con sistema de LRUCache. El bot no sobrepasará su límite de memoria aunque lleguen 100,000 mensajes, evitando colapsos del servidor.
┊ ⊳ *Límite Inteligente de RAM:* El sistema operativo ahora restringe estrictamente la RAM del bot a un límite sano de 4GB.
┊ ⊳ *Desconexión Segura:* Límite de 50,000 nodos offline. Si el bot se cae, ya no crasheará la RAM al volver a conectarse intentando leer millones de mensajes en un segundo.
┊ 
┊ 🛡️ *ANTI-BAN & RED:*
┊ ⊳ *Arreglos Críticos:* Solucionado el Bug 463 y arreglado el bucle infinito en envíos masivos. Ahora los mensajes se envían instantáneos o bajo un estricto limitador anti-ban, tú decides.
┊ 
┊ 🛠️ *MEJORAS DE COMANDOS:*
┊ ⊳ *.ping Avanzado:* El comando de estado ahora muestra telemetría real. Consumo exacto de RAM en GB (y su porcentaje), latencia pura del motor, y tiempos de actividad separados (Uptime) del Sistema y del Bot.
┊ 
┊ 🚀 *INTEGRACIÓN DE IA CON SENTIMIENTOS:*
┊ ⊳ *Motor de Diva (Mood Engine):* Ahora LumiBot tiene sentimientos y una barra de paciencia. (Manteniendo las mecánicas de bodas y toxicidad intactas).
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
