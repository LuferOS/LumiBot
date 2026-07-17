import fetch from 'node-fetch';

export default {
  command: ['ruina', 'futuro', 'destino'],
  category: 'anime',
  run: async (client, m, args) => {
    const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(mentioned) || mentioned.startsWith('573118353868');
    if (isOwnerTarget) return m.reply(`💅 Literal LuferOS y los dueños tienen el futuro asegurado, su única ruina sería perder el tiempo contigo. 💅✨`);
    
    const ruinas = [
      "literal vas a arruinar tu vida volviendo con tu ex 💅🤡",
      "vas a gastar todos tus ahorros en algo que no necesitas por estrés 💸",
      "terminarás mandando un mensaje súper cringe de madrugada 💀",
      "vas a confiar en la persona equivocada otra vez (típico de ti) 🙄",
      "vas a pelear por orgullo y te quedarás sol@ ✨",
      "terminarás trabajando en algo que odias porque 'es lo que hay' 🤡",
      "vas a dejar todo para última hora y entrarás en pánico absoluto 🔥",
      "te vas a enamorar de alguien que literal vive a 5000 km ✈️💀",
      "vas a enviar un sticker inapropiado al grupo de la familia 💀",
      "te vas a quedar sin batería en medio de un chisme súper importante 📱",
      "le darás like por error a la foto del 2014 de la persona que stalkeas 💅",
      "vas a salir a la calle y te encontrarás a quien menos quieres ver 🤡",
      "vas a contar un secreto que no era tuyo y todo explotará 💣",
      "vas a intentar ser 'aesthetic' y terminarás viéndote como un meme andante ✨",
      "tu crush va a ver tu peor foto en tu peor ángulo 📸",
      "te vas a reír de un chiste en el momento más incómodo posible 💀",
      "tu mamá te va a gritar frente a tus amigos 🙄",
      "vas a intentar cocinar y terminarás pidiendo delivery quemando la casa 🍕",
      "vas a confesar tus sentimientos y te dejarán en 'leído' 💅",
      "tu Wi-Fi se va a caer justo cuando ibas a ganar la partida 🤡",
      "vas a decir 'tú también' cuando el mesero te diga 'buen provecho' 💀",
      "vas a intentar ligar y terminarás sonando como un vendedor de seguros 📝",
      "vas a fingir que entiendes de qué hablan para encajar, y te van a hacer una pregunta directa 👀",
      "te vas a quedar dormido y perderás algo súper importante 🛌",
      "tu mascota te va a humillar en público 🐕",
      "vas a tropezarte cuando intentes verte cool caminando 🤡",
      "vas a gastar en una suscripción anual que nunca usarás 💸",
      "vas a publicar algo creyéndote profundo y solo darás cringe 💀",
      "te vas a enamorar de un personaje ficticio de nuevo 💅",
      "vas a decir un chiste y habrá un silencio sepulcral 🦗",
      "vas a intentar arreglar algo y lo terminarás rompiendo peor 🛠️",
      "tu playlist oculta y vergonzosa se reproducirá en altavoz 🎵",
      "vas a saludar efusivamente a alguien que saludaba a la persona de atrás 👋🤡",
      "te van a dejar en la friendzone de nuevo, ya tienes VIP ahí 💳",
      "vas a pensar mucho algo súper obvio y te verás como tont@ 🙄",
      "vas a comprar ropa online y te llegará talla de muñeca 👗",
      "te vas a emocionar por un mensaje y será tu operadora 📱",
      "vas a empezar una discusión y te darás cuenta a la mitad que no tienes razón 💀",
      "vas a intentar hacer dieta y terminarás comiendo helado a las 3 AM 🍦",
      "vas a cortarte el pelo tú mism@ a las 2 AM y te arrepentirás ✨",
      "vas a mandar un audio llorando y luego te arrepentirás de tu existencia 🤡",
      "vas a fingir que leíste el libro y alguien te hará preguntas de la trama 📖",
      "vas a querer ser productivo pero verás 5 horas de TikTok 📱",
      "vas a ir a un lugar caro y tu tarjeta va a ser rechazada 💳",
      "te vas a poner celos@ de alguien que ni es tuyo 💅",
      "vas a dar un buen consejo que nunca vas a aplicar en tu vida 💀",
      "vas a prometerte 'no volver a hacerlo' y lo harás 5 minutos después 🤡",
      "vas a abrir la cámara frontal sin querer y te asustarás de tu propia cara 📸",
      "vas a intentar hacerte el difícil y se olvidarán de ti 🙄",
      "vas a pensar que le gustas pero solo era amable ✨",
      "te va a dar un ataque de risa en el lugar menos apropiado 💀",
      "vas a empezar a contar una anécdota y olvidarás el punto a la mitad 🗣️",
      "vas a intentar impresionar a alguien y te caerás 🤡",
      "vas a escribirle a tu ex 'para cerrar ciclos' 💅",
      "vas a creer que superaste algo, y luego escucharás ESA canción 🎵",
      "te vas a desvelar pensando en algo vergonzoso que hiciste en 2016 🛌",
      "vas a querer hacer un cambio de vida y durará 2 días ✨",
      "vas a enviar un pantallazo a la misma persona de la que estabas hablando 📱💀",
      "te vas a enamorar de la primera persona que te dé atención básica 🤡"
    ];
    
    const prediccion = ruinas[Math.floor(Math.random() * ruinas.length)];
    const caption = `🔮 *PREDICCIÓN DE TU RUINA* 🔮\n\n@${mentioned.split('@')[0]}, ${prediccion}`;
    
    try {
      const inters = ['cry', 'sad', 'cringe', 'scared', 'angry', 'trip', 'nope', 'laugh'];
      const inter = inters[Math.floor(Math.random() * inters.length)];
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=LumiBot-alya`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [mentioned] }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      await client.sendMessage(m.chat, { text: caption, mentions: [mentioned] }, { quoted: m });
    }
  }
}
