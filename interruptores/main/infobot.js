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
      const banner = botSettings.banner || global.banner || 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
      const prefijo = botSettings.prefix || '.'
      const owner = botSettings.owner || global.owner?.[0] + '@s.whatsapp.net' || '573118353868@s.whatsapp.net'
      
      const canalId = botSettings.id || '120363169294281316@newsletter'
      const canalName = botSettings.nameid || '💅 LUMIBOT GOSSIP 💅'
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
      const botType = isOficialBot ? 'Reina Suprema' : 'Bebé Clon'
      
      const tituloDesarrollador = desar === 'Hombre' ? 'Creador' : desar === 'Mujer' ? 'Creadora' : 'Creador(a)'
      const ownerDisplay = owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? `@${owner.split('@')[0]}` : owner) : "LuferOS"

      const message = `╭⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
┊ 💅 ✨ *CHISME SOBRE MÍ*
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ ⊳ *Mi nombre ›* ${botname} (${namebot})
┊ ⊳ *Dinero ›* ${monedas}
┊ ⊳ *Mis prefijos ›* ${prefijo === true ? '`Multiprefijo`' : (Array.isArray(prefijo) ? prefijo : [prefijo || '/']).map(p => `\`${p}\``).join(', ')}
┊ ⊳ *Nivel de Diosa ›* ${botType}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ ⚙️ *MI CUERPAZO DIGITAL*
┊ ⊳ *Cuerpo ›* ${platform}
┊ ⊳ *Cerebro ›* NodeJS ${nodeVersion}
┊ ⊳ *Desperté ›* ${formattedUptimeDate}
┊ ⊳ *Despierta por ›* ${sistemaUptime}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 👑 *MI SUGAR DADDY / MOMMY*
┊ ⊳ *${tituloDesarrollador} ›* ${ownerDisplay}
┊ ⊳ *Síguenos ›* ${link}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`.trim()

      let msgPayload = {
        contextInfo: {
          mentionedJid: [owner, m.sender].filter(Boolean)
        }
      }

      if (banner.endsWith('.mp4') || banner.endsWith('.webm')) {
        msgPayload.video = { url: banner }
        msgPayload.gifPlayback = true
        msgPayload.caption = message
      } else {
        msgPayload.image = { url: banner }
        msgPayload.caption = message
      }

      try {
        await client.sendMessage(m.chat, msgPayload, { quoted: m });
      } catch (mediaError) {
        console.error("[LUMIBOT DEBUG] Imgur Rate Limit (429) o error de imagen, enviando texto plano:", mediaError.message);
        await client.sendMessage(m.chat, { text: message, contextInfo: msgPayload.contextInfo }, { quoted: m });
      }
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error crítico en infobot:", e);
      return m.reply(`╭⋯ ❌ *AY POR FAVOR* ⋯》\n┊ Me dio dolor de cabeza recordando quién soy.\n┊ Detox: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
};
