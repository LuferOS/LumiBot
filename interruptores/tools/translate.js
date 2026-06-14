import fetch from 'node-fetch'

const ALYA_KEY = 'api-lYsN6';

export default {
  command: ['translate', 'tr', 'traducir'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply(`🙄 *Bruh, dime qué quieres que traduzca o en qué idioma.* 💅\n> Ejemplo: *${usedPrefix}${command} en Hola como estas*\n> (Si te da pereza poner idioma, por defecto lo paso a español)`)
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
        return m.reply(`🙄 *Literal me pediste que tradujera el vacío. Escribe algo.* 💅`)
    }
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/tools/translate?text=${encodeURIComponent(text)}&to=${lang}&key=${ALYA_KEY}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      const data = await res.json()
      
      if (!data.status) {
         await m.react('❌')
         return m.reply(`🙄 *Ay por favor...*\nMis neuronas políglotas colapsaron. El traductor está caído o el idioma no existe. 💅`)
      }

      const translation = data.translated || data.translation || data.text
      
      const caption = `╭━━━━━━━━━━━━━━━╮\n┃ 🌐 *TRADUCTOR* (${lang.toUpperCase()})\n┃━━━━━━━━━━━━━━━\n┃ ${translation}\n╰━━━━━━━━━━━━━━━╯`
      
      await m.reply(caption)
      await m.react('✅')
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en translate.js:", e)
      await m.react('❌')
      await m.reply(`🙄 *Ups, algo explotó.* 💅\nEl traductor me bloqueó.\n> Error técnico: ${e.message}`)
    }
  }
}
