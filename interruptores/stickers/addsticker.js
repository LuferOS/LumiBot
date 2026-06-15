export default {
  command: ['addsticker', 'stickeradd'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply('💅 Especifica el nombre del paquete.', m, global.lumi)
      }
      const packName = args.join(' ').trim()
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}
      if (!db.stickerspack[m.sender]) db.stickerspack[m.sender] = { packs: [] }
      const packs = db.stickerspack[m.sender].packs || []
      if (!packs || packs.length === 0) {
        return m.reply('💅 No tienes paquetes creados.', m, global.lumi)
      }
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      if (!pack) {
        return m.reply('✨ Literalmente Literalmente no encontré un paquete con ese nombre.', m, global.lumi)
      }
      const quoted = m.quoted
      if (!quoted) {
        return m.reply('💅 Responde a un sticker.', m, global.lumi)
      }
      const mime = quoted.mimetype || quoted.msg?.mimetype || ''
      if (!/webp/i.test(mime)) {
        return m.reply('🔥 Solo puedes agregar stickers.', m, global.lumi)
      }
      if (pack.stickers.length >= 50) {
        return m.reply('💖 Un paquete no puede tener más de 50 stickers.', m, global.lumi)
      }
      let buffer = await quoted.download()
      if (!buffer) {
        return m.reply('💅 No se pudo descargar el sticker.', m, global.lumi)
      }
      if (!Buffer.isBuffer(buffer)) {
        buffer = Buffer.from(buffer)
      }
      if (buffer.length === 0) {
        return m.reply('🙄 El sticker está vacío o corrupto.', m, global.lumi)
      }
      const base64Sticker = buffer.toString('base64')
      if (pack.stickers.includes(base64Sticker)) {
        return m.reply(`✨ El sticker ya existe en el paquete de stickers \`${pack.name}\`.`, m, global.lumi)
      }
      pack.stickers.push(base64Sticker)
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      m.reply(`🙄 Sticker agregado al pack \`${pack.name}\` correctamente!`, m, global.lumi)
    } catch (e) {
      m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  }
}
