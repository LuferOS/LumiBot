import fetch from 'node-fetch';

export default {
  command: ['funar', 'roast', 'quemar'],
  category: 'anime',
  run: async (client, m, args) => {
    const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
    if (!mentioned) return m.reply('🙄 *¿A quién funamos, amig@?*\n> Menciona a alguien o responde a su mensaje, no leo mentes 💅');
    
    const roasts = [
  "Deberían multarte por un semáforo en GTA y sigues solter@. 🤡",
  "Literal pareces agua de jamaica caliente y sigues solter@. 🤡",
  "Eres tan inútil que una piedra y sigues solter@. 🤡",
  "Tu vida amorosa es como una piedra y sigues solter@. 🤡",
  "Tu vida amorosa es como un cargador roto y sigues solter@. 🤡",
  "Literal pareces un lunes por la mañana y ya aburres. 🤡",
  "Deberían multarte por un semáforo en GTA y nadie te quiere. 🤡",
  "Ojalá fueras un lunes por la mañana y a nadie le importa. 🤡",
  "Tu vida amorosa es como Internet Explorer y ya aburres. 🤡",
  "Eres tan inútil que una pared despintada y nadie te quiere. 🤡",
  "Tu vida amorosa es como un lunes por la mañana y das puro cringe. 🤡",
  "Literal pareces un meme del 2012 y ya aburres. 🤡",
  "Tienes el carisma de agua de jamaica caliente y das lástima. 🤡",
  "Deberían multarte por agua de jamaica caliente y sigues solter@. 🤡",
  "Deberían multarte por agua de jamaica caliente y a nadie le importa. 🤡",
  "Tienes la misma energía que un semáforo en GTA y nadie te quiere. 🤡",
  "Ojalá fueras una pared despintada y te ves fatal. 🤡",
  "Tienes el carisma de un semáforo en GTA y ya aburres. 🤡",
  "Tienes la misma energía que un semáforo en GTA y das lástima. 🤡",
  "Tu vida amorosa es como una piedra y nadie te quiere. 🤡",
  "Tienes el carisma de un mosco a las 3 AM y te crees la gran cosa. 🤡",
  "Deberían multarte por un mosco a las 3 AM y te ves fatal. 🤡",
  "Ojalá fueras un anuncio que no se puede saltar y das lástima. 🤡",
  "Tienes la misma energía que una pared despintada y por eso te bloquearon. 🤡",
  "Ojalá fueras un anuncio que no se puede saltar y ya aburres. 🤡",
  "Literal pareces una pared despintada y ya aburres. 🤡",
  "Tu vida amorosa es como un lunes por la mañana y por eso te bloquearon. 🤡",
  "Tienes la misma energía que agua de jamaica caliente y te crees la gran cosa. 🤡",
  "Tienes la misma energía que un cargador roto y das lástima. 🤡",
  "Tienes el carisma de un cargador roto y ya aburres. 🤡",
  "Deberían multarte por un mosco a las 3 AM y por eso te bloquearon. 🤡",
  "Tienes el carisma de un mosco a las 3 AM y ya aburres. 🤡",
  "Literal pareces agua de jamaica caliente y das puro cringe. 🤡",
  "Literal pareces un cargador roto y te crees la gran cosa. 🤡",
  "Tu vida amorosa es como un mosco a las 3 AM y ya aburres. 🤡",
  "Tienes la misma energía que un billete falso y nadie te quiere. 🤡",
  "Ojalá fueras un mosco a las 3 AM y das lástima. 🤡",
  "Tienes la misma energía que una pared despintada y das puro cringe. 🤡",
  "Tienes la misma energía que un anuncio que no se puede saltar y te ves fatal. 🤡",
  "Tu vida amorosa es como una piedra y a nadie le importa. 🤡",
  "Tienes el carisma de agua de jamaica caliente y ya aburres. 🤡",
  "Tienes el carisma de un billete falso y por eso te bloquearon. 🤡",
  "Literal pareces un lunes por la mañana y das lástima. 🤡",
  "Tu vida amorosa es como un anuncio que no se puede saltar y por eso te bloquearon. 🤡",
  "Ojalá fueras un lunes por la mañana y por eso no te hablan. 🤡",
  "Literal pareces un semáforo en GTA y a nadie le importa. 🤡",
  "Tu vida amorosa es como un mosco a las 3 AM y das puro cringe. 🤡",
  "Tienes el carisma de un lunes por la mañana y a nadie le importa. 🤡",
  "Deberían multarte por un meme del 2012 y ya aburres. 🤡",
  "Deberían multarte por un billete falso y te ves fatal. 🤡",
  "Ojalá fueras una piedra y a nadie le importa. 🤡",
  "Literal pareces una piedra y sigues solter@. 🤡",
  "Tienes el carisma de una pared despintada y sigues solter@. 🤡",
  "Tienes el carisma de una pared despintada y ya aburres. 🤡",
  "Literal pareces una pared despintada y nadie te quiere. 🤡",
  "Tienes el carisma de un mosco a las 3 AM y sigues solter@. 🤡",
  "Deberían multarte por un meme del 2012 y te crees la gran cosa. 🤡",
  "Ojalá fueras un meme del 2012 y te ves fatal. 🤡",
  "Tu vida amorosa es como un anuncio que no se puede saltar y das lástima. 🤡",
  "Ojalá fueras agua de jamaica caliente y das lástima. 🤡",
  "Tienes el carisma de un cargador roto y das puro cringe. 🤡",
  "Tu vida amorosa es como una piedra y te crees la gran cosa. 🤡",
  "Literal pareces un cargador roto y por eso te bloquearon. 🤡",
  "Ojalá fueras Internet Explorer y das lástima. 🤡",
  "Literal pareces una pared despintada y te ves fatal. 🤡",
  "Tienes la misma energía que una piedra y a nadie le importa. 🤡",
  "Tienes la misma energía que agua de jamaica caliente y ya aburres. 🤡",
  "Eres tan inútil que una pared despintada y ya aburres. 🤡",
  "Eres tan inútil que un meme del 2012 y das lástima. 🤡",
  "Literal pareces Internet Explorer y das puro cringe. 🤡",
  "Eres tan inútil que un lunes por la mañana y te ves fatal. 🤡",
  "Deberían multarte por un cargador roto y nadie te quiere. 🤡",
  "Tienes la misma energía que un mosco a las 3 AM y te crees la gran cosa. 🤡",
  "Ojalá fueras Internet Explorer y sigues solter@. 🤡",
  "Literal pareces un mosco a las 3 AM y ya aburres. 🤡",
  "Ojalá fueras una piedra y sigues solter@. 🤡",
  "Tu vida amorosa es como un anuncio que no se puede saltar y te crees la gran cosa. 🤡",
  "Deberían multarte por Internet Explorer y das puro cringe. 🤡",
  "Eres tan inútil que un mosco a las 3 AM y por eso no te hablan. 🤡",
  "Deberían multarte por un cargador roto y das lástima. 🤡",
  "Tienes la misma energía que un cargador roto y por eso no te hablan. 🤡",
  "Tu vida amorosa es como Internet Explorer y te ves fatal. 🤡",
  "Tienes la misma energía que Internet Explorer y te crees la gran cosa. 🤡",
  "Tienes el carisma de un billete falso y te crees la gran cosa. 🤡",
  "Literal pareces Internet Explorer y nadie te quiere. 🤡"
];
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    const caption = `🔥 *FUNA TIME* 🔥\n\n@${mentioned.split('@')[0]}, ${roast}`;
    
    try {
      // Pick a random aggressive interaction
      const inters = ['slap', 'punch', 'angry', 'smug', 'laugh', 'cringe'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
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
