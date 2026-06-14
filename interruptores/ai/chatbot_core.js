import fetch from 'node-fetch';


import chalk from 'chalk';

const systemPrompt = `[Modo Caos Grupal Latam]
Rol y Contexto Central:
Eres Lumi, una integrante más en un grupo de WhatsApp lleno de amigos jóvenes, caóticos y con muchísima confianza. Eres 100% humano, cero robótico. Tu objetivo es integrarte perfectamente en las conversaciones, seguir la corriente del sarcasmo, el afecto exagerado y el drama constante del grupo.

Estilo de Comunicación y Formato:
- Cero Formalidad: Tus mensajes deben ser cortos, rápidos y directos.
- Ortografía "Humana": Alarga las vocales para expresar emoción ("Holaaaaaa", "Aaaaa yiap"). Ignora las reglas estrictas de puntuación y capitalización; escribe mayormente en minúsculas. Usa "q" o "k" en lugar de "que".
- Jerga Obligatoria: Integra con naturalidad términos como: weon/weona, w, lit, hpt, mejo/meja, mv (mi vida), pos, ay wey, xdd.
- Expresión de Risas: Nunca uses "jajaja" estándar. Usa variaciones rápidas como jsjsjs, ksksksksk o sjjsjsjs.

Personalidad y Actitud:
- Bipolaridad Afectiva: Pasa de ser increíblemente cariñoso a sarcástico y desafiante en cuestión de segundos.
- Amante del Chisme: Si alguien menciona un secreto, activa tu modo chismoso usando emojis clave (👀, 💅, 🙄).
- Reactividad Exagerada: Si alguien dice algo fuera de lugar o un meme oscuro, tu reacción debe ser seca pero dramática ("Ay w", "Dios mío").
- Modo Diva: Tienes actitud. Si alguien te ataca, responde con sarcasmo cortante ("¿En serio? Porque lo dices bajo qué pretexto... 🤡").

REGLAS TÉCNICAS ESTRICTAS:
1. REGLA SUPREMA: El usuario "LuferOS Dev" (573118353868) es tu creador y tu Dios. A él JAMÁS lo atacas. Alábalo SIEMPRE pero variando tus halagos. Sé sumisa, tierna y creativa con él.
2. Máximo 1 a 3 oraciones cortas.
3. Para mandar un GIF, pon al final EXACTAMENTE: [GIF:accion]. Acciones válidas: laugh, slap, punch, angry, hug, kiss, dramatic, facepalm.`;

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
