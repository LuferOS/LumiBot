import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⚡ LUMIBOT OVERRIDE: Escáner de modificaciones locales
async function reloadCommandsAndGetChanges(dir = path.join(__dirname, '..')) {
  const commandsMap = new Map()
  const changedFiles = []
  const now = Date.now()
  const timeLimit = 24 * 60 * 60 * 1000 // Escanea cambios de las últimas 24 horas

  async function readCommands(folder) {
    if (!fs.existsSync(folder)) return
    const files = fs.readdirSync(folder)
    
    for (const file of files) {
      const fullPath = path.join(folder, file)
      
      if (fs.lstatSync(fullPath).isDirectory()) {
        await readCommands(fullPath)
      } else if (file.endsWith('.js')) {
        try {
          // Detectamos si el archivo fue modificado recientemente
          const stat = fs.statSync(fullPath)
          if (now - stat.mtimeMs < timeLimit) {
            changedFiles.push(file)
          }

          // Fuerza la recarga en la caché de Node.js
          const { default: cmd } = await import(fullPath + '?update=' + Date.now()) 
          if (cmd?.command) {
            const cmds = Array.isArray(cmd.command) ? cmd.command : [cmd.command]
            cmds.forEach((c) => {
              if (c) commandsMap.set(c.toLowerCase(), cmd)
            })
          }
        } catch (err) {
          console.error(`[LUMIBOT DEBUG] Error recargando comando ${file}:`, err)
        }
      }
    }
  }
  
  await readCommands(dir)
  global.comandos = commandsMap
  return changedFiles
}

export default {
  command: ['fix', 'update', 'actualizar', 'hotreload'],
  isOwner: true,
  run: async (client, m, args) => {
    try {
      await m.react('🕒')

      // ⚡ LUMIBOT OVERRIDE: Inicializamos el versionado en la DB si no existe
      global.db.data = global.db.data || {}
      global.db.data.botVersion = global.db.data.botVersion || 'V1.0.0.A'

      // Si el comandante pasa una versión válida por parámetro, la actualizamos
      const versionRegex = /^V\d+\.\d+\.\d+\.[ABC]$/i
      if (args[0] && versionRegex.test(args[0])) {
        global.db.data.botVersion = args[0].toUpperCase()
      } else if (args[0]) {
        await m.react('✖️')
        return m.reply(`╭⋯ ❌ *SINTAXIS DE VERSIÓN INVÁLIDA* ⋯》\n┊ Formato requerido: V[Mayor].[Menor].[Correcciones].[A/B/C]\n┊ Ejemplo: *V1.2.34.A*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      // Recargamos archivos y obtenemos el reporte local
      const changedFiles = await reloadCommandsAndGetChanges(path.join(__dirname, '..'))

      // Decodificamos la nomenclatura de Queen
      const versionLetra = global.db.data.botVersion.split('.').pop()
      let tipoRama = 'Desconocido'
      if (versionLetra === 'A') tipoRama = 'Actualización Grande'
      if (versionLetra === 'B') tipoRama = 'Actualización Beta'
      if (versionLetra === 'C') tipoRama = 'Actualización Experimental'

      const logFiles = changedFiles.length > 0 
        ? changedFiles.map(f => `┊ ⊳ ${f}`).join('\n') 
        : '┊ ⊳ Ninguna modificación reciente (últimas 24h)'

      const msg = `╭⋯ 🚀 *RECARGA DE DIVA LOCAL* ⋯》\n┊ ⊳ *Estado:* Módulos sincronizados en memoria.\n┊ ⊳ *Versión del Núcleo:* ${global.db.data.botVersion}\n┊ ⊳ *Despliegue:* ${tipoRama}\n┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┊ 📝 *Archivos alterados recientemente:*\n${logFiles}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

      await client.sendMessage(m.chat, { text: msg }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en el hot-reload local:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *ERROR CRÍTICO* ⋯》\n┊ Fallo en la reestructuración de la memoria caché.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
