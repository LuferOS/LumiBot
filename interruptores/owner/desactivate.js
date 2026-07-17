export default {
  command: ['desactivate', 'desactivar'],
  category: 'owner',
  run: async (client, m, args) => {
    try {
      const input = args.join(' ').trim();
      
      // Verificamos que la clave de acceso sea exactamente "key=LuferOS"
      if (input !== 'key=LuferOS') {
        return m.reply("╭⋯ 🛑 *ACCESO DENEGADO* ⋯》\n┊ Clave de desactivación incorrecta o ausente.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
      }

      await m.reply(`╭⋯ ⚠️ *ADVERTENCIA CRÍTICA* ⋯》\n┊ ⊳ *Sistema:* LumiBot\n┊ ⊳ *Acción:* Desactivación del grupo\n┊ ⊳ *Autorización:* LuferOS\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ Desactivando el bot permanentemente\n┊ en este grupo. Ignorando comandos...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);

      // Desactivamos el bot en el grupo actual
      setTimeout(() => {
        global.db.data.chats[m.chat].isBanned = true;
        global.db.data.chats[m.chat].bannedByOwner = true; // Para que los admins normales no puedan prenderlo
      }, 1000);

    } catch (e) {
      console.error("[LUMIBOT DESACTIVATE] Error:", e);
      m.reply("❌ Error en el comando de desactivación.");
    }
  }
};
