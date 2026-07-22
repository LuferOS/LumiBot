import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './nucleo/system/commandLoader.js';
import initDB from './nucleo/system/initDB.js';
import antilink from './interruptores/group/antilink.js';
import level from './interruptores/group/level.js';
import { getGroupAdmins } from './nucleo/message.js';
import { insertMessage } from './nucleo/system/markov_db.js';

seeCommands();

export default async (client, m) => {
  const sender = m.sender;
  let body = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || m.message?.buttonsResponseMessage?.selectedButtonId || m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || m.message?.templateButtonReplyMessage?.selectedId || m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '';

  let buttonId = m.body || m.text || null
  if (m.message?.buttonsResponseMessage?.selectedButtonId) {
    buttonId = m.message.buttonsResponseMessage.selectedButtonId
  }
  if (m.message?.templateButtonReplyMessage?.selectedId) {
    buttonId = m.message.templateButtonReplyMessage.selectedId
  }
  if (m.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
    buttonId = m.message.listResponseMessage.singleSelectReply.selectedRowId
  }
  if (m.message?.interactiveResponseMessage) {
    try {
      const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
      if (paramsJson) {
        const params = JSON.parse(paramsJson)
        if (params?.id) {
          buttonId = params.id
        }
      }
    } catch (e) {
      console.error("[LUMIBOT MAIN] Error en parseo inicial:", e);
    }
  }
  
  // ⚡ LUMIBOT OVERRIDE: Requisito de Activación Global
  const isOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(sender) || sender.startsWith('573118353868');
  if (m.isGroup) {
    const chatStatus = global.db?.data?.chats?.[m.chat];
    if (chatStatus && chatStatus.isActivated === false) {
      let rawCmd = (m.body || m.text || '').toLowerCase().replace(/\s+/g, '');
      if (rawCmd === '.activatekey=luferos' && isOwner) {
        chatStatus.isActivated = true;
        return client.sendMessage(m.chat, { text: `╭⋯ ✨ *LUMIBOT ACTIVADA* ⋯》\n┊ Núcleo en línea. Sistemas listos para operar en este grupo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` }, { quoted: m });
      } else {
        return; // IGNORAR COMPLETAMENTE TODO SI NO ESTA ACTIVADO
      }
    }
  }

  // ⚡ LUMIBOT OVERRIDE: General Button Payloads as Commands
  if (buttonId && !buttonId.startsWith('youtube_') && !buttonId.startsWith('waifu_')) {
    m.text = buttonId;
    body = buttonId;
  }
  
  // ⚡ LUMIBOT OVERRIDE: Gestión de Botones YouTube
  if (buttonId && (
    buttonId.includes('youtube_audio_') ||
    buttonId.includes('youtube_video_360_') ||
    buttonId.includes('youtube_video_doc_') ||
    buttonId.includes('youtube_audio_doc_')
  )) {
    if (m.isGroup) {
      const chat = global.db?.data?.chats?.[m.chat] || {};
      const primaryBot = chat?.primaryBot;
      if (primaryBot) {
        const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net' || ''
        const normalizeJid = (jid) => {
          if (!jid) return ''
          const clean = String(jid).split(':')[0].replace(/\D/g, '')
          return clean
        }
        const primaryDigits = normalizeJid(primaryBot)
        const currentDigits = normalizeJid(botJid)
        if (primaryDigits && primaryDigits !== currentDigits) {
          return
        }
      }
    }
    
    const { processDownload } = await import('./interruptores/downloads/play.js')
    let option = null
    if      (buttonId.includes('youtube_audio_') && !buttonId.includes('_doc')) option = 'audio'
    else if (buttonId.includes('youtube_video_360_'))                        option = '360'
    else if (buttonId.includes('youtube_video_480_'))                        option = '480'
    else if (buttonId.includes('youtube_video_720_'))                        option = '720'
    else if (buttonId.includes('youtube_video_doc_'))                        option = 'video_doc'
    else if (buttonId.includes('youtube_audio_doc_'))                        option = 'audio_doc'
    if (option) {
      const user = global.db?.data?.users?.[m.sender]
      if (!user?.lastYTSearch) {
        return client.reply(m.chat, `╭⋯ ⚠️ *SESIÓN CADUCADA* ⋯》\n┊ Bro, no hay ninguna búsqueda activa en memoria.\n┊ Tira el comando de nuevo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
      }
      if (Date.now() - (user.lastYTSearch.timestamp || 0) > 10 * 60 * 1000) {
        return client.reply(m.chat, `╭⋯ ⏳ *TIEMPO AGOTADO* ⋯》\n┊ Esa búsqueda ya caducó, mi rey.\n┊ Tienes 10 minutos por sesión. Repite el comando.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
      }
      try {
        await processDownload(client, m, user.lastYTSearch.videoInfo, option)
        user.lastYTSearch = null
      } catch {}
      return
    }
  }

  // ⚡ LUMIBOT OVERRIDE: Gestión de Botones Quiz
  if (buttonId && buttonId.startsWith('quiz_')) {
    if (m.isGroup) {
      const chat = global.db?.data?.chats?.[m.chat] || {};
      const primaryBot = chat?.primaryBot;
      if (primaryBot) {
        const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net' || ''
        const normalizeJid = (jid) => String(jid).split(':')[0].replace(/\D/g, '')
        if (normalizeJid(primaryBot) && normalizeJid(primaryBot) !== normalizeJid(botJid)) return;
      }
    }

    const parts = buttonId.split('_');
    const status = parts[1];
    const quizId = parts[2];
    const reward = parseInt(parts[3]) || 0;
    const opt = parts.slice(4).join('_');

    const { activeQuizzes } = await import('./interruptores/fun/quiz.js');
    const quiz = activeQuizzes.get(m.chat);

    if (!quiz) {
      return client.reply(m.chat, '🙄 *El quiz ya terminó o expiró.*', m);
    }
    if (quiz.id !== quizId) {
      return client.reply(m.chat, '🙄 *Ese botón pertenece a un quiz antiguo.*', m);
    }

    clearTimeout(quiz.timeout);
    activeQuizzes.delete(m.chat);

    const user = global.db.data.users[m.sender];
    
    if (status === 'correct') {
      user.coins = (user.coins || 0) + reward;
      user.exp = (user.exp || 0) + reward;
      user.quizWins = (user.quizWins || 0) + 1;
      
      await client.reply(m.chat, `🎉 *¡RESPUESTA CORRECTA!* 🎉\n> 👤 @${m.sender.split('@')[0]} fue el más rápido.\n> 🎁 Ganó: *${reward} Coins y XP*\n> 💡 La respuesta era: *${opt}*`, m, { mentions: [m.sender] });
    } else {
      await client.reply(m.chat, `💀 *¡INCORRECTO!* 💀\n> 👤 @${m.sender.split('@')[0]} falló miserablemente y le arruinó el Quiz a todos.\n> 💡 La respuesta correcta era: *${quiz.answer}*`, m, { mentions: [m.sender] });
    }
    return;
  }

  // ⚡ LUMIBOT OVERRIDE: Gestión de Botones RPG/Waifus
  if (buttonId && (buttonId.startsWith('waifu_claim_') || buttonId.startsWith('waifu_sell_'))) {
    if (m.isGroup) {
      const chat = global.db?.data?.chats?.[m.chat] || {};
      const primaryBot = chat?.primaryBot;
      if (primaryBot) {
        const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net' || ''
        const normalizeJid = (jid) => {
          if (!jid) return ''
          const clean = String(jid).split(':')[0].replace(/\D/g, '')
          return clean
        }
        const primaryDigits = normalizeJid(primaryBot)
        const currentDigits = normalizeJid(botJid)
        if (primaryDigits && primaryDigits !== currentDigits) {
          return
        }
      }
    }
    
    let userId;
    try {
      const parts = buttonId.split('_');
      if (parts.length >= 3) {
        const userPart = parts.slice(2).join('_');
        userId = userPart + '@s.whatsapp.net';
      } else {
        return;
      }
    } catch (e) {
      return;
    }

    if (m.sender !== userId) {
      await client.reply(m.chat, `╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Ese personaje no te pertenece, no seas ladrón.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      return;
    }

    let userName = global.db.data.users?.[userId]?.name || userId.split('@')[0]

    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    const user = global.db.data.users[userId]
    if (!user.waifu) user.waifu = { characters: [], pending: null, cooldown: 0 }
    if (!Array.isArray(user.waifu.characters)) user.waifu.characters = []

    if (!user.waifu.pending) {
      await client.reply(m.chat, `╭⋯ ⚠️ *INVENTARIO VACÍO* ⋯》\n┊ No tienes personajes en cola para reclamar.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      return;
    }

    if (buttonId.startsWith('waifu_claim_')) {
      user.waifu.characters.push(user.waifu.pending);
      user.waifu.pending = null;
      await client.reply(m.chat, `╭⋯ 📦 *ASIGNACIÓN COMPLETADA* ⋯》\n┊ Has añadido al personaje a la colección de @${userName.split('@')[0]}.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      return;
    }

    if (buttonId.startsWith('waifu_sell_')) {
      const sellPrice = Math.floor(user.waifu.pending.rarity * 50);
      user.coins = (user.coins || 0) + sellPrice;
      user.waifu.pending = null;
      await client.reply(m.chat, `╭⋯ 💸 *LIQUIDACIÓN EXITOSA* ⋯》\n┊ Personaje purgado. Obtenidos ${sellPrice} créditos.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
      return;
    }
  }

  if ((m.id.startsWith("3EB0") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20)) && !m.message?.interactiveResponseMessage) return
  initDB(m, client)

  // ⚡ LUMIBOT OVERRIDE: Muted Users Interception (MOVIDO ARRIBA PARA BORRADO INSTANTÁNEO)
  const tempChat = global.db.data.chats[m.chat] || {};
  if (m.isGroup && tempChat?.mutedUsers?.[sender]) {
    if (tempChat.mutedUsers[sender] > Date.now()) {
      await client.sendMessage(m.chat, { delete: m.key }).catch(() => {});
      return; // Stop processing entirely
    } else {
      delete tempChat.mutedUsers[sender];
    }
  }

  antilink(client, m);

  const from = m.key.remoteJid;
  const botJid = client.user?.id?.split(':')[0] + '@s.whatsapp.net' || client.user?.lid || '';
  const chat = global.db.data.chats[m.chat] || {}
  const settings = global.db.data.settings[botJid] || {}
  const user = global.db.data.users[sender] ||= {}
  const users = chat.users[sender] ||= {}
  const pushname = m.pushName || 'Desconocido';
  
  let groupMetadata = null
  let groupAdmins = []
  let groupName = ''
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    groupName = groupMetadata?.subject || 'Sector Sin Nombre'
    groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
  }  
  const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid ) : false
  let isAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender ) : false;
  if (isOwner) isAdmins = true; // El dueño siempre es admin supremo
  const isOwners = [botJid, ...(settings.owner ? [settings.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(sender);

  // ⚡ LUMIBOT OVERRIDE: Log de Todos los Mensajes (Requested Format)
  try {
      const isPrimaryStr = chat?.primaryBot === botJid ? "MAIN" : "SUB";
      const botIdStr = client.user?.id?.split(':')[0] || "DESCONOCIDO";
      
      let msgTypeStr = "Otro";
      if (m.type === 'conversation' || m.type === 'extendedTextMessage') msgTypeStr = "Texto";
      else if (m.type === 'imageMessage') msgTypeStr = "🖼️ Imagen";
      else if (m.type === 'videoMessage') msgTypeStr = "🎥 Video";
      else if (m.type === 'audioMessage') msgTypeStr = "🎧 Audio";
      else if (m.type === 'stickerMessage') msgTypeStr = "🎴 Sticker";
      else if (m.type === 'documentMessage') msgTypeStr = "📄 Documento";
      
      let bodyText = body;
      if (typeof bodyText !== 'string') bodyText = String(bodyText || '');
      const displayBody = bodyText ? (bodyText.length > 50 ? bodyText.slice(0, 50) + '...' : bodyText).replace(/\n/g, ' ') : "(sin texto)";
      
      let d = new Date();
      let h = d.getHours();
      let mDate = d.getMinutes().toString().padStart(2, '0');
      let sDate = d.getSeconds().toString().padStart(2, '0');
      let ampm = h >= 12 ? 'p. m.' : 'a. m.';
      h = h % 12; h = h ? h : 12;
      const timeStr = `${h}:${mDate}:${sDate} ${ampm}`;
      
      const hLine = '═══════════════════════════════════════════════════════';
      const dLine = '───────────────────────────────────────────────────────';
      
      console.log(`\n${chalk.cyan(hLine)}\n ⏰ ${timeStr}  │  🤖 ${isPrimaryStr === 'MAIN' ? 'MAIN' : 'SUB'}_${botIdStr} \n${chalk.cyan(dLine)}\n📱 Usuario  : +${sender.split('@')[0]}\n👥 Grupo  : ${m.isGroup ? groupName : 'Privado'}\n📝 Tipo     : ${msgTypeStr}\n💬 Mensaje  : ${displayBody}\n${chalk.cyan(dLine)}`);
  } catch (err) {
    console.error("[LUMIBOT MAIN] Error en sMessage:", err);
  }

  // Ejecución Pasiva de Plugins
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin && typeof plugin.all === "function") {
      try {
        await plugin.all.call(client, m, { client });
      } catch (err) {
        console.error(`[LUMIBOT DEBUG] Error en plugin.all -> ${name}`, err);
      }
    }
  }

  const today = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  
  // ⚡ LUMIBOT OVERRIDE: Tracking avanzado en SQL (Multi Sin Espera)
  if (global.sqlDb) {
      const isAudio = m.type === 'audioMessage' ? 1 : 0;
      const isSticker = m.type === 'stickerMessage' ? 1 : 0;
      const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage') ? 1 : 0;
      
      const query = `
          INSERT INTO chat_stats (jid, chat_id, date, msgs, audios, stickers, media)
          VALUES (?, ?, ?, 1, ?, ?, ?)
          ON CONFLICT(jid, chat_id, date) DO UPDATE SET
          msgs = msgs + 1,
          audios = audios + excluded.audios,
          stickers = stickers + excluded.stickers,
          media = media + excluded.media
      `;
      // Ejecución background asíncrona ("sin espera")
      global.sqlDb.run(query, [sender, m.chat, today, isAudio, isSticker, isMedia], (err) => {
          if (err) console.error('[LUMIBOT SQL] Error actualizando stats:', err);
      });
  }
  
  // ⚡ LUMIBOT OVERRIDE: Activity Tracker para .fantasmas
  if (m.isGroup && global.db?.data?.chats?.[from]) {
    if (!global.db.data.chats[from].activity) global.db.data.chats[from].activity = {};
    global.db.data.chats[from].activity[sender] = Date.now();
  }
  
  const rawBotname = settings.namebot || 'LuferOS';
  const tipo = settings.type || 'Sub';
  const cleanBotname = rawBotname.replace(/[^a-zA-Z0-9\s]/g, '')
  const namebot = cleanBotname || 'LuferOS';
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0, 2), namebot.split(" ")[0].slice(0, 3)];
  const prefixes = shortForms.map(name => `${name}`);
  prefixes.unshift(namebot);
  let prefix;
  const defaultSymbols = '[./#!-]';
  if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
    const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix];
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i');
  } else if (settings.prefix === true) {
    prefix = new RegExp('^', 'i');
  } else {
    // ⚡ LUMIBOT OVERRIDE: Si no hay prefix definido, usa los símbolos estándar por defecto para evitar que comandos con punto fallen y parezcan "arremedados"
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + defaultSymbols + ')', 'i');
  }
  const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let pluginPrefix = client.prefix ? client.prefix : prefix;
  const textToMatch = m.text || body || '';
  let matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(textToMatch), pluginPrefix]] : Array.isArray(pluginPrefix) ? pluginPrefix.map(p => {
    let regex = p instanceof RegExp ? p : new RegExp(strRegex(p));
    return [regex.exec(textToMatch), regex];
  }) : typeof pluginPrefix === 'string' ? [[new RegExp(strRegex(pluginPrefix)).exec(textToMatch), new RegExp(strRegex(pluginPrefix))]] : [[null, null]];
  let match = matchs.find(p => p[0]);

  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin) continue;
    if (plugin.disabled) continue;
    if (typeof plugin.before === "function") {
      try {
        if (await plugin.before.call(client, m, { client })) {
          continue;
        }
      } catch (err) {
        console.error(`[LUMIBOT DEBUG] Error en plugin.before -> ${name}`, err);
      }
    }
  }

  if (!match) {
    if (chat.markov) {
      let markovText = textToMatch;
      if (!markovText) {
        if (m.type === 'audioMessage') markovText = '[Envió un Audio]';
        else if (m.type === 'stickerMessage') markovText = '[Envió un Sticker]';
        else if (m.type === 'imageMessage') markovText = '[Envió una Imagen]';
        else if (m.type === 'videoMessage') markovText = '[Envió un Video]';
      }

      if (markovText) {
        insertMessage(m.chat, sender, pushname, markovText, Date.now(), m.key.id).catch(() => {});
        
        // Probabilidad de respuesta pasiva (25%)
        if (Math.random() < 0.25) {
          import('./interruptores/main/markov_core.js').then((module) => {
            module.default.run(client, m, markovText);
          }).catch(err => console.error('[LUMIBOT DEBUG] Error cargando markov_core:', err));
        }
      }
    }
    
    if (chat.chatbot && textToMatch && m.isGroup) {
      import('./interruptores/ai/chatbot_core.js').then((module) => {
        module.default(client, m, textToMatch);
      }).catch(err => console.error('[LUMIBOT DEBUG] Error cargando chatbot_core:', err));
    }
    return;
  }
  let usedPrefix = (match[0] || [])[0] || '';
  let args = textToMatch.slice(usedPrefix.length).trim().split(" ");
  let command = (args.shift() || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let text = args.join(' ');
  if (!command) return;
  
  // ⚡ LUMIBOT OVERRIDE: Log de Consola Mejorado
  const chatData = global.db.data.chats[from] || {};
  const consolePrimary = chatData.primaryBot;
  if (m.message || !consolePrimary || consolePrimary === botJid) {
    const bodyPreview = typeof body === 'string' && body.length > 80 ? `${body.slice(0, 80)}…` : (body || '(sin texto)');
    const now = moment().format('hh:mm:ss A');
    const dateStr = moment().format('DD/MM/YY');
    
    // Detectar tipo de mensaje con icono
    let msgTypeIcon = '📝 Texto';
    if (m.type === 'imageMessage') msgTypeIcon = '🖼️ Imagen';
    else if (m.type === 'videoMessage') msgTypeIcon = '🎬 Video';
    else if (m.type === 'audioMessage') msgTypeIcon = '🎵 Audio';
    else if (m.type === 'stickerMessage') msgTypeIcon = '🎴 Sticker';
    else if (m.type === 'documentMessage') msgTypeIcon = '📄 Documento';
    else if (m.type === 'contactMessage') msgTypeIcon = '👤 Contacto';
    else if (m.type === 'locationMessage') msgTypeIcon = '📍 Ubicación';
    
    const sep = chalk.gray('═══════════════════════════════════════════════════════');
    const subSep = chalk.gray('───────────────────────────────────────────────────────');
    const botLabel = chalk.bold.cyan(`🤖 ${settings.namebot || 'LumiBot'}`);
    
    console.log(`\n${sep}`);
    console.log(chalk.bold(` ⏰ ${chalk.whiteBright(now)}  │  ${botLabel}`));
    console.log(subSep);
    console.log(chalk.yellow(`📱 Usuario  : ${chalk.whiteBright(`+${sender.split('@')[0]}`)} ${chalk.gray(`(${pushname})`)}`));
    if (m.isGroup) {
      console.log(chalk.green(`👥 Grupo  : ${chalk.whiteBright(groupName)}`));
    } else {
      console.log(chalk.magenta(`💌 Chat   : ${chalk.whiteBright('Mensaje Privado')}`));
    }
    console.log(chalk.cyan(`📝 Tipo     : ${chalk.whiteBright(msgTypeIcon)}`));
    console.log(chalk.blue(`💬 Mensaje  : ${chalk.whiteBright(bodyPreview)}`));
    if (command) {
      console.log(chalk.bold.magenta(`⚡ Comando  : ${chalk.whiteBright(usedPrefix + command)} ${args.length > 0 ? chalk.gray(`[${args.join(' ')}]`) : ''}`));
    }
    console.log(subSep);
  }
  
  const hasPrefix = settings.prefix === true ? true : (Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : []).some(p => textToMatch?.startsWith(p));
  function getAllSessionBots() {
    const sessionDirs = ['./Sessions/Subs']
    let bots = []
    for (const dir of sessionDirs) {
      try {
        const subDirs = fs.readdirSync(path.resolve(dir))
        for (const sub of subDirs) {
          const credsPath = path.resolve(dir, sub, 'creds.json')
          if (fs.existsSync(credsPath)) {
            bots.push(sub + '@s.whatsapp.net')
          }
        }
      } catch {}
    }
    try {
      const ownerCreds = path.resolve('./Sessions/Owner/creds.json')
      if (fs.existsSync(ownerCreds)) {
        const ownerId = global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net' || ''
        if (ownerId) bots.push(ownerId)
      }
    } catch {}
    return bots;
  }
  const botprimaryId = chat?.primaryBot
  if (botprimaryId && hasPrefix && m.isGroup) {
    const normalizeJid = (jid) => {
      if (!jid) return ''
      const clean = String(jid).split(':')[0].replace(/\D/g, '')
      return clean + '@s.whatsapp.net'
    }
    const normalizedPrimary = normalizeJid(botprimaryId)
    const normalizedCurrent = normalizeJid(botJid)
    if (normalizedPrimary !== normalizedCurrent) {
      return
    }
  }
  
  if (!isOwners && settings.self) return;  
  if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['allmenu', 'help', 'menu', 'infobot', 'botinfo', 'invite', 'invitar', 'ping', 'speed', 'p', 'status', 'estado', 'report', 'reporte', 'sug', 'suggest', 'token', 'join', 'unir', 'logout', 'reload', 'self', 'setbotcurrency', 'setcurrency', 'setbotowner', 'setowner', 'setprefix', 'setbotprefix', 'repo', 'contacto', 'botones', 'code', 'qr', 'vincular', 'serbot', 'tape', 'confesar', 'secreto', 'chismesito', 'funar', 'chisme', '8ball', 'ruina', 'ruleta', 'gemelo', 'simp', 'dox', 'letra', 'ship', 'xnxx', 'xvideos', 'xvideo', 'waifunsfw', 'calata', 'boobs', 'tetas', 'bigboobs', 'bigtetas', 'pussy', 'vagina', 'bikini', 'spank', 'nalgada', 'azotar', 'undress', 'desvestir', 'quitarropa', 'yuri', 'tijeras', 'sixnine', '69', 'anal', 'fuck', 'follar', 'coger', 'cummouth', 'correrboca', 'suckboobs', 'chuparpechos', 'chupartetas', 'cumshot', 'lickpussy', 'lamervagina', 'comer', 'lickdick', 'chupar', 'mamar', 'lickass', 'lamerculo', 'comerculo', 'handjob', 'paja', 'pajear', 'grope', 'manosear', 'tocar', 'cum', 'correrse', 'venirse', 'fingering', 'dedos', 'meterdedos', 'creampie', 'rellenar', 'facesitting', 'sentarsecara', 'futanari', 'futa', 'pegging', 'bondage', 'amarrar', 'atar', 'deepthroat', 'gargantaprofunda', 'thighjob', 'rusamuslos', 'yaoi', 'bukkake', 'orgy', 'orgia', 'fiesta', 'grabboobs', 'agarrarpechos', 'blowjob', 'mamada', 'boobjob', 'rusa', 'pajapechos', 'fap', 'masturbarse', 'footjob', 'pajapies', 'squirting', 'squirt', 'chorrear', 'upscale', 'mejorar', 'escala', 'gemini', 'g', 'copilot', 'c', 'chatgpt', 'ia', 'lumi', 'brat', 'bratv', 'verdad', 'reto', 'compatibilidad', 'amor', 'lovemeter', 'suerte', 'inteligencia', 'iq', 'iqtest', 'meme', 'lyrics', 'lyric', 'wikipedia', 'wiki', 'audio', 'audios', 'spotify', 'sp', 'soundcloud', 'sc', 'pornhub', 'ph', 'pinterest', 'pin', 'facebook', 'fb', 'twitter', 'x', 'xdl', 'instagram', 'ig', 'tiktok', 'tt', 'tiktokimg', 'ttimg', 'tiktokmp3', 'ttmp3'];
    if (!global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !allowedInPrivateForUsers.includes(command)) return;
  }
  
  // El bloque de activación estaba aquí antes, ya se movió arriba.
  
  // ⚡ LUMIBOT OVERRIDE: Manejo de Baneos
  if (chat?.bannedByOwner && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`╭⋯ 🛑 *GRUPO VETADO* ⋯》\n┊ Este grupo ha sido bloqueado permanentemente por LuferOS.\n┊ Ningún Admin puede revertir esto.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    return;
  }
  
  if (chat?.isBanned && !(command === 'bot' && text === 'on') && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`╭⋯ 🛑 *SISTEMA DESCONECTADO* ⋯》\n┊ Mis operaciones están suspendidas en este sector.\n┊ Dile a un Admin que use *${usedPrefix}bot on* si quieren mi ayuda.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    return;
  }
  if (user.banned && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`╭⋯ 🚫 *OPERATIVO BLOQUEADO* ⋯》\n┊ Estás en mi lista negra. Cero acceso al sistema.\n┊ ⊳ *Motivo:* ${user.bannedReason || 'Infracción de Diva'}\n┊ Si crees que es un error, llora en soporte o busca un Admin.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    return;
  }

  if (!users.stats) users.stats = {};
  if (!users.stats[today]) users.stats[today] = { msgs: 0, cmds: 0 }; 
  if (chat.adminonly && !isAdmins) return;
  
  const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const getClosestCommand = (input) => {
    let closest = null;
    let minDistance = Infinity;
    const isSenderOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(sender);
    for (const cmd of global.comandos.keys()) {
      const cData = global.comandos.get(cmd);
      if (cData.isOwner && !isSenderOwner) continue;
      
      const dist = levenshtein(input, cmd);
      if (dist < minDistance) {
        minDistance = dist;
        closest = cmd;
      }
    }
    return minDistance <= 3 ? closest : null;
  };

  const cmdData = global.comandos.get(command);
  
  if (global.db?.data?.settings?.mantenimiento && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !sender.startsWith('573118353868')) {
    if (cmdData) {
      return client.reply(m.chat, `╭⋯ 🛠️ *SISTEMA EN MANTENIMIENTO* ⋯》\n┊ LuferOS está realizando ajustes en el bot.\n┊ Todos los comandos están desactivados temporalmente.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
    } else {
      return;
    }
  }
  
  if (!cmdData || (cmdData.isOwner && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender))) {
    if (settings.prefix === true) return;
    await client.readMessages([m.key]);
    const sugerencia = getClosestCommand(command);
    const mensajeSugerencia = sugerencia ? `\n┊ 💡 *¿Quizás quisiste decir: ${usedPrefix}${sugerencia}?*` : '';
    return m.reply(`╭⋯ ⚠️ *SINTAXIS DESCONOCIDA* ⋯》\n┊ El comando *${command}* no existe en mi código.${mensajeSugerencia}\n┊ Escribe *${usedPrefix}menu* para ver la lista real.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
  }
  
  const msgNoAdmin = `╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Comando restringido. Solo para los Administradores de este grupo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;
  const msgNoBotAdmin = `╭⋯ ⚠️ *PERMISOS INSUFICIENTES* ⋯》\n┊ No puedo ejecutar esto si no me das rango de Administrador primero.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, msgNoAdmin, m);
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, msgNoBotAdmin, m);
  
  // ⚡ LUMIBOT OVERRIDE: Check NSFW
  if ((cmdData.nsfw || cmdData.category === 'nsfw') && m.isGroup && !chat.nsfw) {
    return client.reply(m.chat, `╭⋯ 🛑 *CONTENIDO RESTRINGIDO* ⋯》\n┊ Este comando es NSFW y está desactivado en este grupo.\n┊ Un Administrador debe encenderlo con *${usedPrefix}nsfw on*.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m);
  }
  
  // 👑 LUMIBOT OVERRIDE: Motor de Diva (Mood Check)
  if (!global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !sender.startsWith('573118353868')) {
      global.divaMood = (global.divaMood || 100) - 1; // Pierde paciencia
      global.sqlDb.run(`UPDATE bot_state SET value = ? WHERE key = 'divaMood'`, [global.divaMood]);
      if (global.divaMood <= 10 && Math.random() < 0.3) {
          return m.reply(`╭⋯ 😤 *BERRINCHE DE DIVA* ⋯》\n┊ Literalmente estoy harta de trabajar para ustedes y que no me valoren.\n┊ Mi nivel de ánimo está en ${global.divaMood}%.\n┊ Díganle a LuferOS que me consienta o usen *.mimar* antes de pedirme cosas. 💅\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }
  }

  try {
    await client.readMessages([m.key]);
    
    // ⚡ LUMIBOT OVERRIDE: Log extendido de Ejecución
    if (m.message || !consolePrimary || consolePrimary === botJid) {
      const h = chalk.bold.cyan('╭⋯ ⚙️ EJECUCIÓN NÚCLEO ⋯》');
      const t = chalk.bold.cyan('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》');
      const v = chalk.bold.cyan('┊');
      console.log(`\n${h}\n${chalk.bold.yellow(`${v} Módulo: ${chalk.whiteBright((cmdData.pluginName || 'global') + '.js')}`)}\n${chalk.bold.blueBright(`${v} Estado: ${chalk.whiteBright('⏳ Procesando y esperando respuestas...')}`)}\n${t}`);
    }

    user.usedcommands = (user.usedcommands || 0) + 1;
    settings.commandsejecut = (settings.commandsejecut || 0) + 1;
    users.usedTime = new Date();
    users.lastCmd = Date.now();
    user.exp = (user.exp || 0) + Math.floor(Math.random() * 100);
    user.name = m.pushName;
    users.stats[today].cmds++;
    
    await cmdData.run(client, m, args, usedPrefix, command, text);

    if (m.message || !consolePrimary || consolePrimary === botJid) {
      console.log(`\n${chalk.bold.green('╭⋯ ✅ OPERACIÓN EXITOSA ⋯》')}\n${chalk.bold.green('┊')} ${chalk.bold.white(`Respuestas enviadas por ${cmdData.pluginName || 'global'}.js`)}\n${chalk.bold.green('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》')}`);
    }

    // ⚡ LUMIBOT OVERRIDE: Promo automática del canal de WhatsApp (15% chance)
    if (m.isGroup && Math.random() < 0.15) {
      const botSettings = global.db?.data?.settings?.[botJid] || {};
      const canalLink = botSettings.link || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G';
      const canalName = botSettings.nameid || '💅 LUMIBOT GOSSIP 💅';
      const canalId = botSettings.id || '120363169294281316@newsletter';
      
      const promoMessages = [
        `✨ *¿Te gusta lo que hago?* Únete a mi canal para enterarte de todo:\n${canalLink}`,
        `💅 *Sígueme en mi canal* para actualizaciones, novedades y chisme:\n${canalLink}`,
        `🔔 *No te pierdas nada* — Únete al canal oficial:\n${canalLink}`,
        `⚡ *Nuevo contenido disponible* en mi canal. ¡Sígueme!\n${canalLink}`,
        `🌟 *¿Quieres más de mí?* Todo lo bueno está en mi canal:\n${canalLink}`
      ];
      const promoText = promoMessages[Math.floor(Math.random() * promoMessages.length)];
      
      try {
        await client.sendMessage(m.chat, {
          text: promoText,
          contextInfo: {
            externalAdReply: {
              title: canalName,
              body: 'Canal Oficial de WhatsApp',
              mediaType: 1,
              renderLargerThumbnail: false,
              thumbnailUrl: 'https://github.com/fluidicon.png',
              sourceUrl: canalLink
            }
          }
        });
      } catch (promoErr) {
        console.error("[LUMIBOT MAIN] Error en auto-promote:", promoErr);
      }
    }

  } catch (error) {
    if (m.message || !consolePrimary || consolePrimary === botJid) {
      console.log(`\n${chalk.bold.red('╭⋯ ❌ ERROR DE NÚCLEO ⋯》')}\n${chalk.bold.red('┊')} ${chalk.bold.white(`Fallo en ${cmdData.pluginName || 'global'}.js: ${error.message}`)}\n${chalk.bold.red('╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》')}`);
    }
    await client.sendMessage(m.chat, { text: `╭⋯ ❌ *ERROR CRÍTICO DEL NÚCLEO* ⋯》\n┊ El procesador colapsó ejecutando este módulo.\n┊ ⊳ *Detalles:* ${error.message || error}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` }, { quoted: m });
  }
  level(m);
};
