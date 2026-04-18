export default {
  command: ['report', 'reporte', 'sug', 'suggest'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
   
    let texto = ''
    if (m.quoted && m.quoted.text) {
      texto = m.quoted.text.trim()
    } else if (args && args.length > 0) {
      texto = args.join(' ').trim()
    }
    
  
    console.log('DEBUG - Comando:', command)
    console.log('DEBUG - Args:', args)
    console.log('DEBUG - Texto citado:', m.quoted?.text)
    console.log('DEBUG - Texto final:', texto)
    
    const now = Date.now()
    const cooldown = global.db.data.users[m.sender].sugCooldown || 0
    const restante = cooldown - now
    if (restante > 0) {
      return m.reply(` Debes esperar *${msToTime(restante)}* para volver a usar este comando.`, m, global.miku)
    }
    if (!texto) {
      return m.reply(` Debes *escribir* el *reporte* o *sugerencia*.\n\n> Ejemplo: ${usedPrefix}reporte El bot no responde`, m, global.miku)
    }
    if (texto.length < 10) {
      return m.reply(' Tu mensaje es *demasiado corto*. Explica mejor tu reporte/sugerencia (mínimo 10 caracteres)', m, global.miku)
    }
    const fecha = new Date()
    const fechaLocal = fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const esReporte = ['report', 'reporte'].includes(command)
    const tipo  = esReporte ? '⚠️ REPORTE' : '✨ SUGERENCIA'
    const tipo2 = esReporte ? '💙 Reporte' : '💙 Sugerencia'
    const user = m.pushName || 'Usuario desconocido'
    const numero = m.sender.split('@')[0]
    const pp = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/736x/0c/1e/f8/0c1ef8e804983e634fbf13df1044a41f.jpg')
    let reportMsg = `*~ ✨📋 ${tipo} 📋✨ ~*\n\n👤 *Información del Usuario*\n📝 *Nombre:* ${user}\n📞 *Número:* wa.me/${numero}\n📅 *Fecha:* ${fechaLocal}\n\n💬 *Mensaje:*\n${texto}\n\n*~ 🔍 Requeriendo Atención 🔍 ~*`
    for (const num of global.owner) {
      try {
        await global.client.sendContextInfoIndex(`${num}@s.whatsapp.net`, reportMsg, {}, null, false, null, { banner: pp, title: tipo2, body: '👥📢 Atención Staff, por favor revisen.', redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link })
      } catch {}
    }
    global.db.data.users[m.sender].sugCooldown = now + 24 * 60 * 60000
    m.reply(`✅🎉 Gracias por tu *${esReporte ? 'reporte' : 'sugerencia'}*\n\n📨 Tu mensaje fue enviado correctamente a los moderadores\n\n⏰ Podrás enviar otro en 24 horas`)
  },
}

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))
  const s = seconds.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  const h = hours.toString().padStart(2, '0')
  const d = days.toString()
  const parts = []
  if (days > 0) parts.push(`${d} día${d > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${h} hora${h > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${m} minuto${m > 1 ? 's' : ''}`)
  parts.push(`${s} segundo${s > 1 ? 's' : ''}`)
  return parts.join(', ')
}
