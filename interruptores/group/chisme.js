import fetch from 'node-fetch';

export default {
  command: ['chisme', 'tea', 'secreto'],
  category: 'grupo',
  run: async (client, m) => {
    try {
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null;
      if (!groupMetadata) return m.reply('🙄 *Amiga, esto es por privado. Los chismes son para el grupo, no seas egoísta.* 💅');
    
    const participants = groupMetadata.participants.filter(p => !p.id.endsWith('@lid'));
    if (participants.length < 2) return m.reply('🙄 *Estás sol@ en el grupo, qué chisme te voy a contar? Tus propias penas?* 🤡');
    
    const randomUser = participants[Math.floor(Math.random() * participants.length)].id;
    
    const actions = [
      "sufre por", "finge que no le importa", "le tiene ganas a", "tiene un póster gigante de", 
      "se cree", "stalkea a", "lloró en secreto por", "miente sobre", "está obsesionad@ con", 
      "le mandó audios llorando a", "se besó con", "fue vist@ a escondidas con", "se peleó en Twitter por", 
      "le hace brujería a", "le reza todos los días a", "hace cuentas falsas para insultar a", 
      "colecciona fotos de", "tiene pesadillas con", "creó un altar satánico para", "escribe fanfics turbios sobre", 
      "se gastó la quincena en", "quiere escaparse a otro país con", "fue al psicólogo por culpa de", 
      "le ruega perdón de rodillas a", "inventó un chisme falso sobre", "se hizo un tatuaje en honor a", 
      "vende contenido +18 para mantener a", "bloqueó de todos lados a", "le roba WiFi a", "intenta poner celos@ a"
    ];
    
    const subjects = [
      "su ex", "su profesor", "el admin", "alguien del grupo", "un personaje 2D", 
      "su vecino", "su crush", "un famoso", "un random del metro", "el bot", 
      "su jefe", "un vagabundo", "su mejor amig@", "el panadero", "el perro del vecino", 
      "un coreano de BTS", "la tía chismosa", "el que le debe dinero", "un sugar daddy imaginario", 
      "un extraterrestre", "un fantasma de su casa", "el cobrador de Coppel", "el profe de matemáticas", 
      "la novia de su mejor amig@", "un otaku que no se baña", "alguien de Tinder", "el repartidor de DiDi", 
      "su suegra", "un bot de Discord", "el cantante de corridos tumbados"
    ];
    
    const endings = [
      "y después lo niega 💅👀", "y llora en el baño 💅👀", "en la madrugada 💅👀", "porque no tiene vida 💅👀", 
      "y da cringe 💅👀", "cuando nadie lo ve 💅👀", "y usa cuentas falsas para espiar 💅👀", "y jura que no sabemos 💅👀", 
      "y se siente inalcanzable 💅👀", "y sube indirectas a sus estados 💅👀", "y le reza a los santos 💅👀", 
      "y hace amarres con agua de calzón 💅👀", "y pide plata prestada para seguirlo 💅👀", "y ahora está escondid@ 💅👀", 
      "y cree que nadie se da cuenta 💅👀", "y se la pasa mendigando amor 💅👀", "y por eso anda sin saldo 💅👀", 
      "y se ofende si le dicen algo 💅👀", "y lo publica en mejores amigos 💅👀", "y se hace la vístima 💅👀", 
      "y por eso huele raro 💅👀", "y jura que es de broma 💅👀", "y luego pide terapia 💅👀", "y se lo toma muy personal 💅👀", 
      "y le copia la personalidad 💅👀", "y por eso lo funaron 💅👀", "y se cree la gran cosa 💅👀", 
      "y le echa la culpa al horóscopo 💅👀", "y sus papás lo saben 💅👀", "y se la pasa escuchando Morat 💅👀"
    ];

    const act = actions[Math.floor(Math.random() * actions.length)];
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const end = endings[Math.floor(Math.random() * endings.length)];
    const chisme = `${act} ${sub} ${end}`;
    const caption = `☕ *CHISME CALIENTITO* ☕\n\nMe pasaron el dato que @${randomUser.split('@')[0]} ${chisme}`;
    
    try {
      // Pick a gossipy interaction
      const inters = ['coffee', 'laugh', 'smug', 'peek', 'tickle', 'cringe'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=LumiBot-alya`);
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
