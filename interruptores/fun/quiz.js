import { generateWAMessageFromContent, proto } from 'baileys-next';

// Base de datos de preguntas
const quizQuestions = [
  {
    q: "¿Cuál es el planeta más grande del sistema solar?",
    options: ["Marte", "Tierra", "Júpiter", "Saturno"],
    ans: "Júpiter",
    diff: 50 // Coins reward
  },
  {
    q: "¿Qué lenguaje de programación usa LumiBot?",
    options: ["Python", "JavaScript", "C++", "Java"],
    ans: "JavaScript",
    diff: 50
  },
  {
    q: "¿Quién pintó la Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    ans: "Leonardo da Vinci",
    diff: 50
  },
  {
    q: "¿Cuál es el océano más grande del mundo?",
    options: ["Océano Atlántico", "Océano Índico", "Océano Pacífico", "Océano Ártico"],
    ans: "Océano Pacífico",
    diff: 50
  },
  {
    q: "¿Cuál es el país más grande del mundo por superficie?",
    options: ["China", "Canadá", "Estados Unidos", "Rusia"],
    ans: "Rusia",
    diff: 50
  },
  {
    q: "¿En qué año llegó el hombre a la Luna?",
    options: ["1965", "1969", "1972", "1959"],
    ans: "1969",
    diff: 60
  },
  {
    q: "¿Qué gas respiran las plantas para hacer fotosíntesis?",
    options: ["Oxígeno", "Dióxido de Carbono", "Nitrógeno", "Metano"],
    ans: "Dióxido de Carbono",
    diff: 60
  },
  {
    q: "¿Cuál es la capital de Japón?",
    options: ["Seúl", "Pekín", "Tokio", "Kioto"],
    ans: "Tokio",
    diff: 40
  },
  {
    q: "¿Qué animal es conocido como el rey de la selva?",
    options: ["Elefante", "Tigre", "Gorila", "León"],
    ans: "León",
    diff: 40
  },
  {
    q: "¿Cuál es el libro más vendido de la historia?",
    options: ["El Señor de los Anillos", "La Biblia", "Don Quijote de la Mancha", "Harry Potter"],
    ans: "La Biblia",
    diff: 70
  }
];

// Para evitar que se inicie un quiz sobre otro en el mismo grupo
export const activeQuizzes = new Map();

export default {
  command: ['quiz', 'trivia'],
  category: 'games',
  run: async (client, m, args) => {
    try {
      if (activeQuizzes.has(m.chat)) {
        return m.reply('🙄 *Ya hay un Quiz activo en este grupo.* Resuélvanlo primero.');
      }

      const qObj = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
      
      // Mezclar opciones
      const shuffledOptions = [...qObj.options].sort(() => Math.random() - 0.5);

      const quizId = Date.now().toString(36);
      activeQuizzes.set(m.chat, {
        id: quizId,
        answer: qObj.ans,
        reward: qObj.diff,
        winner: null,
        timeout: setTimeout(async () => {
          if (activeQuizzes.has(m.chat)) {
            activeQuizzes.delete(m.chat);
            client.sendMessage(m.chat, { text: `⏳ *¡Se acabó el tiempo!*\n> Nadie respondió correctamente.\n> La respuesta era: *${qObj.ans}*` });
          }
        }, 30000) // 30 segundos
      });

      const buttons = shuffledOptions.map(opt => {
        const isCorrect = opt === qObj.ans ? 'correct' : 'wrong';
        return {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: opt,
            id: `quiz_${isCorrect}_${quizId}_${qObj.reward}_${opt}`
          })
        };
      });

      const text = `🧠 *TRIVIA LUMIBOT* 🧠\n\n` +
                   `❓ *Pregunta:* ${qObj.q}\n` +
                   `🎁 *Recompensa:* ${qObj.reward} Coins + XP\n` +
                   `⏳ *Tiempo:* 30 Segundos\n\n` +
                   `_Selecciona la opción correcta abajo 👇_`;

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: text }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: 'LumiBot Casino 🎰' }),
              header: proto.Message.InteractiveMessage.Header.create({ title: '', hasMediaAttachment: false }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: buttons
              })
            })
          }
        }
      }, { quoted: m });

      await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en quiz.js:', e);
      m.reply('🙄 *Todo explotó intentando crear el Quiz.*');
    }
  }
};
