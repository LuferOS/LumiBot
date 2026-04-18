export default {
  command: ['tarjeta','card','ownerinfo','creador','owner'],
  isOwner: true,
  description: 'Muestra una tarjeta de contacto del creador del bot',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const vcard = `BEGIN:VCARD
VERSION:3.0
N:;(ㅎㅊDEPOOLㅊㅎ);;;
FN:(ㅎㅊDEPOOLㅊㅎ) Creador del Bot
ORG:Hatsune Miku Bot;
TEL;type=CELL;type=VOICE;waid=51988514570:+51 988 514 570
END:VCARD`;
      await client.sendMessage(m.chat, { contacts: { displayName: '(ㅎㅊDEPOOLㅊㅎ) - Creador', contacts: [{ vcard }] } }, { quoted: m });
    } catch (err) {
      console.error(err);
      await m.reply('💙 Error al enviar la tarjeta.');
    }
  }
};