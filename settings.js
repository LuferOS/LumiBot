import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

process.env.FORCE_BOT_TMPDIR = 'true'

// Seguridad Máxima: Solo LuferOS
// Seguridad Máxima: LuferOS - Inmunidad Total
global.owner = [
  ['573118353868', 'LuferOS 👑', true],
  ['573118353868'] // Doble verificación por si el handler es simple
]

global.botNumber = '573118353868' // Inyecta tu número aquí también como respaldo
global.sessionName = 'Sessions/Owner'
global.version = '^1.2 - LumiBOT Edition'


global.autoSessionCleanup = {
  enabled: true,
  intervalMs: 30 * 60 * 1000,
}

global.dev = "© Powered by LuferOS Security"

global.links = {
  api: 'https://rest.alyabotpe.xyz',
  channel: "https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G",
  github: "https://github.com/LuferOS",
  gmail: "nekranmegared@gmail.com"
}

// Variables y metadatos base de LumiBot
global.lumi = {
  contextInfo: {
    externalAdReply: {
      title: "LumiBOT",
      body: global.dev,
      mediaUrl: null,
      description: null,
      previewType: "PHOTO",
      thumbnailUrl: global.banner || 'https://i.imgur.com/8Q9N49Q.jpeg', // Logo 💅
      sourceUrl: global.links?.channel || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}

// Mensajes del sistema con estética LumiBOT Diva
global.mess = {
  socket: '╭⋯ ❌ *AY POR FAVOR* ⋯》\n┊ Este comando es solo para mis Sockets, no para mortales.',
  admin: '╭⋯ ❌ *QUÉ ATREVIDO* ⋯》\n┊ Comando exclusivo para Administradores del Grupo. Ni lo intentes.',
  botAdmin: '╭⋯ ❌ *O SEA, HELLO* ⋯》\n┊ Necesito ser Administradora del Grupo para hacer eso, date cuenta.'
}

// Intactas, bajo tus órdenes directas.
global.APIs = {
  adonix: { url: "https://api-adonix.ultraplus.click", key: "Yuki-WaBot" },
  vreden: { url: "https://api.vreden.web.id", key: null },
  nekolabs: { url: "https://api.nekolabs.web.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
  stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot" },
  apifaa: { url: "https://api-faa.my.id", key: null },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
