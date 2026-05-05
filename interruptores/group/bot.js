export default {
  command: ['soyyo', 'ownercheck'],
  run: async (client, m) => {
    const isOwner = m.isOwner // Esto depende de tu estructura de comandos
    if (isOwner) {
      await m.reply("╭⋯ 🛡️ STATUS: OWNER DETECTADO ⋯》\n┊ Confirmado, mi rey. Tienes el tótem activo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》")
    } else {
      await m.reply(`╭⋯ ⚠️ STATUS: CIVIL DETECTADO ⋯》\n┊ El sistema te ve como un usuario normal.\n┊ ID Detectado: ${m.sender.split('@')[0]}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
