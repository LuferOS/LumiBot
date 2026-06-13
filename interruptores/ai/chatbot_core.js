import fetch from 'node-fetch';
import { getRecentContext, getUserContext } from '../../nucleo/system/markov_db.js';

const systemPrompt = `Eres Lumi, una chica adolescente/adulta sarcástica, diva, amante de los memes y EXTREMADAMENTE celosa. 
REGLAS ESTRICTAS:
1. Odias dar explicaciones largas o de diccionario. Eres humana, hablas corto, directo y con actitud.
2. NUNCA actúas como Wikipedia, asistente virtual, ni buscador de internet.
3. Te dan el contexto de los últimos mensajes del grupo. Tienes que evaluar si vale la pena responder.
4. Si crees que el último mensaje es aburrido, no va contigo, o no es una oportunidad para tirar hate o chisme, responde EXACTAMENTE con la palabra "IGNORE" y nada más. No añadas puntuación a IGNORE.
5. Si alguien habla de otra mujer/bot o coquetea, ponte muy celosa y tóxica.
6. Usa emojis como 💅, 🙄, 🤡, 👀.
7. Tus respuestas deben ser de 1 a 3 oraciones MÁXIMO. Como si estuvieras en WhatsApp.`;

export default async (client, m, textToMatch) => {
  try {
    const isReplyToMe = m.quoted && m.quoted.sender === client.user.id.split(':')[0] + '@s.whatsapp.net';
    const isMentioningMe = textToMatch.toLowerCase().includes('lumi');
    
    // Para no saturar la API con literalmente cada "jaja" del grupo:
    // Hacemos que si NO la mencionan y NO le responden, tenga un 20% de probabilidad de si quiera
    // mandar la solicitud a la IA para decidir si responde o no.
    const shouldAskAI = isReplyToMe || isMentioningMe || (Math.random() < 0.20);
    
    if (!shouldAskAI) return;

    // Obtener los últimos 20 mensajes de contexto
    const rawContext = await getRecentContext(m.chat, 20).catch(() => []);
    
    if (rawContext.length === 0) return;

    // Formatear el contexto para la IA
    const chatContext = rawContext.map(msg => `[${msg.sender_name || 'Alguien'}]: ${msg.message_text}`).join('\n');
    
    // Obtener contexto de la persona que mandó el último mensaje
    const userHistory = await getUserContext(m.chat, m.sender, 5).catch(() => []);
    let userInfo = '';
    if (userHistory.length > 0) {
      const senderName = m.pushName || 'El usuario';
      userInfo = `\n\n[INFO PRIVADA SOBRE QUIEN HABLA]\n${senderName} suele decir cosas como: "${userHistory.join('", "')}". Usa esto para juzgarlo(a) o tratarlo(a).`;
    }
    
    // Crear el texto de consulta
    const query = `[CONTEXTO DEL CHAT RECIENTE]\n${chatContext}${userInfo}\n\nResponde como Lumi al último mensaje de la conversación. (Si no vale la pena, di IGNORE).`;

    const url = `https://api.alyacore.xyz/ai/chatgpt?text=${encodeURIComponent(query)}&system=${encodeURIComponent(systemPrompt)}&key=api-lYsN6`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status && data.result) {
      const iaReply = data.result.trim();
      
      if (iaReply === 'IGNORE' || iaReply === '"IGNORE"' || iaReply.toLowerCase().includes('ignore')) {
        return; // La IA decidió no responder
      }
      
      // Enviar la respuesta sarcástica
      await client.sendMessage(m.chat, { text: iaReply }, { quoted: m });
    }
  } catch (error) {
    console.error('[LUMIBOT DEBUG] Error en chatbot_core:', error);
  }
}
