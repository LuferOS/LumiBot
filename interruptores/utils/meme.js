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

      await m.react('🕒')

      const systemPrompt = `Eres un creador de memes experto y muy gracioso. Analiza el siguiente texto y conviértelo en el texto para un meme corto y divertido.
Elige ALEATORIAMENTE una de estas plantillas: drake, doge, rollsafe, sad-biden, fine, fry, stonks, woman-cat, spongebob, pigeon, db, dg.
Responde ÚNICAMENTE en este formato estricto:
plantilla|Texto Arriba|Texto Abajo
Si el texto ya es gracioso, sepáralo en dos partes. Si no, inventa un remate gracioso relacionado al texto. Usa _ (guion bajo) para los espacios.
No digas nada más, solo la respuesta en el formato indicado.`

      const url = `https://api.alyacore.xyz/ai/gptprompt?text=${encodeURIComponent(targetText.trim())}&prompt=${encodeURIComponent(systemPrompt)}&key=api-lYsN6`
      
      const res = await fetch(url)
      const data = await res.json()

      if (!data.status || !data.result) {
        await m.react('✖️')
        return m.reply(`🙄 *La IA no quiso generar el meme* 💅\n> Hubo un error de AlyaCore.`)
      }

      let resultText = data.result.trim()
      let parts = resultText.split('|')
      if (parts.length < 3) {
        // Fallback in case AI messes up the format
        parts = ['drake', 'Cuando_la_IA_se_rompe', 'Pero_igual_tengo_meme']
      }

      let [template, top, bottom] = parts
      
      const formatText = (t) => t.trim().replace(/\s+/g, '_').replace(/\?/g, '~q').replace(/&/g, '~a').replace(/#/g, '~p').replace(/\//g, '~s')
      
      top = formatText(top) || '_'
      bottom = formatText(bottom) || '_'

      const memeUrl = `https://api.memegen.link/images/${template}/${top}/${bottom}.png`

      await client.sendMessage(m.chat, { image: { url: memeUrl }, caption: `✨ *Tu meme servido, bb* ✨\n> Factos 💅` }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en meme.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Todo explotó haciendo tu meme* 💅\n> Error: ${e.message}`)
    }
  }
}
