export default {
  command: ['tarjeta', 'card', 'ownerinfo', 'creador', 'owner', 'luferos'],
  isOwner: false, // Lo dejé en false para que cualquiera pueda pedir tu tarjeta y saber quién manda
  description: 'Muestra la tarjeta de contacto táctico del Administrador (LuferOS)',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // ⚡ LUMIBOT OVERRIDE: VCard reescrito para el Comandante
      const vcard = `BEGIN:VCARD
VERSION:3.0
N:;LuferOS;;;
FN:LuferOS Security (Administrador Supremo)
ORG:SISTEMA LUMIBOT;
TEL;type=CELL;type=VOICE;waid=573118353868:+57 311 835 3868
END:VCARD`;
      
      await client.sendMessage(m.chat, { 
        contacts: { 
          displayName: '🛡️ LuferOS - Comandante', 
          contacts: [{ vcard }] 
        } 
      }, { quoted: m });
      
    } catch (err) {
      console.error("[LUMIBOT DEBUG] Error en tarjeta.js:", err);
      await m.reply('╭⋯ ❌ *ERROR DE SISTEMA* ⋯》\n┊ Fallo al renderizar la tarjeta de contacto encriptada.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》');
    }
  }
};
