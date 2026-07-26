export default {
  command: ['del', 'delete', 'borrar'],
  category: 'group',
  run: async (client, m, args, usedPrefix, command) => {
    if (!m.quoted) {
      return client.reply(m.chat, '╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Responde al mensaje que deseas eliminar.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);
    }

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
    if (groupMetadata) {
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';

      if (!m.quoted.fromMe) {
        // If not deleting the bot's own message, bot must be admin
        if (!admins.includes(botId)) {
          return client.reply(m.chat, '╭⋯ 🛑 *ERROR DE PERMISOS* ⋯》\n┊ Necesito ser administrador para borrar mensajes de otras personas.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);
        }

        // The user requesting the deletion must also be an admin
        if (!admins.includes(m.sender)) {
          return client.reply(m.chat, '╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Solo los administradores pueden borrar mensajes de otros usuarios.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);
        }
      }
    }

    const key = {
      remoteJid: m.chat,
      fromMe: m.quoted.fromMe,
      id: m.quoted.id,
      participant: m.quoted.sender || m.chat
    };

    try {
      await client.sendMessage(m.chat, { delete: key });
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error al eliminar mensaje:", e);
      await client.reply(m.chat, '╭⋯ ❌ *ERROR* ⋯》\n┊ No se pudo borrar el mensaje. Puede que sea muy antiguo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》', m);
    }
  }
};
