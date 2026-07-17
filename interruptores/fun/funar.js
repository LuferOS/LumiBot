export default {
  command: ['funar', 'cancelar'],
  category: 'fun',
  run: async (client, m, args) => {
    try {
      await m.react('🔥');
      
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
      if (!groupMetadata) return m.reply("❌ Este comando solo funciona en grupos.");

      const participants = groupMetadata.participants;
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null);
      
      // Si no mencionó a nadie, agarramos a alguien aleatorio del grupo
      if (!target) {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        target = randomParticipant.id;
      }

      const motivos = [
        "por echarle piña a la pizza y encima mayonesa.",
        "por no saber hervir agua sin que se le queme.",
        "por respirar muy fuerte en los audios de WhatsApp.",
        "por ver los mensajes, conectarse a cada rato y no responder.",
        "por dormir con calcetines en pleno verano.",
        "por decir 'imprimido' o 'haiga' sin sentir vergüenza.",
        "por comerse solo el borde de la pizza y dejar lo del centro.",
        "por reírse de sus propios chistes porque nadie más lo hace.",
        "por mandar audios de 5 minutos para decir 'ok'.",
        "por poner leche antes del cereal. Un psicópata total.",
        "por aplaudir cuando aterriza el avión.",
        "por morder el helado con los dientes frontales.",
        "por bañarse con agua hirviendo como si viniera del infierno.",
        "por usar el celular con el brillo al 100% a las 3 de la mañana.",
        "por pedir papas a la francesa y robarse las tuyas.",
        "por decir 'yo no soy como los demás' y ser exactamente igual."
      ];

      const motivoAleatorio = motivos[Math.floor(Math.random() * motivos.length)];
      const phone = target.split('@')[0];

      const msg = `╭⋯ 🔥 *FUNA MASIVA INICIADA* ⋯》
┊ ⊳ *Objetivo de la funa:* @${phone}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🚨 *Motivo de la cancelación:* 
┊ Queda oficialmente funad@ ${motivoAleatorio}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

      await client.sendMessage(m.chat, { text: msg, mentions: [target] }, { quoted: m });

    } catch (e) {
      console.error("[LUMIBOT FUNA] Error:", e);
      m.reply("❌ Uy, hubo un error al procesar la funa.");
    }
  }
}
