import fetch from 'node-fetch'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['translate', 'tr', 'traducir'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, ingresa el texto a traducir y opcionalmente el idioma.* 💅\n> Ejemplo: *${usedPrefix}${command} en Hola como estas*\n> (Por defecto lo traduce a español si no le dices nada)`)
    }
    
    await m.react('⏳')
    
    let text = ''
    let lang = 'es' // Default a español
    
    // Si el primer argumento es corto (ej: en, es, fr, ja, ru), lo tomamos como idioma de destino
    if (args[0].length === 2 || args[0].length === 3) {
      lang = args[0]
      text = args.slice(1).join(' ')
    } else {
      text = args.join(' ')
    }
    
    // Si el usuario responde a un mensaje, intentamos traducir ese mensaje
    if (m.quoted && m.quoted.text) {
      if (text === '') text = m.quoted.text
      else text = text + " " + m.quoted.text
    }

    if (!text) {
        return m.reply(`🙄 *No hay nada que traducir.* 💅`)
    }
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/tools/translate?text=${encodeURIComponent(text)}&lang=${lang}&key=${ALYA_KEY}`)
      const data = await res.json()
      
      if (!data.status || !data.data) {
         await m.react('❌')
         return m.reply(`🙄 *La traducción falló.* 💅`)
      }

      const translation = data.data.translation || data.data.text || data.data
      
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🌐 *TRADUCTOR* (${lang.toUpperCase()})\n┃━━━━━━━━━━━━━━━\n┃ ${translation}\n╰━━━━━━━━━━━━━━━╯`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en translate.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Error en la API de traducción* 💅\n> Error: ${e.message}`)
    }
  }
}
