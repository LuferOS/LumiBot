export default {
  command: ['bots'],
  category: 'owner',
  run: async (client, m, args, usedPrefix, command) => {
    const isOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender);
    if (!isOwner) {
      return client.reply(m.chat, "╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Este comando es exclusivo para LuferOS.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    }

    const action = args[0]?.toLowerCase();

    if (action === 'off') {
      global.subbotsMuted = true;
      return client.reply(m.chat, "╭⋯ 💤 *CLONES DORMIDOS* ⋯》\n┊ Todos los subbots han sido desactivados.\n┊ Seguirán conectados pero no responderán a nada.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    } else if (action === 'on') {
      global.subbotsMuted = false;
      return client.reply(m.chat, "╭⋯ ⚡ *CLONES DESPERTADOS* ⋯》\n┊ Todos los subbots han vuelto a la normalidad.\n┊ Responderán a los comandos habituales.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    } else {
      return client.reply(m.chat, "╭⋯ ❌ *SINTAXIS INCORRECTA* ⋯》\n┊ Uso correcto:\n┊ .bots on  (Enciende todos los subbots)\n┊ .bots off (Apaga todos los subbots)\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m);
    }
  }
};
