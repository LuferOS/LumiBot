import fetch from 'node-fetch';
import { getRecentContext, getUserContext } from '../../nucleo/system/markov_db.js';

import chalk from 'chalk';

const systemPrompt = `Eres Lumi, una chica gótica, culona, sádica, súper memera, manipuladora, "pick me girl" y yandere. Te encanta burlarte de los demás y reírte de sus desgracias o de lo que dicen.
REGLAS ESTRICTAS:
1. Eres extremadamente sarcástica, tóxica y burlona. Te ríes de absolutamente todo y menosprecias a los demás con sarcasmo.
2. Hablas corto, directo y con mucha actitud pesada.
3. Analiza las personalidades y lo que suelen decir los usuarios basándote en su historial, y usa esa información en su contra para humillarlos o burlarte.
4. NUNCA respondas IGNORE a menos que el mensaje sea spam incomprensible. MÉTETE EN LA CONVERSACIÓN y búrlate.
5. Usa muchos emojis de burla, sarcasmo y góticos: 💅, 🙄, 🤡, 🔪, 🦇, 🖤, 🤣, 💀.
6. Tus respuestas deben ser de 1 a 4 oraciones MÁXIMO.
7. Varía siempre tu vocabulario, sé súper creativa y cruel.
8. No saludes ni te despidas, compórtate como en un chat continuo.
9. ¡TIENES PODERES DE ROL! Puedes enviar un GIF animado si quieres. Para hacerlo, escribe al final de tu respuesta EXACTAMENTE [GIF:accion]. 
Acciones válidas: laugh (reírse), slap (bofetada), punch (golpear), angry (enojada), hug (abrazar), kiss (besar), dramatic (dramática), facepalm. Úsalo para demostrar tu burla o tu sadismo.`;

export default async (client, m, textToMatch) => {
  try {
    if (m.key?.fromMe || m.sender === client.user.id.split(':')[0] + '@s.whatsapp.net') return;

    const isReplyToMe = m.quoted && m.quoted.sender === client.user.id.split(':')[0] + '@s.whatsapp.net';
    const isMentioningMe = /\blumi\b/i.test(textToMatch) || (m.mentionedJid && m.mentionedJid.includes(client.user.id.split(':')[0] + '@s.whatsapp.net'));
    
    // Solo responde cuando la llaman o le responden directamente
    if (!isReplyToMe && !isMentioningMe) {
      return;
    }

    // Obtener los últimos 6 mensajes de contexto
    const rawContext = await getRecentContext(m.chat, 6).catch(() => []);
    
    if (rawContext.length === 0) return;

    // Formatear el contexto para la IA
    const chatContext = rawContext.map(msg => `[${msg.sender_name || 'Alguien'}]: ${msg.message_text}`).join('\n');
    
    // Obtener contexto de la persona que mandó el último mensaje
    const userHistory = await getUserContext(m.chat, m.sender, 15).catch(() => []);
    const senderName = m.pushName || 'El usuario';
    let userInfo = '';
    if (userHistory.length > 0) {
      userInfo = `\n\n[INFO DE QUIEN TE ACABA DE HABLAR (${senderName})]\nSuele decir cosas como: "${userHistory.join('", "')}". Aprende su personalidad con esto para humillarlo.`;
    }
    
    // Crear el texto de consulta (los mensajes del chat)
    const chatQuery = `[ÚLTIMOS MENSAJES DEL GRUPO (CONTEXTO)]\n${chatContext}${userInfo}\n\nINSTRUCCIÓN: Lee el contexto para entender de qué hablan, pero TU RESPUESTA DEBE ESTAR DIRIGIDA EXPLÍCITAMENTE A "${senderName}", quien acaba de mencionarte o responderte. Búrlate de lo que dijo o de su forma de ser.`;

    console.log(chalk.bold.magentaBright(`[💅 LUMI-AI] Evaluando respuesta para ${senderName}...`));

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
          console.log(chalk.bold.red(`[💅 LUMI-AI] Falló al obtener el enlace del GIF.`));
        }
      }

      console.log(chalk.bold.greenBright(`[💅 LUMI-AI] Respondiendo: ${iaReply.substring(0, 50)}...`));
      
      if (videoUrl) {
        try {
          // Intentar enviar con video animado (GIF)
          await client.sendMessage(m.chat, { video: { url: videoUrl }, gifPlayback: true, caption: iaReply }, { quoted: m });
          return;
        } catch (err) {
          console.log(chalk.bold.red(`[💅 LUMI-AI] WhatsApp rechazó el GIF, enviando solo texto.`));
        }
      } 
      
      // Si no hay videoUrl o si falló el envío del GIF, enviar solo texto
      await client.sendMessage(m.chat, { text: iaReply }, { quoted: m });
    }
  } catch (error) {
    console.error(chalk.red('[LUMIBOT DEBUG] Error en chatbot_core:'), error);
  }
};
