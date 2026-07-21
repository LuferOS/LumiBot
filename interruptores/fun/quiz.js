import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const preguntasPath = path.resolve('interruptores/fun/preguntas.json');
export const activeQuizzes = new Map();

// Normalizador avanzado (Quita tildes, mayúsculas y espacios extra)
const normalizeText = (text) => {
    return text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() : "";
};

let isListenerActive = false;

// Buscador de Pinterest
async function fetchPinterestImage(query) {
    try {
        const urlCausas = `https://rest.apicausas.xyz/api/v1/buscadores/pinterest?apikey=causa-60ca3fea34a7af43&q=${encodeURIComponent(query)}`;
        const res = await fetch(urlCausas);
        const data = await res.json();
        if (data.status && data.data && data.data.length > 0) {
            let item = data.data[Math.floor(Math.random() * Math.min(5, data.data.length))];
            let url = typeof item === 'string' ? item : (item?.url || item?.image || item?.src);
            if (url && typeof url === 'string' && url.startsWith('http')) return url;
        }
    } catch (e) {
        console.error('[PINTEREST CAUSAS ERROR]', e.message);
    }

    try {
        const urlAlya = `https://api.alyacore.xyz/api/pinterest?q=${encodeURIComponent(query)}&key=LumiBot-alya`;
        const res2 = await fetch(urlAlya);
        const data2 = await res2.json();
        if (data2.status && data2.results && data2.results.length > 0) {
            let item = data2.results[Math.floor(Math.random() * Math.min(5, data2.results.length))];
            let url = typeof item === 'string' ? item : (item?.url || item?.image || item?.src);
            if (url && typeof url === 'string' && url.startsWith('http')) return url;
        }
    } catch (e) {
        console.error('[PINTEREST ALYA ERROR]', e.message);
    }
    return null;
}

export default {
  command: ['quiz', 'trivia'],
  category: 'games',
  run: async (client, m, args, usedPrefix, command) => {

    // 🟢 INYECCIÓN DEL ESCUCHADOR GLOBAL 🟢
    if (!isListenerActive && client.ev) {
        client.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;
            const msg = messages[0];
            if (!msg || msg.key.fromMe) return;

            const chat = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            
            const userText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || "";
            
            if (!userText || !activeQuizzes.has(chat)) return;

            const quiz = activeQuizzes.get(chat);
            
            if (quiz.answer === '___loading___') return;

            // Si el usuario ya intentó responder y falló, lo ignoramos para dar oportunidad a otros
            if (quiz.triedUsers && quiz.triedUsers.has(sender)) return;

            let cleanUserText = userText.replace(/^[a-d]\)\s*/i, "");
            
            const userAns = normalizeText(cleanUserText);
            const correctAns = normalizeText(quiz.answer);

            // COMPROBACIÓN DE VICTORIA
            if (userAns === correctAns) {
                clearTimeout(quiz.timeout);
                activeQuizzes.delete(chat);
                
                // 💾 --- GUARDADO EN BASE DE DATOS --- 💾
                let users = global.db.data.users;
                
                // Asegurarse de que el usuario existe en la BD
                if (!users[sender]) {
                    users[sender] = { coins: 0, exp: 0 }; // Inicializar si es nuevo
                }

                // Sumar victoria según el modo
                if (quiz.mode === 'dificil') {
                    users[sender].quizWinsDificil = (users[sender].quizWinsDificil || 0) + 1;
                } else {
                    users[sender].quizWins = (users[sender].quizWins || 0) + 1;
                }

                // Sumar la recompensa (ajusta 'coins' o 'exp' según la economía de tu bot)
                users[sender].coins = (users[sender].coins || 0) + quiz.reward;
                users[sender].exp = (users[sender].exp || 0) + quiz.reward; // Sumando XP también
                // ----------------------------------------

                await client.sendPresenceUpdate('composing', chat);
                await delay(1500);

                await client.sendMessage(chat, { 
                    text: `🎉 *¡TENEMOS UN GANADOR!* 🎉\n\n@${sender.split('@')[0]} fue el más rápido.\n\n> ✅ *Respuesta correcta:* ${quiz.answer}\n🎁 *Recompensa:* ${quiz.reward} Coins\n📈 *Racha en ${quiz.mode}:* ${quiz.mode === 'dificil' ? users[sender].quizWinsDificil : users[sender].quizWins} victorias.`,
                    mentions: [sender] 
                }, { quoted: msg });
            } else {
                // Respuesta incorrecta: el usuario pierde su oportunidad en este quiz
                if (!quiz.triedUsers) quiz.triedUsers = new Set();
                quiz.triedUsers.add(sender);
                // Reaccionamos sutilmente para avisarle que falló, sin hacer spam
                await client.sendMessage(chat, { react: { text: '❌', key: msg.key } });
            }
        });
        
        isListenerActive = true;
        console.log('[LUMIBOT NÚCLEO] 🎧 Interceptor global de respuestas activado (Con Base de Datos).');
    }

    try {
      const mode = args[0]?.toLowerCase();

      if (!mode || !['facil', 'dificil'].includes(mode)) {
          return m.reply(`🤔 *CÓMO JUGAR LUMI QUIZ* 🤔\n\nElige la dificultad escribiendo uno de estos comandos:\n\n> 🟢 *${usedPrefix}${command} facil*\n_(Opciones A,B,C,D. Recompensa: 50 Coins. Tiempo: 20s)_\n\n> 🔴 *${usedPrefix}${command} dificil*\n_(Sin opciones. Recompensa: 150 Coins. Tiempo: 10s)_`);
      }

      if (activeQuizzes.has(m.chat)) {
        return m.reply('🙄 *Ya hay un Quiz activo o cargándose en este grupo.* Resuélvanlo primero.');
      }

      activeQuizzes.set(m.chat, { answer: '___loading___', timeout: null });

      let quizQuestions = [];
      try {
          quizQuestions = JSON.parse(fs.readFileSync(preguntasPath, 'utf-8'));
      } catch (e) {
          activeQuizzes.delete(m.chat);
          return m.reply('❌ *Error:* No se encontró el archivo de preguntas o está vacío.');
      }

      if (quizQuestions.length === 0) {
          activeQuizzes.delete(m.chat);
          return m.reply('❌ *Error:* La base de datos de preguntas está vacía.');
      }

      const qObj = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
      const isDificil = mode === 'dificil';
      const reward = isDificil ? 150 : 50;
      const timeoutMs = isDificil ? 10000 : 20000; 
      const quizId = Date.now().toString(36);

      let imgUrl = await fetchPinterestImage(qObj.ans);
      let imgBuffer = null;

      if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
          try {
              const reqImg = await fetch(imgUrl);
              const arrayBuf = await reqImg.arrayBuffer();
              imgBuffer = Buffer.from(arrayBuf);
          } catch (e) {
              console.error('[LUMIBOT DEBUG] Error al descargar imagen en Buffer:', e.message);
          }
      }
      
      let text = `🧠 *TRIVIA LUMIBOT (${mode.toUpperCase()})* 🧠\n\n`;
      text += `❓ *Pregunta:* ${qObj.q}\n\n`;

      if (!isDificil) {
          const letras = ['A)', 'B)', 'C)', 'D)'];
          qObj.options.forEach((opt, idx) => {
              text += `*${letras[idx]}* ${opt}\n`;
          });
          text += `\n⚠️ *(Debes escribir la respuesta completa, no la letra!)*\n`;
      } else {
          text += `💀 *¡SIN OPCIONES! Escribe la respuesta correcta.* 💀\n\n`;
      }

      text += `🎁 *Recompensa:* ${reward} Coins + XP\n`;
      text += `⏳ *Tiempo:* ${timeoutMs / 1000} Segundos\n`;

      let msgOptions = {};
      if (imgBuffer) {
          msgOptions = { image: imgBuffer, caption: text };
      } else {
          msgOptions = { text: text };
      }

      await client.sendMessage(m.chat, msgOptions, { quoted: m });

      // Guardamos la modalidad ('facil' o 'dificil') en el activeQuizzes para poder registrarla en la BD
      activeQuizzes.set(m.chat, {
        id: quizId,
        answer: qObj.ans,
        reward: reward,
        mode: mode,
        triedUsers: new Set(),
        winner: null,
        timeout: setTimeout(async () => {
          if (activeQuizzes.has(m.chat)) {
            activeQuizzes.delete(m.chat);
            client.sendMessage(m.chat, { text: `⏳ *¡Se acabó el tiempo del modo ${mode}!*\n> Nadie respondió correctamente a tiempo.\n> La respuesta era: *${qObj.ans}*` });
          }
        }, timeoutMs)
      });

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en quiz.js:', e);
      if (activeQuizzes.has(m.chat)) {
          const q = activeQuizzes.get(m.chat);
          if (q && q.timeout) clearTimeout(q.timeout);
          activeQuizzes.delete(m.chat);
      }
      m.reply('🙄 *Todo explotó intentando crear el Quiz.*');
    }
  }
};
