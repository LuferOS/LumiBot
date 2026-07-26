import fetch from 'node-fetch';

export default {
  command: ['verdad'],
  category: 'juegos',
  run: async (client, m) => {
    const verdades = [
  {
    "text": "¿Cuál es tu peor hábito? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Alguna vez te cacharon haciendo el ridículo? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Has mentido sobre tu edad? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Has mentido sobre tu dinero? 💅",
    "inter": "scared"
  },
  {
    "text": "¿Has mentido sobre tus notas? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Cuál es tu peor mentira? 💅",
    "inter": "curious"
  },
  {
    "text": "¿Alguna vez te cacharon hablando solo/a? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Has mentido sobre tu virginidad? 💅",
    "inter": "peek"
  },
  {
    "text": "¿Es verdad que tú le debes dinero a alguien? 💅",
    "inter": "shy"
  },
  {
    "text": "¿Has fingido no tener señal para conseguir plata? 💅",
    "inter": "blush"
  },
  {
    "text": "¿Alguna vez te cacharon stalkenado? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Qué opinas realmente de la última persona que habló? 💅",
    "inter": "scared"
  },
  {
    "text": "¿Cuál es tu peor miedo? 💅",
    "inter": "happy"
  },
  {
    "text": "¿A quién del grupo le le revisarías el celular? 💅",
    "inter": "scared"
  },
  {
    "text": "¿Alguna vez te cacharon viendo nopor? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has mentido sobre tus gustos? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Has fingido estar ocupad@ para conseguir un favor? 💅",
    "inter": "shy"
  },
  {
    "text": "¿Has fingido un orgasmo para conseguir no salir? 💅",
    "inter": "curious"
  },
  {
    "text": "¿Has mentido sobre tu nombre real? 💅",
    "inter": "sad"
  },
  {
    "text": "¿Has fingido tener dinero para conseguir un regalo? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Es verdad que tú usas ropa interior rota? 💅",
    "inter": "stare"
  },
  {
    "text": "¿A quién del grupo le odias en secreto? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Alguna vez te cacharon llorando por un ex? 💅",
    "inter": "curious"
  },
  {
    "text": "¿A quién del grupo le tienes envidia? 💅",
    "inter": "shy"
  },
  {
    "text": "¿Has fingido estar enferm@ para conseguir atención? 💅",
    "inter": "coffee"
  },
  {
    "text": "¿Cuál es tu peor mensaje enviado? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Qué opinas realmente de tu ex? 💅",
    "inter": "nope"
  },
  {
    "text": "¿A quién del grupo le le dejarías de hablar? 💅",
    "inter": "sad"
  },
  {
    "text": "¿Cuál es tu peor secreto? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Has mentido sobre tu ex? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Alguna vez te cacharon cantando mal? 💅",
    "inter": "curious"
  },
  {
    "text": "¿Qué opinas realmente de tu familia? 💅",
    "inter": "cry"
  },
  {
    "text": "¿Has fingido estar ocupad@ para conseguir pasar una materia? 💅",
    "inter": "coffee"
  },
  {
    "text": "¿Has fingido no tener señal para conseguir que te dejen en paz? 💅",
    "inter": "shy"
  },
  {
    "text": "¿Has fingido estar durmiendo para conseguir atención? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Cuál es tu peor foto en galería? 💅",
    "inter": "smug"
  },
  {
    "text": "¿Alguna vez te cacharon cayéndote? 💅",
    "inter": "sad"
  },
  {
    "text": "¿A quién del grupo le le bloquearías? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has fingido tener dinero para conseguir un beso? 💅",
    "inter": "blush"
  },
  {
    "text": "¿Has fingido tener dinero para conseguir un favor? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Es verdad que tú no te bañas seguido? 💅",
    "inter": "scared"
  },
  {
    "text": "¿A quién del grupo le le stalkeas? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Es verdad que tú tienes una cuenta falsa? 💅",
    "inter": "curious"
  },
  {
    "text": "¿Has fingido no tener señal para conseguir ir a una fiesta? 💅",
    "inter": "cry"
  },
  {
    "text": "¿Qué opinas realmente de el admin? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Has fingido saber inglés para conseguir que te dejen en paz? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Has fingido estar feliz para conseguir un favor? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Has fingido llorar para conseguir amor? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has mentido sobre lo que hacías ayer? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Es verdad que tú sigues amando a tu ex? 💅",
    "inter": "peek"
  },
  {
    "text": "¿Alguna vez te cacharon siendo infiel? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Has mentido sobre con quién hablas? 💅",
    "inter": "cringe"
  },
  {
    "text": "¿Cuál es tu peor compra? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Es verdad que tú odias tu vida? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has fingido tener dinero para conseguir ir a una fiesta? 💅",
    "inter": "sad"
  },
  {
    "text": "¿Has fingido saber inglés para conseguir ir a una fiesta? 💅",
    "inter": "peek"
  },
  {
    "text": "¿Qué opinas realmente de la persona que te gusta? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Qué opinas realmente de ti mism@? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Es verdad que tú eres otaku de clóset? 💅",
    "inter": "stare"
  },
  {
    "text": "¿Qué opinas realmente de tu profesor? 💅",
    "inter": "coffee"
  },
  {
    "text": "¿Cuál es tu peor experiencia? 💅",
    "inter": "sad"
  },
  {
    "text": "¿Has mentido sobre tu peso? 💅",
    "inter": "scared"
  },
  {
    "text": "¿A quién del grupo le le tienes ganas? 💅",
    "inter": "smug"
  },
  {
    "text": "¿Has fingido que te gustaba para conseguir un favor? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Es verdad que tú eres virgen? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Cuál es tu peor fantasía? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has fingido saber inglés para conseguir atención? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Alguna vez te cacharon robando? 💅",
    "inter": "coffee"
  },
  {
    "text": "¿Has fingido estar feliz para conseguir pasar una materia? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Es verdad que tú no sabes cocinar? 💅",
    "inter": "smug"
  },
  {
    "text": "¿Has fingido estar durmiendo para conseguir no salir? 💅",
    "inter": "nope"
  },
  {
    "text": "¿Es verdad que tú lloras todas las noches? 💅",
    "inter": "angry"
  },
  {
    "text": "¿A quién del grupo le le tirarías hate? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Qué opinas realmente de tu mejor amig@? 💅",
    "inter": "cry"
  },
  {
    "text": "¿Has fingido estar enferm@ para conseguir pasar una materia? 💅",
    "inter": "scared"
  },
  {
    "text": "¿Cuál es tu peor sueño húmedo? 💅",
    "inter": "sad"
  },
  {
    "text": "¿A quién del grupo le le robarías? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Has fingido estar feliz para conseguir plata? 💅",
    "inter": "shy"
  },
  {
    "text": "¿Alguna vez te cacharon mintiendo? 💅",
    "inter": "scared"
  },
  {
    "text": "¿Has fingido un orgasmo para conseguir amor? 💅",
    "inter": "angry"
  },
  {
    "text": "¿Qué opinas realmente de tu suegra? 💅",
    "inter": "curious"
  },
  {
    "text": "¿Has fingido estar enferm@ para conseguir amor? 💅",
    "inter": "laugh"
  },
  {
    "text": "¿Has fingido estar ocupad@ para conseguir plata? 💅",
    "inter": "happy"
  },
  {
    "text": "¿Has fingido un orgasmo para conseguir plata? 💅",
    "inter": "cry"
  },
  {
    "text": "¿Has fingido llorar para conseguir un favor? 💅",
    "inter": "stare"
  }
];
    const resp = verdades[Math.floor(Math.random() * verdades.length)];
    const caption = `🎯 *VERDAD INCOMODA* 🎯\n\n> ${resp.text}\n\nResponde con la verdad o eres gallina. 🐔💅`;
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${resp.inter}&key=LumiBot-alya`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      await m.reply(caption);
    }
  }
}
