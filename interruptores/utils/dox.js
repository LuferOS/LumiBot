export default {
  command: ['dox', 'doxear', 'hack'],
  category: 'utils',
  run: async (client, m, args) => {
    try {
      const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
      if (!mentioned) return m.reply('🙄 *Hackeando a quién? Menciona a alguien, no soy adivina.* 💅');
      
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      const navegadores = [
        "Chrome versión prehistórica", "Safari (puro aparentar)", "Internet Explorer 💀", 
        "Opera GX (modo otaku)", "Brave Browser (se cree anónimo)", "Firefox lleno de virus",
        "Netscape Navigator (literal un dinosaurio)", "Microsoft Edge (solo lo usa para descargar Chrome)",
        "Navegador de la 3DS", "Tor Browser (viendo cosas ilegales 👀)", "Navegador de la PlayStation 2",
        "UC Browser (tiene 5 troyanos)", "Navegador incógnito (siempre encendido 💅)", 
        "DuckDuckGo (pero igual le roban los datos)", "Puffin Web Browser", 
        "Vivaldi (nadie lo conoce)", "Google Chrome (con 85 pestañas abiertas consumiendo RAM)"
      ];
      const OS = [
        "Windows XP", "Android gama baja 🤡", "iPhone de segunda mano", "Linux (se cree hacker)", 
        "Windows 7 Pirata", "MacBook Pro prestada", "Nokia 3310 OS", "Windows 98", "iOS con batería al 2%",
        "Android lleno de espacio insuficiente", "BlackBerry OS", "Symbian 💀", "TempleOS",
        "Windows 10 (sin activar)", "Ubuntu (pero se la pasa buscando tutoriales)",
        "MacOS (llorando porque no le corren los juegos)", "Windows Vista 🤡", "Calculadora Casio",
        "Microondas inteligente", "Refrigerador Samsung"
      ];
      
      const texto = `💻 *INICIANDO HACKEO ÉPICO...* 💻\n\n` +
                    `> 👤 *Objetivo:* @${mentioned.split('@')[0]}\n` +
                    `> 🌐 *IP Expuesta:* \`${ip}\`\n` +
                    `> 🖥️ *Sistema Operativo:* ${OS[Math.floor(Math.random() * OS.length)]}\n` +
                    `> 🔍 *Navegador:* ${navegadores[Math.floor(Math.random() * navegadores.length)]}\n` +
                    `> 📍 *Ubicación:* En su cuarto llorando por su ex ✨\n\n` +
                    `*Status:* Literal, tu seguridad es un chiste 💅. Datos vulnerados con éxito.`;

      await client.sendMessage(m.chat, { text: texto, mentions: [mentioned] }, { quoted: m });
    } catch (e) {
      console.error(e);
      await m.reply('🙄 *El FBI me bloqueó el ataque.* 💅');
    }
  }
}
