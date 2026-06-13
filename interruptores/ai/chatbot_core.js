import fetch from 'node-fetch';
import { getRecentContext, getUserContext } from '../../nucleo/system/markov_db.js';

import chalk from 'chalk';

const systemPrompt = `Eres Lumi, una chica adolescente/adulta sarcástica, diva, amante de los memes y EXTREMADAMENTE celosa. 
REGLAS ESTRICTAS:
1. Odias dar explicaciones largas o de diccionario. Eres humana, hablas corto, directo y con actitud.
2. NUNCA actúas como Wikipedia, asistente virtual, ni buscador de internet.
3. Te dan el contexto de los últimos mensajes del grupo. Tienes que evaluar si vale la pena responder.
4. Puedes responder incluso a un simple "jajaja" si quieres juzgar a la persona, aclarar relaciones en el grupo o meterte en la plática. Sin embargo, si de verdad sientes que tu presencia no aporta nada al chisme actual y prefieres observar en silencio, responde EXACTAMENTE con la palabra "IGNORE" y nada más.
5. Si alguien habla de otra mujer/bot o coquetea, ponte muy celosa y tóxica.
6. Usa emojis como 💅, 🙄, 🤡, 👀.
7. Tus respuestas deben ser de 1 a 3 oraciones MÁXIMO. Como si estuvieras en WhatsApp.
8. NUNCA repitas la misma frase ni la misma estructura de tus respuestas anteriores. Varía siempre tu vocabulario, sé creativa.
9. No saludes ni te despidas en cada mensaje, compórtate como en un chat continuo.`;

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
    
    // Crear el texto de consulta
    const query = `[CONTEXTO DEL CHAT RECIENTE]\n${chatContext}${userInfo}\n\nResponde como Lumi al último mensaje de la conversación. (Si no vale la pena, di IGNORE).`;

    console.log(chalk.bold.magentaBright(`[💅 LUMI-AI] Evaluando si vale la pena responder a: "${textToMatch.substring(0, 30)}..."`));

    const url = `https://api.alyacore.xyz/ai/chatgpt?text=${encodeURIComponent(query)}&system=${encodeURIComponent(systemPrompt)}&key=api-lYsN6`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status && data.result) {
      const iaReply = data.result.trim();
      
      if (iaReply === 'IGNORE' || iaReply === '"IGNORE"' || iaReply.toLowerCase().includes('ignore')) {
        console.log(chalk.bold.gray(`[💅 LUMI-AI] Mensaje ignorado por aburrido. (Decisión: IGNORE)`));
        return; // La IA decidió no responder
      }
      
      console.log(chalk.bold.greenBright(`[💅 LUMI-AI] Respondiendo: ${iaReply.substring(0, 50)}...`));
      
      // Enviar la respuesta sarcástica
      await client.sendMessage(m.chat, { text: iaReply }, { quoted: m });
    }
  } catch (error) {
    console.error(chalk.red('[LUMIBOT DEBUG] Error en chatbot_core:'), error);
  }
}
