import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import fetch from 'node-fetch';
import { getMassiveCorpus } from '../../nucleo/system/markov_db.js';

const fetchStickerVideo = async (text) => {
  const response = await fetch(`https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error('Error al obtener el video brat');
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

function generateMarkovText(corpus, order = 1, maxWords = 25) {
  if (!corpus || corpus.length === 0) return null;
  const ngrams = {};
  const starts = [];

  for (let msg of corpus) {
    const tokens = msg.split(/\s+/).filter(t => t.trim().length > 0);
    if (tokens.length < order) {
      if (tokens.length > 0) starts.push(tokens.join(' '));
      continue;
    }

    const startGram = tokens.slice(0, order).join(' ');
    starts.push(startGram);

    for (let i = 0; i <= tokens.length - order; i++) {
      const gram = tokens.slice(i, i + order).join(' ');
      const nextWord = tokens[i + order] || null;

      if (!ngrams[gram]) ngrams[gram] = [];
      if (nextWord) ngrams[gram].push(nextWord);
    }
  }

  if (starts.length === 0) return null;
  let currentGram = starts[Math.floor(Math.random() * starts.length)];
  let result = currentGram.split(' ');

  for (let i = 0; i < maxWords; i++) {
    const possibilities = ngrams[currentGram];
    if (!possibilities || possibilities.length === 0) break;

    const nextWord = possibilities[Math.floor(Math.random() * possibilities.length)];
    result.push(nextWord);

    currentGram = result.slice(result.length - order, result.length).join(' ');
  }

  return result.join(' ');
}

export default {
  run: async (client, m, incomingText) => {
    try {
      const chatId = m.chat;
      const corpus = await getMassiveCorpus(chatId, 1000); // Hasta 1000 mensajes de texto puro
      
      console.log(chalk.bold.cyan('\n╭⋯ 🧠 CEREBRO MARKOVIANO (MATEMÁTICO) ⋯》'));
      console.log(chalk.cyan(`┊ Disparador: ${chalk.whiteBright(m.pushName || 'User')} -> "${chalk.italic(incomingText)}"`));
      console.log(chalk.cyan(`┊ Corpus Cargado: ${chalk.whiteBright(corpus.length)} mensajes`));

      if (corpus.length < 5) {
        console.log(chalk.yellow(`┊ Insuficiente data. Abortando.`));
        console.log(chalk.bold.cyan('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n'));
        return;
      }

      // Algoritmo N-gram matemático puro
      let responseText = generateMarkovText(corpus, 1, 25); 
      
      if (!responseText) {
        console.log(chalk.red(`┊ Fallo en generación matemática.`));
        console.log(chalk.bold.cyan('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n'));
        return;
      }

      console.log(chalk.green(`┊ Resultado Frankenstein: "${chalk.whiteBright(responseText)}"`));

      // Probabilidad de respuesta: 15% Sticker Animado (Brat) al azar
      let isBrat = Math.random() < 0.15;
      
      if (isBrat) {
        console.log(chalk.yellow(`┊ Formato: 🎬 Sticker Animado (.bratv) [15% CHANCE]`));
      } else {
        console.log(chalk.yellow(`┊ Formato: 📝 Texto Plano`));
      }
      console.log(chalk.bold.cyan('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n'));
      
      if (isBrat && responseText.length < 50) { 
        try {
          const videoBuffer = await fetchStickerVideo(responseText);
          const tmpDir = path.resolve('./tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const tmpFile = path.join(tmpDir, `markov-brat-${Date.now()}.mp4`);
          
          fs.writeFileSync(tmpFile, videoBuffer);
          await client.sendVideoAsSticker(m.chat, tmpFile, m, { packname: 'LumiBOT', author: 'Cerebro Matemático' });
          fs.unlinkSync(tmpFile);
        } catch (e) {
          console.error(chalk.red(`[🧠 MARKOV-CORE] Falló generación Brat, enviando texto plano: ${e.message}`));
          await client.sendMessage(m.chat, { text: responseText }, { quoted: m });
        }
      } else {
        await client.sendMessage(m.chat, { text: responseText }, { quoted: m });
      }

    } catch (e) {
      console.error(chalk.red('[LUMIBOT DEBUG] Error en Cerebro Markoviano Matemático:'), e);
    }
  }
};
