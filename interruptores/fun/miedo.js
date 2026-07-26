export default {
  command: ['miedo', 'fobia'],
  category: 'fun',
  run: async (client, m, args) => {
    try {
      await m.react('😨');
      
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
      if (!groupMetadata) return m.reply("❌ Este comando solo funciona en grupos.");

      const participants = groupMetadata.participants;
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null);
      
      // Si no mencionó a nadie, agarramos a alguien aleatorio del grupo
      if (!target) {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        target = randomParticipant.id;
      }

      const miedos = [
        "a que el microondas cobre vida y lo juzgue por comer a las 3 AM.",
        "a darle 'Me Gusta' por accidente a una foto de su ex de hace 5 años.",
        "a que el bot revele su historial de navegación.",
        "a las palomas cuando lo miran fijamente a los ojos.",
        "a que se le acabe el saldo a la mitad del mejor chisme del año.",
        "a los maniquíes de las tiendas de ropa cuando nadie los ve.",
        "a los ruidos que hace la nevera a las 4 de la mañana.",
        "a quedarse encerrado en el baño sin papel higiénico.",
        "a que su mamá lo llame por su nombre completo.",
        "a mandar un sticker inapropiado en el grupo de la familia.",
        "a estornudar mientras se maquilla o se corta el pelo.",
        "a que le digan 'tenemos que hablar'.",
        "a saludar a alguien en la calle y que no era quien pensaba.",
        "a los payasos de fiesta infantil, sabe que esconden algo.",
        "a que le revisen la galería del celular de repente.",
        "a tropezarse en la calle y tener que disimular que estaba trotando."
      ];

      const miedoAleatorio = miedos[Math.floor(Math.random() * miedos.length)];
      const phone = target.split('@')[0];

      const msg = `╭⋯ 👻 *DETECTOR DE MIEDOS* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 😱 *Secreto revelado:* 
┊ Le tiene un miedo incontrolable ${miedoAleatorio}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

      await client.sendMessage(m.chat, { text: msg, mentions: [target] }, { quoted: m });

    } catch (e) {
      console.error("[LUMIBOT MIEDO] Error:", e);
      await m.reply("❌ Ups, me dio miedo procesar el comando.");
    }
  }
}
