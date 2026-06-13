import fetch from 'node-fetch';

export default {
  command: ['8ball', 'bola8', 'pregunta'],
  category: 'anime',
  run: async (client, m, args) => {
    if (!args.length) return m.reply('🙄 *Bruh, y la pregunta?* 💅\n> Tienes que preguntarme algo para que te lea el futuro.');
    
    const respuestas = [
      "Literal, obvio que sí 💅",
      "Ni de broma, bájate de esa nube 🤡",
      "Sí, pero te va a costar tu estabilidad emocional 💀",
      "No sé, dímelo tú que eres tan list@ 👀",
      "Las estrellas dicen que no, y yo también 🙄",
      "Probablemente sí, pero igual vas a llorar 🔥",
      "Jajaja no, siguiente pregunta 😂",
      "Totalmente, apostaría mi código fuente a que sí ✨",
      "Ay amiga, ni rezando 💀",
      "Es más probable que tu ex te desbloquee a que eso pase 💅",
      "Sí, reina. Triunfando como siempre 👑",
      "No cuentes con ello, literal 🤡",
      "Hazte un favor y deja de preguntar tonterías 🙄",
      "El universo me dice que te busques un problema honesto 💀",
      "Mira, si te digo que sí, ¿me dejas en paz? 💅",
      "Definitivamente, pero no de la forma que tú quieres 👀",
      "Claro que sí, campeón 🏆 (sarcasmo)",
      "Ni en tus mejores sueños, amig@ 🤡",
      "Los astros se alinearon para decirte: NO ❌",
      "Sí, pero te vas a arrepentir de haberlo deseado 🔥",
      "Ojalá tuviera una respuesta, pero la verdad me dio pereza pensar 🥱",
      "Totalmente falso, como las promesas de tu ex 💅",
      "Sí. Ahora ve y sé feliz ✨",
      "No, y honestamente qué bueno porque sería un desastre 💀",
      "La respuesta está en tu corazón (y tu corazón dice que no) 🤡",
      "Podría ser... si la gravedad dejara de existir 🙄",
      "Sí, pero no le cuentes a nadie 🤫",
      "Me da cringe decirte esto, pero sí 💅",
      "Amig@, hasta Siri sabe que eso no va a pasar 📱",
      "Un rotundo sí. Compra lotería hoy 🍀",
      "Ni la IA más avanzada del mundo entendería por qué preguntas esto 💀",
      "No, literal, busca ayuda 🤡",
      "Tal vez. Depende de qué tan mal te portes 🔥",
      "Sí, pero con condiciones (y muchas lágrimas) 💧",
      "Absolutamente no. Y no me insistas 💅",
      "La respuesta es 404: Futuro no encontrado 💻",
      "Sí, te lo mereces (por una vez en tu vida) ✨",
      "No sé, hoy ando de mal humor, tómalo como un no 🙄",
      "Eso dicen los rumores 👀",
      "Definitivamente no. Qué oso 💀",
      "A veces las respuestas duelen, y esta es un NO gigante 🤡",
      "Sí, confía en el proceso 💅",
      "No, la vida no es una película de Netflix 🎬",
      "Claro, por qué no, me da igual 🥱",
      "Te diría que sí para hacerte sentir bien, pero soy de decir verdades 💀",
      "Mi bola de cristal se empañó del cringe, pero dice que sí ✨",
      "Sigue soñando, que es gratis 💅",
      "Es un secreto, pero te daré una pista: NO 🤡",
      "Sí, pero te va a salir carísimo 🔥",
      "Ni lo sueñes, literal 🙄",
      "Sí, prepárate para el impacto 💥",
      "No. Fin de la conversación 💅",
      "Probablemente no, pero inténtalo para reírme de ti 😂",
      "Cien por ciento confirmado ✨",
      "Los espíritus chocarreros dicen que no 👻",
      "Sí, y va a ser legendario 💀",
      "No, mejor dedícate a otra cosa 🤡",
      "Si me pagas te digo que sí 💸",
      "Las probabilidades son bajas, pero nunca cero (mentira, son cero) 💅"
    ];
    
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    const pregunta = args.join(' ');
    const caption = `🎱 *LA BOLA DE CRISTAL HABLA* 🎱\n\n> 🔮 *Preguntaste:* ${pregunta}\n> ✨ *Respuesta:* ${respuesta}`;
    
    try {
      const inters = ['thinkhard', 'think', 'curious', 'smug', 'nope', 'laugh', 'stare'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      m.reply(caption);
    }
  }
}
