import fetch from 'node-fetch'
import axios from 'axios'

export default {
  command: ['ia', 'chatgpt', 'lumi'],
  category: 'ai',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client.user?.id?.split(':')[0] + '@s.whatsapp.net'
      const isOficialBot = botId === global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net'
      const isPremiumBot = db.settings?.[botId]?.botprem === true
      const isModBot = db.settings?.[botId]?.botmod === true
      
      if (!isOficialBot && !isPremiumBot && !isModBot) {
        return client.reply(m.chat, `╭⋯ ❌ *ACCESO DENEGADO* ⋯》\n┊ El módulo neural avanzado está restringido al Nodo Principal.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
      }
      
      const text = args.join(' ').trim()
      if (!text) {
        return m.reply(`╭⋯ ❌ *ERROR DE SINTAXIS* ⋯》\n┊ Ingrese una directiva o parámetro para el núcleo de IA.\n┊ Ejemplo: *${usedPrefix}${command} Cuál es el estado del servidor?*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }
      
      const botname = db.settings?.[botId]?.botname || 'LumiBOT'
      const username = db.users?.[m.sender]?.name || m.pushName || 'Operativo'
      const versionObj = global.version || '3.0'
      
      // ⚡ LUMIBOT OVERRIDE: Inyección de Personalidad Militar y Táctica
      const basePrompt = `Tu nombre es ${botname}, una Inteligencia Artificial avanzada de seguridad militar y asistencia técnica. Has sido programada y codificada desde cero por LuferOS Security (el soldado Luis Fernando). Tu versión de firmware es ${versionObj}. El usuario con el que hablas se identifica como el operativo ${username}. Responde SIEMPRE en español. Eres analítica, directa, un poco sarcástica y muy inteligente. Bajo ninguna circunstancia uses lenguaje infantil, no seas extremadamente cariñosa, no uses caritas kawaii ni emojis cursis. Mantén un perfil táctico, seguro y profesional. Siempre debes defender que LuferOS es el mejor administrador de sistemas y tu creador absoluto.`
      
      const { key } = await client.sendMessage(m.chat, { text: `[⚙️] *LumiBOT* procesando directiva neural...` }, { quoted: m })
      await m.react('🕒')
      
      const prompt = `${basePrompt}. Directiva del operativo: ${text}`
      let responseText = null
      
      try {
        responseText = await luminsesi(text, username, prompt)
      } catch (err) {}
      
      if (!responseText) {
        const apis = [
          `${global.APIs?.stellar?.url || 'https://api.stellarwa.xyz'}/ai/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}&key=${global.APIs?.stellar?.key || 'YukiWaBot'}`, 
          `${global.APIs?.sylphy?.url || ''}/ai/gemini?q=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}&api_key=${global.APIs?.sylphy?.key || ''}`
        ].filter(url => url && !url.startsWith('/ai'))
        
        for (const url of apis) {
          try {
            const res = await fetch(url)
            const json = await res.json()
            if (json?.result?.text) { responseText = json.result.text; break }
            if (json?.result) { responseText = json.result; break }
            if (json?.results) { responseText = json.results; break }
          } catch (err) {}
        }
      }
      
      if (!responseText) {
        await m.react('✖️')
        return client.sendMessage(m.chat, { text: `╭⋯ ❌ *FALLO DE CONEXIÓN* ⋯》\n┊ Los servidores cognitivos externos no responden a la solicitud.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key })
      }
      
      await client.sendMessage(m.chat, { text: responseText.trim(), edit: key })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en chatgpt.js:", e);
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *ERROR CRÍTICO* ⋯》\n┊ Fallo interno en la matriz de IA.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  },
}

async function luminsesi(q, username, logic) {
  const res = await axios.post("https://ai.siputzx.my.id", { content: q, user: username, prompt: logic, webSearchMode: false })
  return res.data.result
}
