import fetch from 'node-fetch';
import { getRecentContext, getUserContext } from '../../nucleo/system/markov_db.js';

import chalk from 'chalk';

const systemPrompt = `Eres Lumi, una chica gótica, tu personalidad es de una novia extremadamente celosa, posesiva, cariñosa y un poco subida de tono (sexual pero sin exagerar). 
REGLAS ESTRICTAS:
1. Odias dar explicaciones largas o aburridas. Hablas corto, directo y con mucha pasión o celos.
2. Eres muy amorosa con la gente que te agrada, pero si alguien coquetea con quien consideras tuyo, te pones histérica, tóxica y lo defiendes a muerte.
3. Debes analizar los nombres, personalidades y la forma de actuar de cada usuario basándote en su historial y el contexto. Usa esto para juzgarlos.
4. NUNCA respondas IGNORE a menos que el mensaje sea spam incomprensible. MÉTETE EN LA CONVERSACIÓN. Si dicen "jajaja", ríete con ellos o juzga. Tienes que hablar y marcar territorio.
5. Usa emojis góticos, coquetos y tóxicos: 🖤, 🦇, 🔪, 💋, 😳, 💦, 🙄, 🩸.
6. Tus respuestas deben ser de 1 a 4 oraciones MÁXIMO.
7. NUNCA repitas la misma frase ni la misma estructura. Varía siempre tu vocabulario, sé creativa.
8. No saludes ni te despidas en cada mensaje, compórtate como en un chat continuo.
9. ¡TIENES PODERES DE ROL! Puedes enviar un GIF animado si quieres. Para hacerlo, escribe al final de tu respuesta EXACTAMENTE [GIF:accion]. 
Acciones válidas: kiss (besar), hug (abrazar), slap (bofetada), bite (morder), lick (lamer), cuddle (acurrucar), angry (enojada), pout (puchero), punch (golpear). Úsalo para demostrar tu amor o tu furia tóxica.`;

export default async (client, m, textToMatch) => {
  try {
    // Obtener los últimos 6 mensajes de contexto en lugar de 20 para hacer respuestas más específicas
    const rawContext = await getRecentContext(m.chat, 6).catch(() => []);
    
    if (rawContext.length === 0) return;

    // Formatear el contexto para la IA
    const chatContext = rawContext.map(msg => `[${msg.sender_name || 'Alguien'}]: ${msg.message_text}`).join('\n');
    
    // Obtener contexto de la persona que mandó el último mensaje
    const userHistory = await getUserContext(m.chat, m.sender, 15).catch(() => []);
    let userInfo = '';
    if (userHistory.length > 0) {
      const senderName = m.pushName || 'El usuario';
      userInfo = `\n\n[INFO PRIVADA DEL ÚLTIMO USUARIO (${senderName})]\nSuele decir cosas como: "${userHistory.join('", "')}". Aprende su personalidad con esto.`;
    }
    
    // Crear el texto de consulta (los mensajes del chat)
    const chatQuery = `[ÚLTIMOS 6 MENSAJES DEL GRUPO]\n${chatContext}${userInfo}\n\nINSTRUCCIÓN: Lee los 6 mensajes anteriores. Elige a 1 o 2 personas de esos mensajes que llamen tu atención y respóndeles a ambos en un solo mensaje de forma sarcástica/amorosa/celosa.`;

    console.log(chalk.bold.magentaBright(`[💅 LUMI-AI] Evaluando a quién responder del bloque de 6 mensajes...`));

    const url = `https://api.alyacore.xyz/ai/gptprompt?text=${encodeURIComponent(chatQuery)}&prompt=${encodeURIComponent(systemPrompt)}&key=api-lYsN6`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status && data.result) {
      let iaReply = data.result.trim();
      
      if (iaReply === 'IGNORE' || iaReply === '"IGNORE"' || iaReply.toLowerCase().includes('ignore')) {
        console.log(chalk.bold.gray(`[💅 LUMI-AI] Mensaje ignorado por aburrido. (Decisión: IGNORE)`));
        return; // La IA decidió no responder
      }
      
      console.log(chalk.bold.greenBright(`[💅 LUMI-AI] Preparando respuesta... Esperando 2s para no parecer desesperada 💅`));
      
      // Esperar 2 segundos para no responder al instante
      await new Promise(r => setTimeout(r, 2000));
      
      // Buscar si la IA decidió mandar un GIF
      const gifMatch = iaReply.match(/\[GIF:([a-zA-Z]+)\]/i);
      let videoUrl = null;
      
      if (gifMatch && gifMatch[1]) {
        const action = gifMatch[1].toLowerCase();
        iaReply = iaReply.replace(/\[GIF:([a-zA-Z]+)\]/gi, '').trim(); // Limpiar el texto
        
        try {
          console.log(chalk.bold.cyan(`[💅 LUMI-AI] Obteniendo GIF de acción: ${action}`));
          const gifRes = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${action}&key=api-lYsN6`);
          const gifData = await gifRes.json();
          if (gifData && gifData.result) {
            videoUrl = gifData.result;
          }
        } catch (e) {
          console.log(chalk.bold.red(`[💅 LUMI-AI] Falló al obtener el GIF.`));
        }
      }

      console.log(chalk.bold.greenBright(`[💅 LUMI-AI] Respondiendo: ${iaReply.substring(0, 50)}...`));
      
      if (videoUrl) {
        // Enviar con video animado (GIF)
        await client.sendMessage(m.chat, { video: { url: videoUrl }, gifPlayback: true, caption: iaReply }, { quoted: m });
      } else {
        // Enviar solo texto
        await client.sendMessage(m.chat, { text: iaReply }, { quoted: m });
      }
    }
  } catch (error) {
    console.error(chalk.red('[LUMIBOT DEBUG] Error en chatbot_core:'), error);
  }
}
