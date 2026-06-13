import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment-timezone';

const menuObject = {
utils: `💅 ✨ **UTILIDADES (PORQUE SOY ÚTIL 🙄)** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .letra - Letras aesthetic ✨
┣ ⊳ .dox - Doxear a alguien (falso) 💻
┣ ⊳ .simp - Mide tu nivel de simp 💖
┣ ⊳ .clima - Pa saber si te vas a mojar
┣ ⊳ .translate - Por si no masticas inglés
┣ ⊳ .enhance - Arregla tus fotos pixeladas 🤡
┣ ⊳ .read - Sapear mensajes ViewOnce 👀
┣ ⊳ .ss - Tomar capturita web
┣ ⊳ .tape - Envía un chisme anónimo al canal 🤫
┣ ⊳ .upscale - Mejora la resolución (2x, 4x) ✨
┗ ⊳ .horario - Qué hora es en el mundo`,

juegos: `💅 ✨ **JUEGOS Y SALSEO 🔥** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .funar - Insultar a alguien 💅
┣ ⊳ .chisme - Te cuento un secreto turbio ☕
┣ ⊳ .ship - Emparejar a dos en el grupo 💖
┣ ⊳ .gemelo - Encuentra a tu gemel@ perdid@ 👯‍♀️
┣ ⊳ .ruina - Lee cómo arruinarás tu vida 🔮
┣ ⊳ .8ball - Pregúntale a la bola de cristal 🎱
┣ ⊳ .verdad - Verdad incómoda 🎯
┣ ⊳ .reto - Retos extremos 🥵
┣ ⊳ .compatibilidad - Medidor de amor 💖
┣ ⊳ .suerte - Descubre tu suerte hoy 🍀
┗ ⊳ .ruleta - Ruleta rusa, sobrevive si puedes 🔫`,

anime: `💅 ✨ **REACCIONES ANIME Y SFW 🌸** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .hug - Abrazar a alguien 🤗
┣ ⊳ .kiss - Dar un besito 😘
┣ ⊳ .slap - Bofetada merecida 👋
┣ ⊳ .punch - Dar un puñetazo 👊
┣ ⊳ .cry - Llorar dramáticamente 😭
┣ ⊳ .pat - Acariciar la cabeza 🥺
┣ ⊳ .kill - Eliminar a alguien 💀
┣ ⊳ .dance - Bailar con estilo 💃
┣ ⊳ .bite - Morder a alguien 🦷
┣ ⊳ .sleep - A mimir 😴
┣ ⊳ .laugh - Reírse sin parar 😂
┣ ⊳ .cuddle - Acurrucarse 🥰
┣ ⊳ .blush - Sonrojarse 😳
┣ ⊳ .angry - Estar enojad@ 😠
┣ ⊳ .bored - Morir de aburrimiento 🥱
┣ ⊳ .scared - Estar asustad@ 😨
┣ ⊳ .shy - Sentir timidez 👉👈
┣ ⊳ .smile - Sonreír bonito 😊
┣ ⊳ .bath - Bañarse (ya toca) 🛁
┣ ⊳ .wave - Saludar 👋
┣ ⊳ .drunk - Estar super ebri@ 🍻
┣ ⊳ .eat - Comer algo rico 🍔
┣ ⊳ .facepalm - Vergüenza ajena 🤦‍♀️
┣ ⊳ .love - Puro amor 💖
┣ ⊳ .wink - Guiñar el ojo 😉
┣ ⊳ .highfive - Chocar los cinco 🙌
┣ ⊳ .spit - Escupir a alguien 💦
┣ ⊳ .walk - Dar un paseo 🚶‍♀️
┣ ⊳ .smoke - Fumar (no lo hagan) 🚬
┣ ⊳ .bleh - Sacar la lengua 😛
┣ ⊳ .poke - Dar un toquecito 👉
┣ ⊳ .clap - Aplaudir 👏
┣ ⊳ .lick - Lamer 👅
┣ ⊳ .pout - Hacer pucheros 😤
┣ ⊳ .think - Pensar muy fuerte 🤔
┣ ⊳ .bullying - Hacer bullying 😈
┣ ⊳ .seduce - Seducir 😏
┣ ⊳ .handhold - Tomar de la mano 🤝
┣ ⊳ .peek - Espiar 👀
┣ ⊳ .comfort - Consolar 🥺
┣ ⊳ .thinkhard - Pensar durísimo 🤯
┣ ⊳ .curious - Ser curios@ 🧐
┣ ⊳ .sniff - Olfatear 👃
┣ ⊳ .stare - Mirar fijamente 👁️👁️
┣ ⊳ .trip - Tropezar 🥴
┣ ⊳ .snuggle - Acurrucarse tierno 🤗
┣ ⊳ .dramatic - Hacer drama 🎭
┣ ⊳ .cold - Tener muchísimo frío 🥶
┣ ⊳ .impregnate - Embarazar mágico 🤰
┣ ⊳ .kisscheek - Beso en la mejilla 💋
┣ ⊳ .sing - Cantar a todo pulmón 🎤
┣ ⊳ .tickle - Hacer cosquillas 🤗
┣ ⊳ .scream - Gritar de la nada 😱
┣ ⊳ .push - Empujar fuertemente 🫸
┣ ⊳ .nope - Decir que NO 🙅‍♀️
┣ ⊳ .jump - Saltar de alegría 🦘
┣ ⊳ .heat - Tener calor 🥵
┣ ⊳ .gaming - Jugar videojuegos 🎮
┣ ⊳ .draw - Dibujar bonito 🎨
┣ ⊳ .call - Llamar por teléfono 📞
┣ ⊳ .step - Pisotear 👢
┣ ⊳ .smug - Presumir 😏
┣ ⊳ .cringe - Dar cringe 😬
┗ ⊳ .bonk - Dar un zape 🔨`,

nsfw: `💅 ✨ **ZONA +18 (BAJO TU PROPIO RIESGO 😈)** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .xnxx - Descargar de XNXX 🎬
┣ ⊳ .xvideos - Descargar de XVideos 🎬
┣ ⊳ .waifunsfw - Waifus sin censura 🔞
┣ ⊳ .tetas - Imagínate... 🍒
┣ ⊳ .pussy - Solo para valientes 🐱
┣ ⊳ .bikini - Fotos en traje de baño 👙
┣ ⊳ .calata - Imágenes ricolinas 🔥
┣ ⊳ .spank - nalgada 🍑👋
┣ ⊳ .undress - encuerar 👗
┣ ⊳ .yuri - tijeras ✂️
┣ ⊳ .sixnine - hacer un 69 🔄
┣ ⊳ .anal - anal 🚪
┣ ⊳ .fuck - coger 👉👌
┣ ⊳ .cummouth - corrida en boca 👄💦
┣ ⊳ .suckboobs - chupar tetas 🍒
┣ ⊳ .cumshot - corrida 💦
┣ ⊳ .lickpussy - lamer un coño 🐱
┣ ⊳ .lickdick - lamer polla 🍆
┣ ⊳ .lickass - lamer culo 🍑
┣ ⊳ .handjob - paja manual 🖐️
┣ ⊳ .grope - nalgas 👐
┣ ⊳ .cum - violar 💦💦
┣ ⊳ .fingering - dedear ✌️
┣ ⊳ .creampie - corrida interna 🦃
┣ ⊳ .facesitting - sentarse en la cara 🪑
┣ ⊳ .futanari - hermafrodita hentai 🍌👧
┣ ⊳ .pegging - penetración con arnés 🏇
┣ ⊳ .bondage - ataduras eróticas ⛓️
┣ ⊳ .deepthroat - garganta profunda 🗣️
┣ ⊳ .thighjob - sexo entre muslos 🦵
┣ ⊳ .yaoi - hentai gay masculino 👨‍❤️‍👨
┣ ⊳ .bukkake - eyaculación múltiple sobre alguien 🚿
┣ ⊳ .orgy - orgía 🎊
┣ ⊳ .grabboobs - tetas 🍒
┣ ⊳ .blowjob - mamar 😮🍆
┣ ⊳ .boobjob - rusa 🍒🍆
┣ ⊳ .fap - paja 🤚
┣ ⊳ .footjob - paja con los pies 🦶
┗ ⊳ .squirting - Lluvia 🌧️`,

ai: `💅 ✨ **MI CEREBRO ARTIFICIAL (INTELIGENTE COMO YO 🧠)** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .chatgpt - Pregúntale al ChatGPT 💬
┣ ⊳ .gemini - Pregúntale a Gemini 🤖
┣ ⊳ .copilot - Pregúntale a Copilot 🖥️
┣ ⊳ .dalle - Crea imágenes loquísimas 🎨
┣ ⊳ .chatbot on/off - LumiBot interactúa en el chat 💅✨
┗ ⊳ .markov on/off - IA Pasiva de Grupo 🧠`,

stickers: `💅 ✨ **STICKERS Y EDICIÓN A MI ESTILO 🎨** ✨ 💅
┣┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┣ ⊳ .brat - Crea un sticker estilo Brat 🟩
┗ ⊳ .bratv - Crea un sticker animado Brat 🟩🎬`
};

const bodyMenu = `
╭⋯ ✨ $botname ✨ ⋯》
┊ 💕 *Bebé:* $sender
┊ 💅 *Chisme:* $cat
┊ ⏰ *Hora:* $tempo
┊ 🔋 *Uptime:* $uptime
┊ 👯‍♀️ *Público:* $users
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

function normalize(text = '') {
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  return text.endsWith('s') ? text.slice(0, -1) : text;
}

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const tiempo = colombianTime.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tempo = moment.tz('America/Bogota').format('hh:mm A');
      
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      
      const botname = botSettings.botname || 'LumiBOT';
      const namebot = botSettings.namebot || 'Lumi';
      const banner = botSettings.banner || 'https://i.imgur.com/8Q9N49Q.jpeg';
      const owner = botSettings.owner || '573118353868@s.whatsapp.net';
      const canalId = botSettings.id || '120363169294281316@newsletter';
      const canalName = botSettings.nameid || '💅 LUMIBOT GOSSIP 💅';
      
      // ⚡ LUMIBOT OVERRIDE: Enlace corregido sin errores de sintaxis
      const link = botSettings.link || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G';
      
      const isOficialBot = botId === global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botType = isOficialBot ? 'Reina Suprema' : 'Bebé Clon';
      const users = db.users ? Object.keys(db.users).length : 0;
      const device = getDevice(m.key.id);
      const sender = db.users?.[m.sender]?.name || m.pushName || 'Usuario';
      const time = client.uptime ? formatearMs(Date.now() - client.uptime) : "Desconocido";
      
      const alias = {
        anime: ['anime', 'reacciones'],
        downloads: ['downloads', 'descargas'],
        grupo: ['grupo', 'group'],
        nsfw: ['nsfw', '+18'],
        profile: ['profile', 'perfil'],
        sockets: ['sockets', 'bots'],
        stickers: ['stickers', 'sticker'],
        utils: ['utils', 'utilidades', 'herramientas'],
        juegos: ['juegos', 'salseo', 'juego'],
        ai: ['ai', 'ia', 'bot']
      };
      
      const input = normalize(args[0] || '');
      const cat = Object.keys(alias).find(k => alias[k].map(normalize).includes(input));
      
      const category = cat ? `[ Chisme de: ${cat.toUpperCase()} ]` : '[ STATUS: DIVA INALCANZABLE ]';
      
      if (args[0] && !cat) {      
        return m.reply(`🙄 *Bruh*... literal ese módulo *${args[0]}* ni existe o te lo inventaste.\n> 💅 Módulos reales: *${Object.keys(alias).join(', ')}*`);
      }
      
      const sections = menuObject || {};
      const content = cat ? String(sections[cat] || '') : Object.values(sections).map(s => String(s || '')).join('\n\n');
      let menu = bodyMenu + '\n\n' + content;
      
      const replacements = {
        $owner: owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? db.users?.[owner]?.name || owner.split('@')[0] : owner) : 'LuferOS',
        $botType: botType,
        $device: device,
        $tiempo: tiempo,
        $tempo: tempo,
        $users: users.toLocaleString(),
        $link: link,
        $cat: category,
        $sender: sender,
        $botname: botname,
        $namebot: namebot,
        $prefix: usedPrefix,
        $uptime: time
      };
      
      // ⚡ LUMIBOT OVERRIDE: Escape correcto del símbolo $ en el reemplazo global
      for (const [key, value] of Object.entries(replacements)) {
        menu = menu.replace(new RegExp(`\\$${key.substring(1)}`, 'g'), value);
      }
      
      let msgPayload = {
        contextInfo: {
          mentionedJid: [m.sender]
        }
      };

      if (banner.includes('.mp4') || banner.includes('.webm')) {
        msgPayload.video = { url: banner };
        msgPayload.gifPlayback = true;
        msgPayload.caption = menu;
      } else {
        msgPayload.text = menu;
        msgPayload.contextInfo.externalAdReply = {
          title: botname,
          body: "© Powered by LuferOS Security",
          showAdAttribution: false,
          thumbnailUrl: banner,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          sourceUrl: link
        };
      }

      await client.sendMessage(m.chat, msgPayload, { quoted: m });
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en menú:", e);
      await m.reply(`🙄 *Bruh...* literal el menú explotó y no quiso cargar.\n> 🚩 Excusas técnicas: *${e.message}*`);
    }
  }
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(" ");
}
