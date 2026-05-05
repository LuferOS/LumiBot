import os from 'os';

function rTime(seconds) {
  seconds = Number(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const dDisplay = d > 0 ? d + (d === 1 ? " día, " : " días, ") : ""
  const hDisplay = h > 0 ? h + (h === 1 ? " hora, " : " horas, ") : ""
  const mDisplay = m > 0 ? m + (m === 1 ? " minuto, " : " minutos, ") : ""
  const sDisplay = s > 0 ? s + (s === 1 ? " segundo" : " segundos") : ""
  return dDisplay + hDisplay + mDisplay + sDisplay
}

export default {
  command: ['infobot', 'infosocket', 'botinfo'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {}
      const botId = client.user?.id?.split(':')[0] + "@s.whatsapp.net"
      const botSettings = db.settings?.[botId] || {}
      
      const botname = botSettings.botname || 'LumiBOT'
      const namebot = botSettings.namebot || 'Lumi'
      const monedas = botSettings.currency || 'Créditos'
      const banner = botSettings.banner || global.banner || 'https://i.imgur.com/8Q9N49Q.jpeg'
      const prefijo = botSettings.prefix || '.'
      const owner = botSettings.owner || global.owner?.[0] + '@s.whatsapp.net' || '573118353868@s.whatsapp.net'
      
      const canalId = botSettings.id || '120363169294281316@newsletter'
      const canalName = botSettings.nameid || '🛡️ LUMIBOT SECURITY 🛡️'
      const link = botSettings.link || global.links?.github || 'https://github.com/LuferOS'

      let desar = 'Oculto'
      if (owner && !isNaN(owner.replace(/@s\.whatsapp\.net$/, ''))) {
        const userData = db.users?.[owner]
        desar = userData?.genre || 'Oculto'
      }

      const platform = os.type()
      const now = new Date()
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
      const nodeVersion = process.version
      const sistemaUptime = rTime(os.uptime())
      const uptime = process.uptime()
      const uptimeDate = new Date(colombianTime.getTime() - uptime * 1000)
      const formattedUptimeDate = uptimeDate.toLocaleString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).replace(/^./, str => str.toUpperCase())

      const isOficialBot = botId === (global.client?.user?.id?.split(':')[0] + "@s.whatsapp.net")
      const botType = isOficialBot ? 'Núcleo Principal' : 'Sub-Nodo'
      
      const tituloDesarrollador = desar === 'Hombre' ? 'Creador' : desar === 'Mujer' ? 'Creadora' : 'Creador(a)'
      const ownerDisplay = owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? `@${owner.split('@')[0]}` : owner) : "LuferOS"

      const message = `╭⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
┊ 🤖 *DATOS DEL SISTEMA*
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ ⊳ *Identidad ›* ${botname} (${namebot})
┊ ⊳ *Divisa ›* ${monedas}
┊ ⊳ *Prefijo(s) ›* ${prefijo === true ? '`Multiprefijo`' : (Array.isArray(prefijo) ? prefijo : [prefijo || '/']).map(p => `\`${p}\``).join(', ')}
┊ ⊳ *Clasificación ›* ${botType}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ ⚙️ *HARDWARE & SOFTWARE*
┊ ⊳ *SO Base ›* ${platform}
┊ ⊳ *Entorno ›* NodeJS ${nodeVersion}
┊ ⊳ *Inicio Sistema ›* ${formattedUptimeDate}
┊ ⊳ *Tiempo Activo ›* ${sistemaUptime}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 👑 *PROPIEDAD*
┊ ⊳ *${tituloDesarrollador} ›* ${ownerDisplay}
┊ ⊳ *Enlace ›* ${link}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`.trim()

      let msgPayload = {
        contextInfo: {
          mentionedJid: [owner, m.sender].filter(Boolean),
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalId,
            serverMessageId: 0, // Se recomienda numérico para Baileys
            newsletterName: canalName
          }
        }
      }

      if (banner.endsWith('.mp4') || banner.endsWith('.webm')) {
        msgPayload.video = { url: banner }
        msgPayload.gifPlayback = true
        msgPayload.caption = message
      } else {
        msgPayload.text = message
        msgPayload.contextInfo.externalAdReply = {
          title: botname,
          body: `© Powered by LuferOS Security`,
          showAdAttribution: false,
          thumbnailUrl: banner,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          sourceUrl: link
        }
      }

      await client.sendMessage(m.chat, msgPayload, { quoted: m });
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en infobot:", e);
      return m.reply(`╭⋯ ❌ *LUMIBOT - ERROR* ⋯》\n┊ Fallo al recuperar la información del sistema.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
};
