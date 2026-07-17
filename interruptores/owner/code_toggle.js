export default {
  command: ['codeon', 'codeoff'],
  category: 'owner',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data;
    if (!db.settings) db.settings = {};

    const isOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender);
    if (!isOwner) {
      return client.reply(m.chat, "╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Este comando es exclusivo para LuferOS.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    }

    if (command === 'codeon') {
      db.settings.registrationEnabled = true;
      return client.reply(m.chat, "╭⋯ 🟢 *REGISTROS ABIERTOS* ⋯》\n┊ Los usuarios ahora pueden generar subbots.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    } else if (command === 'codeoff') {
      db.settings.registrationEnabled = false;
      return client.reply(m.chat, "╭⋯ 🔴 *REGISTROS CERRADOS* ⋯》\n┊ La generación de subbots ha sido bloqueada.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    }
  }
};
