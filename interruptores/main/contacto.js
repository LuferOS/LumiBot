export default {
  command: ['contacto', 'owner', 'creador'],
  category: 'info',
  desc: 'Muestra el contacto oficial del creador.',
  run: async (client, m) => {
    const vcard = 'BEGIN:VCARD\n'
                + 'VERSION:3.0\n'
                + 'FN:LuferOS (Creador LumiBot)\n'
                + 'TEL;type=CELL;type=VOICE;waid=573118353868:+57 311 835 3868\n'
                + 'END:VCARD';

    await client.sendMessage(m.chat, {
      contacts: {
        displayName: 'LuferOS',
        contacts: [{ vcard }]
      }
    }, { quoted: m });
  }
};
