export default {
  command: ['version', 'changelog', 'novedades', 'updates'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      const banner = botSettings.banner || 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
      
      const versionText = `╭⋯ ⚙️ *LUMIBOT FRAMEWORK: v6.0.0* ⋯》
┊ ✨ *NUEVA VERSIÓN DE BAILEYS NEXT BY LUFEROS V6* ✨
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚀 *RENDIMIENTO EXTREMO Y ESTABILIDAD:*
┊ ⊳ El motor ha sido actualizado y refactorizado. Ahora es 100% inmune al crasheo por botones interactivos de WhatsApp.
┊ 
┊ 🎮 *REFATORIZACIÓN DE JUEGOS Y ECONOMÍA:*
┊ ⊳ *Adiós a los botones:* Todos los juegos se han rescrito para jugarse directamente escribiendo en el chat.
┊ ⊳ *Base de Datos:* Todo tu progreso, rachas de victorias y Coins ahora se guardan de forma permanente.
┊ 
┊ 🎲 *NUEVOS JUEGOS DEL CAOS GRUPAL:*
┊ ⊳ *.ahorcado* - Adivina la palabra oculta. Autocompra vidas extras por 50 Coins para salvar al grupo.
┊ ⊳ *.slots [apuesta]* - Casino tragamonedas clásico. Multiplica tu dinero o piérdelo todo.
┊ ⊳ *.anagrama* - Descifra la palabra desordenada súper rápido y llévate 100 Coins.
┊ ⊳ *.ruletarusa* - Apuesta tu vida. Sobrevive y gana 50 Coins, muere y paga 200 de funeral.
┊ ⊳ *.duelo @usuario [apuesta]* - Peleas RNG callejeras por el pozo acumulado.
┊ 
┊ 💡 *¿CÓMO JUGAR?*
┊ Simplemente escribe el comando en el grupo. En juegos como el *.quiz*, *.ahorcado* y *.anagrama*, el bot te leerá automáticamente; no necesitas poner comandos extra, solo escribe la respuesta en el chat general. ¡Usa tus Coins sabiamente!
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
