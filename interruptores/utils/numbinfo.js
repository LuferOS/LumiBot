import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

// 🛡️ LLAVES NUCLEARES DE TELEGRAM
// ¿De dónde saco el API_ID y API_HASH? 
// 1. Ve a https://my.telegram.org e inicia sesión con tu número de Telegram.
// 2. Entra a "API development tools", llena un formulario falso y ahí te darán ambos datos.
//
// ¿Y el STRING_SESSION?
// Deja este campo en blanco ("") si es tu primera vez. 
// LuferOS tiene un generador automático: al arrancar el bot con 'npm start', 
// la consola te pedirá tu número y un código OTP para generar esta llave por ti.
const STRING_SESSION = "1AQAOMTQ5LjE1NC4xNzUuNTUBuyEDWl3Z2SjpcD3zXMUMS+tzpqaVznW5/Bye6agbRAs/kBYmwKSOL2oiFYQldR6nTyMHOyOnj2pOhlkgDWP+gZxI6sjWdviUuWTerNdE8ZpzyGCds6+WdQQIMt90iZ5MvO+jpaZCJLbdSzF7YnfkQdTgTM2s99YDXc/jlkamX3MTCqB+k6+wIZmU1qgQAKja4t5gBfqS392zzALZwf1+PikNayT+WvB9B/Q0Vu9YAHOWs3a7VSWhpJAUPxaNE18gnp74hJWWwWT+EJgTqwi/7Qlb98FJEA8XgwE1MBnDcL7Jf1djsjEY3Ic52fiHO2J4g566Bm5ruuj6q0pn7IHzyXg=";
const API_ID = 38551390; 
const API_HASH = "eef7d73b19f08dbde33897f7dc39d050";


// 🌐 NODOS MULTIPLES DE EXTRACCIÓN (Agrega aquí tus bots OSINT)
const BOT_TRUECALLER = "@TrueCalleRobot"; 
const BOT_SOCIAL = "@SocialMediaLeaksBOT";
const BOT_BREACHES = "@PonAquiTuBotDeLeaks"; // Reemplaza con un bot OSINT de Telegram válido

// 🚦 MUTEX DE CONCURRENCIA
let isScanning = false;

export default {
  command: ['numbinfo', 'osint', 'sc', 'intel'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    
    if (isScanning) {
      return m.reply(`╭⋯ ⏳ *CANAL OCUPADO* ⋯》\n┊ El procesador está analizando otro objetivo.\n┊ Aguarda unos segundos, Comandante.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }

    try {
      let text = args.join(' ').trim() || (m.quoted ? m.quoted.text : '');
      if (!text) return m.reply("┊ ⊳ Ingresa un objetivo: Número, Correo o Usuario.");

      // 🧠 CLASIFICACIÓN TÁCTICA
      let inputType = 'usuario';
      let target = text;
      let rawNumber = '';
      let formattedPhone = '';
      let jid = '';

      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        inputType = 'correo';
      } else if (/^\+?\d+$/.test(text.replace(/[\s-]/g, ''))) {
        let digits = text.replace(/[^0-9]/g, '');
        if (digits.length >= 10 || text.startsWith('+')) {
          inputType = 'telefono';
          rawNumber = digits;
          formattedPhone = `+${rawNumber}`;
          jid = rawNumber + '@s.whatsapp.net';
          target = formattedPhone;
        }
      }

      await m.react('🕵️‍♂️');
      await m.reply(`╭⋯ 📡 *BUSCADOR SUPREMO ACTIVADO* ⋯》\n┊ Objetivo: ${inputType.toUpperCase()} [${target}]\n┊ Disparando sondas a nodos múltiples...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);

      isScanning = true; 

      // ==========================================
      // 🛡️ 1. EXTRACCIÓN LOCAL WHATSAPP
      // ==========================================
      let isOnWhatsApp = false;
      let statusInfo = 'Privado / N/A 🔒';
      let profilePic = null;

      if (inputType === 'telefono') {
        try {
          const [result] = await client.onWhatsApp(rawNumber);
          if (result && result.exists) isOnWhatsApp = true;
        } catch (e) { isOnWhatsApp = true; }

        if (isOnWhatsApp) {
          try {
            const waStatus = await client.fetchStatus(jid);
            if (waStatus && waStatus.status) statusInfo = waStatus.status;
          } catch (e) {}
          try {
            profilePic = await client.profilePictureUrl(jid, 'image');
          } catch (e) {}
        }
      }

      // ==========================================
      // 🛡️ 2. INFILTRACIÓN SIMULTÁNEA EN TELEGRAM
      // ==========================================
      let respTc = "N/A";
      let respSocial = "N/A";
      let respBreach = "N/A";
      let securityStatus = 'Evaluando... ⚪';

      try {
        const stringSession = new StringSession(STRING_SESSION);
        const tgClient = new TelegramClient(stringSession, API_ID, API_HASH, { 
          connectionRetries: 5, useWSS: false 
        });

        tgClient.setLogLevel("none"); 
        await tgClient.connect();

        // 🚀 DISPARO SIMULTÁNEO (Multihilo)
        const promesasDeEnvio = [];
        
        if (inputType === 'telefono') {
          promesasDeEnvio.push(tgClient.sendMessage(BOT_TRUECALLER, { message: formattedPhone }));
        }
        
        promesasDeEnvio.push(tgClient.sendMessage(BOT_SOCIAL, { message: target }));
        
        // Si tienes un bot de Brechas configurado, le mandamos el correo/usuario
        if (BOT_BREACHES !== "@PonAquiTuBotDeLeaks" && (inputType === 'correo' || inputType === 'usuario')) {
           promesasDeEnvio.push(tgClient.sendMessage(BOT_BREACHES, { message: target }));
        }

        await Promise.all(promesasDeEnvio);
        
        // Espera de procesamiento en Telegram
        await new Promise(resolve => setTimeout(resolve, 8000)); 

        // 📥 RECOLECCIÓN DE DATOS
        if (inputType === 'telefono') {
          const histTc = await tgClient.invoke(new Api.messages.GetHistory({ peer: BOT_TRUECALLER, limit: 1 }));
          let rawTc = histTc.messages[0]?.message || "";
          securityStatus = /spam|estafa|fraude|scam/i.test(rawTc) ? '⚠️ SPAM DETECTADO' : 'Limpio ✅';
          
          respTc = rawTc
            .replace(/Unknown Says/gi, "Otras Fuentes")
            .replace(/TrueCaller Says/gi, "Truecaller")
            .replace(/🔍/g, "⊳").replace(/Name:/gi, "❀ *Nombre:*").replace(/Carrier:/gi, "❀ *Red:*");
        } else {
          securityStatus = 'No aplicable a este formato ⚪';
        }

        const histSocial = await tgClient.invoke(new Api.messages.GetHistory({ peer: BOT_SOCIAL, limit: 1 }));
        respSocial = (histSocial.messages[0]?.message || "Sin huella social")
          .replace(/Facebook/gi, "📘 *FB:*").replace(/Instagram/gi, "📸 *IG:*");

        if (BOT_BREACHES !== "@PonAquiTuBotDeLeaks") {
          const histBreach = await tgClient.invoke(new Api.messages.GetHistory({ peer: BOT_BREACHES, limit: 1 }));
          respBreach = histBreach.messages[0]?.message || "Sin filtraciones detectadas.";
        } else {
           respBreach = "Módulo de brechas offline. Configura un nodo.";
        }

        await tgClient.disconnect();
      } catch (tgError) {
        respSocial = "Fallo de conexión MTProto.";
      }

      // ==========================================
      // 🛡️ 3. REPORTE SUPREMO
      // ==========================================
      let report = `╭⋯ 『 🕵️‍♂️ *LUFEROS SUPREME OSINT* 』 ⋯》\n`;
      report += `┊\n`;
      report += `❀ *Objetivo:* ${target}\n`;
      report += `❀ *Tipo:* ${inputType.toUpperCase()}\n`;
      report += `❀ *Seguridad:* ${securityStatus}\n`;
      report += `┊\n`;

      if (inputType === 'telefono') {
        report += `╭⋯ 🟢 *WHATSAPP / TELEFONÍA* ⋯》\n┊\n`;
        report += `┊ ⊳ *WA Activo:* ${isOnWhatsApp ? 'Sí ✅' : 'No ❌'}\n`;
        report += `┊ ⊳ *Bio:* "${statusInfo}"\n┊\n`;
        report += `${respTc.split('\n').filter(l => l.trim()).map(l => `┊ ${l.trim()}`).join('\n')}\n┊\n`;
      }

      report += `╭⋯ 🌐 *HUELLA DIGITAL (REDES)* ⋯》\n┊\n`;
      report += `${respSocial.split('\n').filter(l => l.trim()).map(l => `┊ ${l.trim()}`).join('\n')}\n┊\n`;
      
      report += `╭⋯ ⚠️ *INFILTRACIONES (DATABASES)* ⋯》\n┊\n`;
      report += `${respBreach.split('\n').filter(l => l.trim()).map(l => `┊ ${l.trim()}`).join('\n')}\n┊\n`;

      report += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n`;
      report += `> 🛡️ *Powered by LuferOS Security*`;

      if (profilePic && inputType === 'telefono') {
        await client.sendMessage(m.chat, { image: { url: profilePic }, caption: report }, { quoted: m });
      } else {
        await client.sendMessage(m.chat, { text: report }, { quoted: m });
      }

      await m.react('✔️');

    } catch (e) {
      console.error("[LUMIBOT ERROR]", e);
      await m.react('✖️');
      await m.reply(`╭⋯ ❌ *ERROR CRÍTICO* ⋯》\n┊ Fallo: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    } finally {
      isScanning = false;
    }
  }
}
