import fetch from 'node-fetch';

export default {
  command: ['funar', 'roast', 'quemar'],
  category: 'anime',
  run: async (client, m, args) => {
    const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
    if (!mentioned) return m.reply('🙄 *¿A quién funamos, amig@?*\n> Menciona a alguien o responde a su mensaje, no leo mentes 💅');
    
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(mentioned) || mentioned.startsWith('573118353868');
    if (isOwnerTarget) return m.reply(`🙄 ¿A mi creador? Estás mal de la cabeza si crees que voy a funar a mi papá o a los dioses de este bot. Más bien, la funa te la llevas tú por atrevid@. 💅`);
    
    const intros = ["Deberían multarte por parecer", "Literal pareces", "Eres tan inútil que", "Tu vida amorosa es como", "Tienes el carisma de", "Ojalá fueras", "Tienes la misma energía que", "Tu IQ es menor que el de", "Tu cara me recuerda a"];
    const subjects = ["un semáforo en GTA", "agua de jamaica caliente", "una piedra", "un cargador roto", "un lunes por la mañana", "Internet Explorer", "una pared despintada", "un meme del 2012", "un mosco a las 3 AM", "un anuncio que no se puede saltar", "un billete falso", "la 'e' de Internet Explorer", "un semáforo peatonal", "un paraguas roto", "el modo avión", "un chiste de WhatsApp de tíos", "una mosca atrapada en un vaso", "un pantallazo azul de Windows"];
    const endings = ["y sigues solter@. 🤡", "y ya aburres. 🤡", "y nadie te quiere. 🤡", "y das puro cringe. 🤡", "y das lástima. 🤡", "y a nadie le importa. 🤡", "y te crees la gran cosa. 🤡", "y te ves fatal. 🤡", "y por eso te bloquearon de todos lados. 🤡", "y por eso no te hablan. 🤡", "y das vibras de espantaviejas. 🤡", "y todos te silencian en el grupo. 🤡", "y tus papás cambiaron de tema cuando naciste. 🤡"];

    const intro = intros[Math.floor(Math.random() * intros.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const ending = endings[Math.floor(Math.random() * endings.length)];
    const roast = `${intro} ${subject} ${ending}`;
    const caption = `🔥 *FUNA TIME* 🔥\n\n@${mentioned.split('@')[0]}, ${roast}`;
    
    try {
      // Pick a random aggressive interaction
      const inters = ['slap', 'punch', 'angry', 'smug', 'laugh', 'cringe'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=LumiBot-alya`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [mentioned] }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      client.sendMessage(m.chat, { text: caption, mentions: [mentioned] }, { quoted: m });
    }
  }
}
