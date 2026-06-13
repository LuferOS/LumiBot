import fetch from 'node-fetch';

export default {
  command: ['chisme', 'tea', 'secreto'],
  category: 'grupo',
  run: async (client, m) => {
    try {
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null;
      if (!groupMetadata) return m.reply('🙄 *Amiga, esto es por privado. Los chismes son para el grupo, no seas egoísta.* 💅');
    
    const participants = groupMetadata.participants;
    if (participants.length < 2) return m.reply('🙄 *Estás sol@ en el grupo, qué chisme te voy a contar? Tus propias penas?* 🤡');
    
    const randomUser = participants[Math.floor(Math.random() * participants.length)].id;
    
    const chismes = [
  "sufre por su ex y después lo niega 💅👀",
  "finge que no le importa su profesor y sube indirectas 💅👀",
  "esconde su ex y llora en el baño 💅👀",
  "tiene un póster de el admin en la madrugada 💅👀",
  "se cree un personaje 2D y después lo niega 💅👀",
  "stalkea a el admin y da cringe 💅👀",
  "esconde alguien del grupo porque no tiene vida 💅👀",
  "lloró por su vecino y llora en el baño 💅👀",
  "miente sobre su ex en la madrugada 💅👀",
  "stalkea a su amig@ porque no tiene vida 💅👀",
  "sufre por el admin en la madrugada 💅👀",
  "está enamorad@ de un famoso y se siente orgullos@ 💅👀",
  "finge que no le importa un personaje 2D y da cringe 💅👀",
  "tiene un póster de su vecino cuando nadie lo ve 💅👀",
  "se cree el admin porque no tiene vida 💅👀",
  "sufre por alguien del grupo y llora en el baño 💅👀",
  "stalkea a su vecino cuando nadie lo ve 💅👀",
  "esconde alguien del grupo y usa cuentas falsas 💅👀",
  "está enamorad@ de un famoso y piensa que no sabemos 💅👀",
  "se cree un famoso y se siente orgullos@ 💅👀",
  "le escribió a su vecino porque no tiene vida 💅👀",
  "sufre por el admin y sube indirectas 💅👀",
  "tiene un póster de su profesor cuando nadie lo ve 💅👀",
  "sufre por el admin cuando nadie lo ve 💅👀",
  "esconde el admin y llora en el baño 💅👀",
  "esconde el admin porque no tiene vida 💅👀",
  "tiene un póster de alguien del grupo en la madrugada 💅👀",
  "se cree su mascota porque no tiene vida 💅👀",
  "se cree un famoso y piensa que no sabemos 💅👀",
  "le escribió a su crush en la madrugada 💅👀",
  "se cree su crush y sube indirectas 💅👀",
  "se cree su ex cuando nadie lo ve 💅👀",
  "stalkea a el admin y se siente orgullos@ 💅👀",
  "finge que no le importa un famoso y da cringe 💅👀",
  "miente sobre su profesor porque no tiene vida 💅👀",
  "stalkea a un personaje 2D y sube indirectas 💅👀",
  "stalkea a su ex y piensa que no sabemos 💅👀",
  "miente sobre su mascota y después lo niega 💅👀",
  "sufre por su profesor y sube indirectas 💅👀",
  "stalkea a su crush y se siente orgullos@ 💅👀",
  "está enamorad@ de su mascota porque no tiene vida 💅👀",
  "lloró por su mascota y da cringe 💅👀",
  "stalkea a alguien del grupo y sube indirectas 💅👀",
  "lloró por alguien del grupo y después lo niega 💅👀",
  "esconde el admin y usa cuentas falsas 💅👀",
  "lloró por su crush y llora en el baño 💅👀",
  "tiene un póster de un personaje 2D cuando nadie lo ve 💅👀",
  "esconde alguien del grupo y sube indirectas 💅👀",
  "stalkea a su vecino y se siente orgullos@ 💅👀",
  "finge que no le importa su crush y se siente orgullos@ 💅👀",
  "tiene un póster de su mascota y usa cuentas falsas 💅👀",
  "le escribió a el admin porque no tiene vida 💅👀",
  "finge que no le importa su ex y llora en el baño 💅👀",
  "lloró por un personaje 2D en la madrugada 💅👀",
  "sufre por un personaje 2D y sube indirectas 💅👀",
  "tiene un póster de un personaje 2D y usa cuentas falsas 💅👀",
  "finge que no le importa su profesor y da cringe 💅👀",
  "le escribió a un famoso y usa cuentas falsas 💅👀",
  "miente sobre su amig@ y llora en el baño 💅👀",
  "le escribió a su mascota y se siente orgullos@ 💅👀",
  "le escribió a su vecino y usa cuentas falsas 💅👀",
  "tiene un póster de su mascota porque no tiene vida 💅👀",
  "stalkea a su mascota y se siente orgullos@ 💅👀",
  "miente sobre un personaje 2D y usa cuentas falsas 💅👀",
  "lloró por su crush y da cringe 💅👀",
  "lloró por un famoso y se siente orgullos@ 💅👀",
  "finge que no le importa su crush y usa cuentas falsas 💅👀",
  "está enamorad@ de el admin en la madrugada 💅👀",
  "stalkea a su vecino porque no tiene vida 💅👀",
  "está enamorad@ de su profesor y llora en el baño 💅👀",
  "está enamorad@ de su vecino y sube indirectas 💅👀",
  "sufre por un personaje 2D y se siente orgullos@ 💅👀",
  "sufre por su crush y usa cuentas falsas 💅👀",
  "stalkea a su mascota y piensa que no sabemos 💅👀",
  "se cree su ex y sube indirectas 💅👀",
  "esconde su ex porque no tiene vida 💅👀",
  "se cree su amig@ cuando nadie lo ve 💅👀",
  "sufre por su amig@ y piensa que no sabemos 💅👀",
  "stalkea a su mascota y llora en el baño 💅👀",
  "lloró por el admin en la madrugada 💅👀",
  "lloró por su profesor y después lo niega 💅👀",
  "finge que no le importa alguien del grupo y sube indirectas 💅👀",
  "está enamorad@ de su amig@ y después lo niega 💅👀",
  "sufre por su mascota y da cringe 💅👀",
  "tiene un póster de su profesor y sube indirectas 💅👀"
];
    const chisme = chismes[Math.floor(Math.random() * chismes.length)];
    const caption = `☕ *CHISME CALIENTITO* ☕\n\nMe pasaron el dato que @${randomUser.split('@')[0]} ${chisme}`;
    
    try {
      // Pick a gossipy interaction
      const inters = ['coffee', 'laugh', 'smug', 'peek', 'tickle', 'cringe'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [randomUser] }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      await client.sendMessage(m.chat, { text: caption, mentions: [randomUser] }, { quoted: m });
    }
    } catch (e) {
      console.error(e);
      await m.reply('🙄 *Se me cruzaron los cables y se me olvidó el chisme.* 💅\n> ' + e.message);
    }
  }
}
