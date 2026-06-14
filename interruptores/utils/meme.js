import fetch from 'node-fetch'

export default {
  command: ['meme', 'm'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      let targetText = ''
      if (m.quoted) {
        targetText = m.quoted.text || m.quoted.conversation || m.quoted.body || m.quoted.message?.conversation || m.quoted.message?.extendedTextMessage?.text || ''
      }
      if (!targetText) targetText = args.join(' ')

      if (!targetText.trim()) {
        return m.reply(`🙄 *Bruh, responde a un mensaje de texto o escribe algo.* 💅\n> Ejemplo: *${usedPrefix}${command} Literal yo cuando me levanto temprano*`)
      }

      // 5% de probabilidad de video
      if (Math.random() < 0.05) {
        await m.react('🕒')
        const randomVideo = 'https://i.imgur.com/3Z6zQhO.mp4' // Video meme gracioso genérico
        await client.sendMessage(m.chat, { video: { url: randomVideo }, caption: `✨ *¡JACKPOT! 5% de probabilidad: Video Meme* ✨\n> Literal 💅`, gifPlayback: true }, { quoted: m })
        return await m.react('✔️')
      }

      await m.react('🕒')

      const systemPrompt = `Eres un creador de memes experto y muy gracioso. Analiza el texto de un usuario y escribe SOLO un texto corto y burlón (máximo 6 palabras) que sirva como "Texto Superior" para burlarte de lo que dijo.
El texto inferior será exactamente lo que él dijo, así que haz que tenga sentido.
Elige ALEATORIAMENTE una de estas plantillas: drake, doge, rollsafe, sad-biden, fine, fry, stonks, woman-cat, spongebob, pigeon, db, dg.
Responde ÚNICAMENTE en este formato estricto:
plantilla|Texto Arriba
Si no entiendes, pon algo genérico. Usa _ (guion bajo) para los espacios.
No digas nada más.`

      const url = `https://api.alyacore.xyz/ai/gptprompt?text=${encodeURIComponent(targetText.trim())}&prompt=${encodeURIComponent(systemPrompt)}&key=api-lYsN6`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status || !data.result) {
        await m.react('✖️')
        return m.reply(`🙄 *La IA no quiso generar el meme* 💅\n> Hubo un error de AlyaCore.`)
      }

      let resultText = data.result.trim()
      let parts = resultText.split('|')
      if (parts.length < 2) {
        parts = ['drake', 'Cuando_dices_estas_cosas']
      }

      let [template, top] = parts
      let bottom = targetText.slice(0, 100) // Limitamos a 100 caracteres
      
      const formatText = (t) => t.trim().replace(/\s+/g, '_').replace(/\?/g, '~q').replace(/&/g, '~a').replace(/#/g, '~p').replace(/\//g, '~s')
      
      top = formatText(top) || '_'
      bottom = formatText(bottom) || '_'

      const memeUrl = `https://api.memegen.link/images/${template}/${top}/${bottom}.png`

      await client.sendMessage(m.chat, { image: { url: memeUrl }, caption: `✨ *Tu meme customizado, bb* ✨\n> Factos 💅` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en meme.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó haciendo tu meme* 💅\n> Error: ${e.message}`)
    }
  }
}
