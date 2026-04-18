import fs from 'fs'
import path from 'path'
import { ensureWaifuPvp } from '../../lib/gacha/waifuPvp.js'

const dbPath = path.join(process.cwd(), 'src', 'database')
const databaseFilePath = path.join(dbPath, 'waifudatabase.json')

function loadDatabase() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true })
    }
    if (!fs.existsSync(databaseFilePath)) {
      const data = { users: {} }
      fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2))
      return data
    }
    return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'))
  } catch (error) {
    console.error('Error DB:', error)
    return { users: {} }
  }
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error saving:', error)
    return false
  }
}

let handler = async (client, m) => {
  const userId = m.sender
  let userName = 'Usuario'

  try {
    userName = (await client.getName(userId)) || 'Usuario'
  } catch {}

  if (!global.db.data) global.db.data = {}
  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
  const user = global.db.data.users[userId]
  if (!user.waifu) user.waifu = { characters: [], pending: null, cooldown: 0 }
  if (!Array.isArray(user.waifu.characters)) user.waifu.characters = []

  try {
    let currentWaifu = user.waifu.pending

    if (!currentWaifu && global.db?.waifu?.waifus?.[userId]) {
      currentWaifu = global.db.waifu.waifus[userId]
      user.waifu.pending = currentWaifu
      try {
        delete global.db.waifu.waifus[userId]
      } catch {}
    }

    if (!currentWaifu || !currentWaifu.name) {
      return m.reply('💙 No se encontró personaje válido para guardar.')
    }

    // Asegura PVP para personajes viejos o pendientes sin stats.
    currentWaifu = ensureWaifuPvp(currentWaifu)
    user.waifu.pending = currentWaifu

    if (m.quoted && currentWaifu?.messageId && currentWaifu?.chat) {
      const sameChat = currentWaifu.chat === m.chat
      const quotedId = m.quoted?.id
      if (sameChat && quotedId && quotedId !== currentWaifu.messageId) {
        return m.reply('💙 Responde al mensaje del personaje que obtuviste para poder reclamarlo.')
      }
    }

    const exists = user.waifu.characters.find((char) => char.name === currentWaifu.name && char.rarity === currentWaifu.rarity)

    if (exists) {
      user.waifu.pending = null
      return m.reply(`💙 Ya tienes a *${currentWaifu.name}* (${currentWaifu.rarity}) en tu colección.`)
    }

    user.waifu.characters.push({
      name: currentWaifu.name,
      rarity: currentWaifu.rarity,
      power: currentWaifu.power,
      skill: currentWaifu.skill,
      skillDesc: currentWaifu.skillDesc,
      pvp: currentWaifu.pvp || null,
      obtainedAt: new Date().toISOString(),
      obtainedFrom: 'save',
    })

    user.waifu.pending = null

    try {
      saveDatabase({ users: global.db.data.users })
    } catch (e) {
      console.error('Error saving waifu DB (save):', e)
    }

    const rarityEmojis = {
      comun: '⚪',
      'poco comun': '🟢',
      raro: '🔵',
      epico: '🟣',
      legendario: '🟡',
      mitico: '🔴',
    }

    const emoji = rarityEmojis[String(currentWaifu.rarity || '').toLowerCase()] || '💙'

    let msg = `✅ ¡PERSONAJE GUARDADO! ✅\n\n`
    msg += `${emoji} *${currentWaifu.name}*\n`
    msg += `💎 *${currentWaifu.rarity.toUpperCase()}*\n`
    msg += `👤 ${userName}\n`
    msg += `📊 Total: *${user.waifu.characters.length}* personajes\n\n`
    msg += `🔍 Usa *.col* para ver tu colección`

    return m.reply(msg)
  } catch (error) {
    console.error('Error en save:', error)
    return m.reply(`❌ Error: ${error.message}`)
  }
}

export default {
  command: ['save', 'guardar', 'reclamar'],
  category: 'gacha',
  run: handler,
}

