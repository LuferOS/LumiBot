import fs from 'fs'
import path from 'path'
import crypto from 'node:crypto'

// 📂 INFRAESTRUCTURA PERSISTENTE DE LUFEROS
const STORAGE_DIR = './base_datos/malware_archive/'
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true })

let activeScans = new Map()

export default {
  command: ['scan', 'escanear', 'vt', 'virus'],
  category: 'tools',
  run: async (client, m, { args, usedPrefix, command }) => {
    const userId = m.sender

    // 🛑 PROTOCOLO KILL SWITCH
    if ((args || [])[0] === 'stop') {
      if (activeScans.has(userId)) {
        activeScans.get(userId).abort = true
        activeScans.delete(userId)
        return m.reply("┊ ⊳ 🛑 Operación abortada por el Comandante. Purgando sectores...")
      }
      return m.reply("┊ ⊳ No hay procesos activos en tu nodo.")
    }

    try {
      const q = m.quoted ? m.quoted : m
      const mediaMessage = q.msg || q
      const mime = mediaMessage?.mimetype || ''
      
      if (!mime) return m.reply(`╭⋯ ⚠️ *ERROR DE OBJETIVO* ⋯》\n┊ Rastro digital no detectado.\n┊ Cita un archivo con *${usedPrefix + command}*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)

      await m.react('🕵️‍♂️')
      let { key } = await client.sendMessage(m.chat, { 
        text: `╭⋯ 📡 *LUFEROS SECURITY v7.0* ⋯》\n┊ [░░░░░░░░░░] 0%\n┊ Calibrando hardware: Gemini 3 Flash Preview...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
      }, { quoted: m })

      activeScans.set(userId, { abort: false })

      // 🏁 FASE 1: COPIADO A DISCO (1% - 30%)
      const buffer = await q.download?.() || await q.download()
      if (!buffer) throw new Error("Fallo en la extracción del flujo.")

      const fileHash = crypto.createHash('sha256').update(buffer).digest('hex')
      const ext = mime.split('/')[1]?.split('-').pop() || 'bin'
      const fileName = `SCAN_${fileHash.substring(0, 8)}.${ext}`
      const filePath = path.join(STORAGE_DIR, fileName)

      for (let i = 1; i <= 3; i++) {
        if (activeScans.get(userId)?.abort) return
        await new Promise(r => setTimeout(r, 600))
        await client.sendMessage(m.chat, { 
          text: `╭⋯ 📡 *FASE 1: PERSISTENCIA* ⋯》\n┊ [${'█'.repeat(i * 3)}${'░'.repeat(10 - i * 3)}] ${i * 10}%\n┊ Copiando datos a memoria física...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key 
        })
      }
      fs.writeFileSync(filePath, buffer)

      // 🏁 FASE 2: UPLINK AL NODO V3 (31% - 60%)
      const VT_API_KEY = 'VIRUS_TOTAL_KEY'.trim()
      let uploadUrl = 'https://www.virustotal.com/api/v3/files'

      if (buffer.length > 30 * 1024 * 1024) {
        const urlRes = await fetch('https://www.virustotal.com/api/v3/files/upload_url', { headers: { 'x-apikey': VT_API_KEY } })
        const urlData = await urlRes.json()
        if (urlData.data) uploadUrl = urlData.data
      }

      const form = new FormData()
      form.append('file', new Blob([buffer], { type: mime }), fileName)

      for (let i = 4; i <= 6; i++) {
        if (activeScans.get(userId)?.abort) return
        await new Promise(r => setTimeout(r, 800))
        await client.sendMessage(m.chat, { 
          text: `╭⋯ 📡 *FASE 2: UPLINK TÁCTICO* ⋯》\n┊ [${'█'.repeat(i)}${'░'.repeat(10 - i)}] ${i * 10}%\n┊ Transfiriendo paquete al nodo central...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key 
        })
      }

      const upRes = await fetch(uploadUrl, { method: 'POST', headers: { 'x-apikey': VT_API_KEY }, body: form })
      const upData = await upRes.json()
      if (upData.error) throw new Error(upData.error.message)
      const analysisId = upData.data?.id

      // 🏁 FASE 3: LABORATORIO FORENSE (61% - 90%)
      let status = 'queued'
      let finalReport = null
      let attempts = 0

      while (status !== 'completed' && attempts < 10) {
        if (activeScans.get(userId)?.abort) return
        attempts++
        let progress = 60 + (attempts * 3)
        await client.sendMessage(m.chat, { 
          text: `╭⋯ 📡 *FASE 3: LABORATORIO VT* ⋯》\n┊ [${'█'.repeat(Math.floor(progress/10))}${'░'.repeat(10 - Math.floor(progress/10))}] ${progress}%\n┊ Ejecutando firmas heurísticas (Intento ${attempts})...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key 
        })
        await new Promise(r => setTimeout(r, 12000))
        const cRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, { headers: { 'x-apikey': VT_API_KEY } })
        finalReport = await cRes.json()
        status = finalReport.data?.attributes?.status || 'queued'
      }

      // 🏁 FASE 4: INTELIGENCIA GEMINI (91% - 100%)
      await client.sendMessage(m.chat, { 
        text: `╭⋯ 📡 *FASE 4: ANÁLISIS IA G3* ⋯》\n┊ [██████████] 100%\n┊ Gemini 3 Flash Preview analizando ADN viral...\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, edit: key 
      })

      const dataAttr = finalReport?.data?.attributes || {}
      const stats = dataAttr.stats || { malicious: 0, undetected: 0 }
      const results = dataAttr.results || {}
      const engines = Object.keys(results).filter(e => results[e]?.category === 'malicious')

      // INTEGRACIÓN GEMINI 3 FLASH PREVIEW
      const GEMINI_KEY = 'KEY_GEMINI_AQUI'.trim()
      const prompt = `Actúa como un experto en ciberseguridad. Analiza este reporte de VirusTotal:
- Archivo: ${mime}
- Motores Maliciosos: ${stats.malicious}
- Detecciones clave: ${engines.slice(0, 15).join(', ')}

1. Identifica qué tipo de malware es (Troyano, Spyware, etc).
2. Explica paso a paso qué intentaría hacer en un dispositivo Android o PC (robo de datos, bloqueo, etc).
3. Da un veredicto asertivo, directo y sarcástico sobre la peligrosidad del archivo.`
      
      let aiSummary = "Fallo de conexión con el nodo Gemini 3 Preview."
      try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        const aiData = await aiRes.json()
        aiSummary = aiData.candidates?.[0]?.content?.parts?.[0]?.text || aiSummary
      } catch (e) { console.log("G3_ERR:", e) }

      // 📜 REPORTE MAESTRO FINAL
      let report = `╭⋯ 『 🕵️‍♂️ *AUTOPSIA DIGITAL LUFEROS v7* 』 ⋯》\n┊\n`
      report += `❀ *VERDICTO:* ${stats.malicious > 0 ? '☠️ AMENAZA CRÍTICA' : '✅ ARCHIVO SEGURO'}\n`
      report += `❀ *SCORE:* ${stats.malicious} Positivos / ${stats.undetected} Limpios\n`
      report += `❀ *PESO:* ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n┊\n`
      
      report += `╭⋯ 🧠 *ANÁLISIS GEMINI 3 FLASH* ⋯》\n`
      report += `┊ ${aiSummary.trim().replace(/\n/g, '\n┊ ')}\n┊\n`

      if (engines.length > 0) {
        report += `╭⋯ ☠️ *FIRMAS DETECTADAS* ⋯》\n`
        engines.slice(0, 10).forEach(e => {
            report += `┊ ⊳ *${e}:* ${results[e]?.result?.substring(0, 30) || 'Malware'}\n`
        })
        report += `┊\n`
      }

      report += `╭⋯ 📝 *METADATOS TÉCNICOS* ⋯》\n`
      report += `┊ ⊳ SHA256: ${fileHash.substring(0, 20)}...\n`
      report += `┊ ⊳ Local: /malware_archive/${fileName}\n┊ ⊳ Status: Análisis Completado.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> 🛡️ *LuferOS Security - Threat Intel Center*`

      await client.sendMessage(m.chat, { text: report, edit: key })
      activeScans.delete(userId)
      await m.react('✔️')

    } catch (e) {
      activeScans.delete(m.sender)
      console.error(e)
      m.reply(`╭⋯ ❌ *FALLO EN EL PROCESADOR* ⋯》\n┊ Detalle: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
