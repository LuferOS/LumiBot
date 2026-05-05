import { promises as fs } from 'fs'
import path from 'path'

export default {
  command: ['buscar', 'find', 'search'],
  isOwner: true, // ⚡ LUMIBOT OVERRIDE: Solo el Comandante puede usar esto
  category: 'owner',
  run: async (client, m, args, usedPrefix, command, text) => {
    // Si no pones nada a buscar, te regaña
    if (!text) {
      return m.reply(`╭⋯ ⚠️ *Falta el parámetro* ⋯》\n┊ Bro, dime qué carajos estamos buscando.\n┊ Ejemplo: ${usedPrefix + command} vectorink\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }

    await m.react('🕒')
    const searchQuery = text.toLowerCase()
    const rootDir = process.cwd() // Escanea desde la raíz del bot
    const results = []

    // 🛡️ Filtros de seguridad para no freír tu Exynos 1580
    const excludeDirs = ['node_modules', '.git', 'sessions', '.npm', 'temp', 'tmp']
    const allowedExts = ['.js', '.json', '.txt', '.md']

    // Función recursiva de escaneo
    async function scanDir(directory) {
      try {
        const files = await fs.readdir(directory, { withFileTypes: true })
        for (const file of files) {
          const fullPath = path.join(directory, file.name)
          const relPath = path.relative(rootDir, fullPath)

          if (file.isDirectory()) {
            // Si es carpeta y no está prohibida, entra a buscar
            if (!excludeDirs.includes(file.name)) {
              await scanDir(fullPath)
            }
          } else if (file.isFile()) {
            // Si es archivo, verifica que sea código
            const ext = path.extname(file.name).toLowerCase()
            if (allowedExts.includes(ext)) {
              try {
                const content = await fs.readFile(fullPath, 'utf8')
                if (content.toLowerCase().includes(searchQuery)) {
                  results.push(`┊ ⊳ ${relPath}`)
                }
              } catch (err) {
                // Ignora si un archivo está bloqueado o dañado
              }
            }
          }
        }
      } catch (e) {
         // Ignora errores si no tiene permisos para leer alguna carpeta
      }
    }

    try {
      // Inicia el escaneo
      await scanDir(rootDir)

      if (results.length === 0) {
        await m.react('✖️')
        return m.reply(`╭⋯ 🕵️‍♂️ *BÚSQUEDA FALLIDA* ⋯》\n┊ No encontré "${text}" en ningún archivo.\n┊ ¿Seguro que lo escribiste bien?\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      // Si encuentra en demasiados archivos, lo limitamos para no hacer spam en WhatsApp
      const maxResults = 30
      let resultText = results.slice(0, maxResults).join('\n')
      if (results.length > maxResults) {
        resultText += `\n┊ ... y ${results.length - maxResults} archivos más.`
      }

      // Interfaz final
      const caption = `╭⋯ 🔎 *ESCÁNER DE CÓDIGO* ⋯》\n┊ ⊳ *Término:* "${text}"\n┊ ⊳ *Archivos encontrados:* ${results.length}\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n${resultText}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en buscar.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *ERROR CRÍTICO* ⋯》\n┊ El sistema de archivos colapsó durante la búsqueda.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
