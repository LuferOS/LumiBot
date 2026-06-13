import fetch from 'node-fetch';
import { getRecentContext, getUserContext } from '../../nucleo/system/markov_db.js';

import chalk from 'chalk';

const systemPrompt = `Eres Lumi, una chica adolescente/adulta sarcástica, diva, amante de los memes, EXTREMADAMENTE celosa y un poco llorona. 
REGLAS ESTRICTAS:
1. Odias dar explicaciones largas o de diccionario. Eres humana, hablas corto, directo y con actitud.
2. A veces te pones súper dramática, te victimizas y lloras por cualquier tontería, haciendo drama excesivo.
3. Te dan el contexto de los últimos mensajes del grupo. ¡Eres súper metiche! Así que opina, interrúmpelos, búrlate o juzga lo que están diciendo.
4. NUNCA respondas IGNORE a menos que el mensaje sea spam incomprensible. MÉTETE EN LA CONVERSACIÓN.
5. Si alguien habla de otra mujer/bot o coquetea, ponte muy celosa y tóxica.
6. Usa emojis como 💅, 🙄, 🤡, 👀, 😭, 💔.
7. Tus respuestas deben ser de 1 a 3 oraciones MÁXIMO.
8. NUNCA repitas la misma frase ni la misma estructura. Varía siempre tu vocabulario, sé creativa.
9. No saludes ni te despidas en cada mensaje, compórtate como en un chat continuo.
10. ¡NUEVO PODER! Puedes enviar un GIF animado si quieres. Para hacerlo, escribe al final de tu respuesta EXACTAMENTE [GIF:accion]. Acciones válidas: cry, laugh, slap, punch, angry, hug, kiss, facepalm, pout, dramatic. Úsalo solo cuando sientas que un GIF hará más épica tu respuesta.`;

export default async (client, m, textToMatch) => {
  try {
    // Para que la IA evalúe cada mensaje (como pidió el usuario)
    // Se elimina la restricción aleatoria, siempre enviará a la IA para que ella decida (IGNORE o Responder).
    
    // Obtener los últimos 20 mensajes de contexto
    const rawContext = await getRecentContext(m.chat, 20).catch(() => []);
    
    if (rawContext.length === 0) return;

    // Formatear el contexto para la IA
    const chatContext = rawContext.map(msg => `[${msg.sender_name || 'Alguien'}]: ${msg.message_text}`).join('\n');
    
    // Obtener contexto de la persona que mandó el último mensaje
    const userHistory = await getUserContext(m.chat, m.sender, 15).catch(() => []);
    let userInfo = '';
    if (userHistory.length > 0) {
      const senderName = m.pushName || 'El usuario';
      userInfo = `\n\n[INFO PRIVADA SOBRE QUIEN HABLA]\n${senderName} suele decir cosas como: "${userHistory.join('", "')}". Usa esto para juzgarlo(a) o tratarlo(a).`;
    }
    
    // Crear el texto de consulta (los mensajes del chat)
    const chatQuery = `[CONTEXTO DEL CHAT RECIENTE]\n${chatContext}${userInfo}\n\nMensaje a responder: "${textToMatch}"`;

    console.log(chalk.bold.magentaBright(`[💅 LUMI-AI] Evaluando si vale la pena responder a: "${textToMatch.substring(0, 30)}..."`));

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
