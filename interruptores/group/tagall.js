export default {
  command: ['todos', 'invocar', 'tagall'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    try {
      const groupInfo = await client.groupMetadata(m.chat)
      const participants = groupInfo.participants
      const pesan = args.join(' ')
      
      let teks = `╭⋯ 📢 *LLAMADO TÁCTICO GENERAL* ⋯》\n`
      teks += `┊ ⊳ *Motivo:* ${pesan || 'Convocatoria obligatoria de escuadrón.'}\n`
      teks += `┊ ⊳ *Operativos:* ${participants.length}\n`
      teks += `┊ ⊳ *Comandante:* @${m.sender.split('@')[0]}\n`
      teks += `┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
      
      for (const mem of participants) {
        // Extraemos solo el número antes del @ para la visualización limpia
        let printId = mem.id.split('@')[0];
        teks += `┊ ⊳ @${printId}\n`
      }
      teks += `╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
      
      // Mantenemos global.miku porque ya le inyectamos tu identidad visual en settings.js
      return client.reply(m.chat, teks, m, global.miku, { mentions: [m.sender, ...participants.map(p => p.id)] })
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en tagall:", e);
      return m.reply(`╭⋯ ❌ *ERROR DE SISTEMA* ⋯》\n┊ Fallo al ejecutar la alerta general en este sector.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
