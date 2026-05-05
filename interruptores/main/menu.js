import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment-timezone';
import { bodyMenu, menuObject } from '../../nucleo/commands.js';

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
      const canalName = botSettings.nameid || '🛡️ LUMIBOT SECURITY 🛡️';
      
      // ⚡ LUMIBOT OVERRIDE: Enlace corregido sin errores de sintaxis
      const link = botSettings.link || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G';
      
      const isOficialBot = botId === global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botType = isOficialBot ? 'Núcleo Principal' : 'Sub-Nodo';
      const users = db.users ? Object.keys(db.users).length : 0;
      const device = getDevice(m.key.id);
      const sender = db.users?.[m.sender]?.name || m.pushName || 'Usuario';
      const time = client.uptime ? formatearMs(Date.now() - client.uptime) : "Desconocido";
      
      const alias = {
        anime: ['anime', 'reacciones'],
        downloads: ['downloads', 'descargas'],
        economia: ['economia', 'economy', 'eco'],
        gacha: ['gacha', 'rpg'],
        grupo: ['grupo', 'group'],
        nsfw: ['nsfw', '+18'],
        profile: ['profile', 'perfil'],
        sockets: ['sockets', 'bots'],
        stickers: ['stickers', 'sticker'],
        utils: ['utils', 'utilidades', 'herramientas']
      };
      
      const input = normalize(args[0] || '');
      const cat = Object.keys(alias).find(k => alias[k].map(normalize).includes(input));
      
      const category = cat ? `[ Módulo: ${cat.toUpperCase()} ]` : '[ SISTEMA CENTRAL LUMIBOT ]';
      
      if (args[0] && !cat) {      
        return m.reply(`╭⋯ ❌ *LUMIBOT - ERROR DE SINTAXIS* ⋯》\n┊ El módulo *${args[0]}* no está registrado.\n┊ ⊳ Módulos activos: *${Object.keys(alias).join(', ')}*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }
      
      const sections = menuObject || {};
      const content = cat ? String(sections[cat] || '') : Object.values(sections).map(s => String(s || '')).join('\n\n');
      let menu = bodyMenu ? String(bodyMenu || '') + '\n\n' + content : content;
      
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
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalId,
            serverMessageId: 0,
            newsletterName: canalName
          }
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
      await m.reply(`╭⋯ ❌ *LUMIBOT OVERRIDE* ⋯》\n┊ Fallo en la renderización gráfica.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
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
