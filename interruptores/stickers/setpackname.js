export default {
  command: ['setstickerpackname', 'setpackname', 'packname'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`✨ Especifica el nombre del paquete y el nuevo nombre.\n> Ejemplo: *${usedPrefix + command} NombreActual | NuevoNombre*`, m, global.lumi)
      }
      const fullText = args.join(' ').trim()
      const parts = fullText.split(/\||•|\//)
      if (parts.length < 2) {
        return m.reply(`🙄 Especifica el nombre del paquete y el nuevo nombre.\n> Ejemplo: *${usedPrefix + command} NombreActual | NuevoNombre*`, m, global.lumi)
      }
      const packName = parts[0].trim()
      const newName = parts[1].trim()
      if (!newName || newName.length === 0) {
        return m.reply('💋 El nuevo nombre no puede estar vacío.', m, global.lumi)
      }
      if (newName.length < 4 || newName.length > 64) {
        return m.reply('👑 El nuevo nombre debe tener entre 4 y 64 caracteres.', m, global.lumi)
      }
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}
      const packs = db.stickerspack[m.sender]?.packs || []
      if (!packs || packs.length === 0) {
        return m.reply('🙄 No tienes paquetes creados.', m, global.lumi)
      }
      if (packs.find(p => p.name.toLowerCase() === newName.toLowerCase())) {
        return m.reply('🔥 Ya tienes un paquete con ese nombre.', m, global.lumi)
      }
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      if (!pack) {
        return m.reply(`💅 Literalmente Literalmente no encontré el paquete de stickers \`${packName}\`.`, m, global.lumi)
      }
      pack.name = newName
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      await m.reply(`💖 El paquete de stickers \`${packName}\` ahora se llama \`${newName}\`!`, m, global.lumi)
    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}
