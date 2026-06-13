import fetch from 'node-fetch';

export default {
  command: ['gemelo', 'gemelos', 'twin'],
  category: 'grupo',
  run: async (client, m) => {
    try {
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null;
      if (!groupMetadata) return m.reply('🙄 *Los gemelos perdidos se buscan en el grupo, amiga.* 💅');
      
      const participants = groupMetadata.participants;
      if (participants.length < 2) return m.reply('🙄 *Eres hij@ únic@ aquí, literal estás sol@.* 🤡');
      
      let twin = participants[Math.floor(Math.random() * participants.length)].id;
      
      // Asegurar que no sea el mismo
      let maxTries = 10;
      while (twin === m.sender && maxTries > 0) {
        twin = participants[Math.floor(Math.random() * participants.length)].id;
        maxTries--;
      }

      const frases = [
        "✨ Tienen la misma energía de cringe y estabilidad mental cuestionable 💅.",
        "💀 Literal son la misma persona, hasta dan la misma vibra de que no han dormido en 3 días.",
        "🤡 Tal para cual. Si se juntan el mundo explota de tanto chisme.",
        "🚩 Son el dúo dinámico de las red flags. Peligro total.",
        "💅 Podrían compartir la misma cuenta de Netflix y el mismo terapeuta.",
        "✨ Su nivel de sarcasmo sincronizado da miedo, sinceramente.",
        "👀 Fueron separados al nacer para no destruir la civilización.",
        "🤡 Si los encierran juntos en un cuarto, salen funados o casados.",
        "💀 Comparten una sola neurona y hoy les tocó usarla al mismo tiempo.",
        "💅 Se entienden con la mirada... o con stickers. Misma energía."
      ];
      
      const frase = frases[Math.floor(Math.random() * frases.length)];

      const texto = `👯‍♀️ *TU GEMEL@ PERDID@* 👯‍♂️\n\nEl sistema detectó que @${m.sender.split('@')[0]} y @${twin.split('@')[0]} fueron separados al nacer.\n\n> ${frase}`;

      try {
        const inters = ['hug', 'highfive', 'handhold', 'cuddle', 'stare', 'laugh', 'smug', 'dance'];
        const inter = inters[Math.floor(Math.random() * inters.length)];
        const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
        const json = await res.json();
        if (json.result) {
          await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: texto, mentions: [m.sender, twin] }, { quoted: m });
        } else {
          throw new Error('No URL');
        }
      } catch (e) {
        await client.sendMessage(m.chat, { text: texto, mentions: [m.sender, twin] }, { quoted: m });
      }
    } catch (e) {
      console.error(e);
      await m.reply('🙄 *La prueba de ADN falló, inténtalo de nuevo.* 💅');
    }
  }
}
