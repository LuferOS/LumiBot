import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

// 🛡️ LLAVES NUCLEARES DE TELEGRAM
//LAS CONSIGUES EN MY TELEGRAM.COM
const STRING_SESSION = "STRING_SESSION";
const API_ID = 123456; 
const API_HASH = "API_HASH"; //ESTO LO CONSIGUES INICIANDO SESION EN TELEGRAM EN LA CONSOLA DEL BOT. 

const BOT_TRUECALLER = "@TrueCalleRobot"; 
const BOT_SOCIAL = "@SocialMediaLeaksBOT";

let isScanning = false;

export default {
  command: ['dox', 'doxear', 'hack', 'rastrear'],
  category: 'fun',
  run: async (client, m, args, usedPrefix, command) => {
    
    if (isScanning) {
      return m.reply(`╭⋯ ⏳ *SISTEMA OCUPADO* ⋯》\n┊ El procesador está analizando otra huella.\n┊ Paciencia, mi Comandante.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }

    try {
      let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null);
      if (!target) return m.reply("┊ ⊳ Menciona a la víctima para iniciar la infiltración.");

      const phone = target.split('@')[0];
      const formattedNumber = `+${phone}`;
      
      // 🚀 FINGERPRINTING SIMULADO (Ajustado por región)
      const randomIp = `186.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const randomLat = (Math.random() * (4.7110 - 4.5700) + 4.5700).toFixed(6); // Centrado en Bogotá para más realismo
      const randomLon = (Math.random() * (-74.0721 - (-74.2478)) + (-74.2478)).toFixed(6);
      const battery = Math.floor(Math.random() * (95 - 12 + 1)) + 12;
      
      const devices = ['Samsung Galaxy A56 5G', 'Xiaomi Poco X6 Pro', 'iPhone 15 Pro', 'Redmi Note 13', 'Samsung S24 Ultra'];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];

      const { key } = await client.sendMessage(m.chat, { 
        text: `╭⋯ 📡 *CONEXIÓN ESTABLECIDA* ⋯》\n┊ [░░░░░░░░░░] 0%\n┊ Capturando User-Agent del dispositivo...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
      }, { quoted: m });

      isScanning = true;
      const delay = ms => new Promise(res => setTimeout(res, ms));

      await delay(1200);
      await client.sendMessage(m.chat, { text: `╭⋯ 📡 *RASTREO ACTIVO* ⋯》\n┊ [████░░░░░░] 40%\n┊ Extrayendo metadatos de Truecaller y Redes...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key });

      let waBio = "Privada 🔒";
      let waPic = null;
      let tcMediaBuffer = null;
      let realName = "No encontrado";
      let realCarrier = "Desconocida";
      let cleanSocialResponse = "┊ ⊳ Sin filtraciones públicas detectadas.";

      // 1. WhatsApp Intel
      try {
        const waStatus = await client.fetchStatus(target);
        if (waStatus && waStatus.status) waBio = waStatus.status;
        waPic = await client.profilePictureUrl(target, 'image');
      } catch (e) {}

      // 2. Puente MTProto
      try {
        const stringSession = new StringSession(STRING_SESSION);
        const tgClient = new TelegramClient(stringSession, API_ID, API_HASH, { connectionRetries: 5, useWSS: false });
        tgClient.setLogLevel("none"); 
        await tgClient.connect();

        await tgClient.sendMessage(BOT_TRUECALLER, { message: formattedNumber });
        await tgClient.sendMessage(BOT_SOCIAL, { message: formattedNumber });
        
        await delay(6500); 

        // Truecaller Scan
        const historyTc = await tgClient.invoke(new Api.messages.GetHistory({ peer: BOT_TRUECALLER, limit: 2 }));
        for (let msg of historyTc.messages) {
          if (msg.message && msg.message.includes("Name:")) {
            let lines = msg.message.split('\n');
            realName = lines.find(l => l.includes("Name:"))?.replace("Name:", "").trim() || realName;
            realCarrier = lines.find(l => l.includes("Carrier:"))?.replace("Carrier:", "").trim() || realCarrier;
          }
          if (msg.media && msg.media.photo) tcMediaBuffer = await tgClient.downloadMedia(msg);
        }

        // Social Leaks Scan & Clean
        const historySocial = await tgClient.invoke(new Api.messages.GetHistory({ peer: BOT_SOCIAL, limit: 1 }));
        let rawSocial = historySocial.messages[0]?.message || "";

        if (!rawSocial.includes("suscripción ha terminado") && !rawSocial.includes("No results found")) {
          cleanSocialResponse = rawSocial
            .replace(/Facebook/gi, "📘 *FB:*").replace(/Instagram/gi, "📸 *IG:*")
            .split('\n').filter(l => l.trim()).map(l => `┊ ⊳ ${l.trim()}`).join('\n');
        }

        await tgClient.disconnect();
      } catch (e) {}

      await client.sendMessage(m.chat, { text: `╭⋯ 📡 *FINALIZANDO* ⋯》\n┊ [██████████] 100%\n┊ Infiltración completada.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key });
      await delay(800);
      await client.sendMessage(m.chat, { delete: key });

      // 📜 REPORTE SUPREMO
      const report = `╭⋯ ☠️ *LUFEROS DOX SYSTEM* ⋯》
┊ ⊳ *Objetivo:* @${phone}
┊
╭⋯ 👤 *IDENTIDAD REAL* ⋯》
┊ ⊳ *Nombre:* ${realName}
┊ ⊳ *Bio (WA):* "${waBio}"
┊ ⊳ *Red:* ${realCarrier}
┊
╭⋯ 📱 *HARDWARE CAPTURADO* ⋯》
┊ ⊳ *Modelo:* ${randomDevice}
┊ ⊳ *Batería:* ${battery}% ${battery < 20 ? '🪫' : '🔋'}
┊ ⊳ *IP:* ${randomIp}
┊ ⊳ *Coordenadas:* ${randomLat}, ${randomLon}
┊
╭⋯ 🌐 *HUELLAS SOCIALES* ⋯》
${cleanSocialResponse}
┊
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
> 🛡️ *Nota:* Datos obtenidos vía metadata y OSINT.`;

      let finalMedia = tcMediaBuffer || (waPic ? { url: waPic } : null);

      if (finalMedia) {
        await client.sendMessage(m.chat, { 
          image: tcMediaBuffer ? tcMediaBuffer : { url: waPic }, 
          caption: report, mentions: [target] 
        });
      } else {
        await client.sendMessage(m.chat, { text: report, mentions: [target] });
      }

    } catch (e) {
      console.error(e);
      await m.reply("┊ ⊳ El cortafuegos del objetivo es demasiado fuerte.");
    } finally {
      isScanning = false;
    }
  }
}
