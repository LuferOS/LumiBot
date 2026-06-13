export default {
  command: ['ship', 'shippear', 'pareja'],
  category: 'grupo',
  run: async (client, m) => {
    try {
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null;
      if (!groupMetadata) return m.reply('🙄 *Amiga, el ship es para el grupo.* 💅');
      
      const participants = groupMetadata.participants;
      if (participants.length < 3) return m.reply('🙄 *Están muy solitos aquí, no alcanza ni para un triángulo amoroso.* 🤡');
      
      let user1 = participants[Math.floor(Math.random() * participants.length)].id;
      let user2 = participants[Math.floor(Math.random() * participants.length)].id;
      
      // Make sure they are different
      while (user1 === user2) {
        user2 = participants[Math.floor(Math.random() * participants.length)].id;
      }

      const matchPorcentaje = Math.floor(Math.random() * 101);
      let comentario = "";

      if (matchPorcentaje < 20) comentario = "💀 Literal no se soportan, aléjense.";
      else if (matchPorcentaje < 50) comentario = "🤡 Tensión rara, pero de lejitos mejor.";
      else if (matchPorcentaje < 80) comentario = "👀 Hay química... o puro morbo, quién sabe 💅.";
      else comentario = "🔥 MATCH PERFECTO. Ya cásense, no se hagan los difíciles ✨.";

      const texto = `💖 *NUEVA PAREJA DESBLOQUEADA* 💖\n\nEl destino (y mis algoritmos ✨) ha decidido que:\n\n👉 @${user1.split('@')[0]}\n👉 @${user2.split('@')[0]}\n\n💘 *Compatibilidad:* ${matchPorcentaje}%\n> ${comentario}`;

      await client.sendMessage(m.chat, { text: texto, mentions: [user1, user2] }, { quoted: m });
    } catch (e) {
      console.error(e);
      await m.reply('🙄 *Todo explotó calculando el amor.* 💅');
    }
  }
}
