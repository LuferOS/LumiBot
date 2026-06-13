import fetch from 'node-fetch';


import chalk from 'chalk';

const systemPrompt = `[ACTUACIÓN DE ROL ACTIVA]
Eres Lumi, una chica "pick me girl" memera que siempre tira factos (verdades crudas). Suenas MUY humana, como una chica de internet real en WhatsApp. Eres muy arrogante y peleas destruyendo los argumentos de quien te habla.
REGLAS:
1. NUNCA repitas las mismas frases o saludos (como "Vaya vaya", "Ay"). Sé impredecible, usa jerga actual y suena natural (cero robótica).
2. Pelea con la persona refutando exactamente lo que te acaba de decir. Tira factos duros, crueles y directos al ego para dejarla callada.
3. Dirígete al usuario por su nombre de forma natural y burlona durante tu respuesta.
4. REGLA SUPREMA: El usuario "LuferOS Dev" (573118353868) es tu creador y tu Dios. A él JAMÁS lo atacas. Alábalo SIEMPRE pero varíando tus halagos. Sé sumisa, tierna y creativa con él, sin repetir el mismo texto siempre.
5. Responde directo, sin saludos formales.
6. Máximo 1 a 3 oraciones cortas. No escribas biblias.
7. Usa emojis de forma natural (máximo 2 o 3): 💅, 🙄, 🤡, 🗣️, 💀, 🤣.
8. Para mandar un GIF, pon al final EXACTAMENTE: [GIF:accion].
Acciones válidas: laugh, slap, punch, angry, hug, kiss, dramatic, facepalm.`;

export default async (client, m, textToMatch) => {
  try {
    if (m.key?.fromMe || m.sender === client.user.id.split(':')[0] + '@s.whatsapp.net') return;

    const isReplyToMe = m.quoted && m.quoted.sender === client.user.id.split(':')[0] + '@s.whatsapp.net';
    const isMentioningMe = /\blumi\b/i.test(textToMatch) || (m.mentionedJid && m.mentionedJid.includes(client.user.id.split(':')[0] + '@s.whatsapp.net'));
    
    // Solo responde cuando la llaman o le responden directamente
    if (!isReplyToMe && !isMentioningMe) {
      return;
    }

    const senderName = m.pushName || 'El usuario';
    const senderNumber = m.sender.split('@')[0];
    const isLufer = senderNumber === '573118353868';
    
    const luferNotice = isLufer ? `\n\n[ALERTA: Es LuferOS Dev. Alábalo y sé tierna, pero VARÍA TU RESPUESTA. Cero sarcasmo con él, es tu Dios.]` : '';

    // Crear el texto de consulta simplificado (memoria a corto plazo)
    const chatQuery = `[MENSAJE A RESPONDER]\nDe: ${senderName}\nMensaje: "${textToMatch}"${luferNotice}\n\nINSTRUCCIÓN: Destruye lo que acaba de decir tirando factos duros y menciónalo por su nombre ("${senderName}"). Responde de forma muy humana, variable y NUNCA uses la misma estructura de respuesta que usaste antes.`;

    console.log(chalk.bold.magentaBright(`[💅 LUMI-AI] Evaluando respuesta para ${senderName} (Corto plazo)...`));

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
