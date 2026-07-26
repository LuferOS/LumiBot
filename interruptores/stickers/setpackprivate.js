export default {
  command: ['setpackprivate', 'setpackpriv', 'packprivate'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply('✨ O sea, debes especificar el nombre del paquete de stickers.', m, global.lumi)
      }
      const packName = args.join(' ').trim()
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}
      const packs = db.stickerspack[m.sender]?.packs || []
      if (!packs || packs.length === 0) {
        return m.reply('👑 No tienes paquetes creados.', m, global.lumi)
      }
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      if (!pack) {
        return m.reply(`✨ Literalmente Literalmente no encontré el paquete de stickers \`${packName}\`.`, m, global.lumi)
      }
      if (pack.spackpublic === 0) {
        return m.reply(`💅 El paquete de stickers \`${pack.name}\` ya es privado.`, m, global.lumi)
      }
      pack.spackpublic = 0
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      await m.reply(`👑 El paquete de stickers \`${pack.name}\` ha sido establecido como privado!`, m, global.lumi)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}
