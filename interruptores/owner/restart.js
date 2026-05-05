export default {
  command: ['restart', 'reiniciar'],
  category: 'mod',
  isOwner: true,
  run: async (client, m) => {
    try {
      // Un toque amigable y cute ✨
      await m.reply(`╭⋯ ✨ *¡Un respiro rapidito!* ⋯》\n┊ Voy a tomar una siesta de un par de\n┊ segunditos para recargar energías.\n┊ ¡Vuelvo enseguida, no me extrañen! 🌸\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      
      setTimeout(() => {
        if (process.send) {
          process.send("restart")
        } else {
          process.exit(0)
        }
      }, 3000)
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en restart.js:", e);
      await m.reply(`╭⋯ 🥺 *¡Ups, un tropezón!* ⋯》\n┊ Me enredé un poquito intentando reiniciar.\n┊ ¿Me das una revisadita? 🛠️\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  },
};
