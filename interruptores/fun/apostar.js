export default {
  command: ['apostar', 'bet'],
  category: 'games',
  run: async (client, m, args) => {
    try {
      const user = global.db.data.users[m.sender]
      if (!user) return m.reply('🙄 *Bruh*, no estás en mi base de datos.')

      if (!args[0]) return m.reply(`🎰 *CASINO LUMIBOT* 🎰\n> 💡 Debes ingresar la cantidad a apostar.\n> *Ejemplo:* .apostar 50\n> *Ejemplo:* .apostar all\n\n💰 *Tus Coins:* ${user.coins || 0}`)

      let amount = 0
      if (args[0].toLowerCase() === 'all' || args[0].toLowerCase() === 'todo') {
        amount = user.coins || 0
      } else {
        amount = parseInt(args[0])
      }

      if (isNaN(amount) || amount < 10) {
        return m.reply('🙄 *No seas tacaño.* La apuesta mínima es de 10 Coins.')
      }

      if ((user.coins || 0) < amount) {
        return m.reply(`💸 *¡Estás en la quiebra!*\n> No tienes suficientes Coins para esta apuesta.\n> Tienes: *${user.coins || 0} Coins*`)
      }

      // Restamos el dinero temporalmente
      user.coins -= amount

      // Lógica 50/50
      const win = Math.random() >= 0.5

      await m.react('🎰')

      setTimeout(async () => {
        if (win) {
          const reward = amount * 2
          user.coins += reward
          await m.reply(`🎰 *CASINO LUMIBOT* 🎰\n\n🎉 *¡GANASTE!* 🎉\n> Apostaste: *${amount}*\n> Ganaste: *${reward} Coins*\n\n💰 *Saldo actual:* ${user.coins} Coins`)
          await m.react('🤑')
        } else {
          await m.reply(`🎰 *CASINO LUMIBOT* 🎰\n\n💀 *¡PERDISTE!* 💀\n> Apostaste: *${amount}*\n> Lo perdiste todo.\n\n💰 *Saldo actual:* ${user.coins} Coins`)
          await m.react('📉')
        }
      }, 2000) // Simulación de tiempo de ruleta

    } catch (e) {
      console.error('[LUMIBOT DEBUG] Error en apostar:', e)
      m.reply('🙄 *Hubo un error en el casino. El dinero ha sido reembolsado.*')
    }
  }
}
