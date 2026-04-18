import fs from 'fs'
import path from 'path'
import { ensureWaifuPvp, simulateWaifuPvpBattle, formatWaifuPvpMessage } from '../../nucleo/gacha/waifuPvp.js'

const dbPath = path.join(process.cwd(), 'src', 'database')
const databaseFilePath = path.join(dbPath, 'waifudatabase.json')

function saveWaifuDatabaseFromGlobal() {
  try {
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true })
    const payload = { users: global?.db?.data?.users || {} }
    fs.writeFileSync(databaseFilePath, JSON.stringify(payload, null, 2))
    return true
  } catch {
    return false
  }
}

function getSortedUniqueWaifus(user) {
  if (!user.waifu) user.waifu = { characters: [], pending: null, cooldown: 0 }
  if (!Array.isArray(user.waifu.characters)) user.waifu.characters = []

  const collection = user.waifu.characters

  const unique = []
  const seen = new Set()
  for (const w of collection) {
    if (!w?.name || !w?.rarity) continue
    const key = `${String(w.name).toLowerCase()}_${String(w.rarity).toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(w)
  }

  const rarityOrder = { legendaria: 0, 'ultra rara': 1, 'épica': 2, rara: 3, 'común': 4 }
  unique.sort((a, b) => {
    const ra = String(a.rarity || '').toLowerCase()
    const rb = String(b.rarity || '').toLowerCase()
    const diff = (rarityOrder[ra] ?? 99) - (rarityOrder[rb] ?? 99)
    if (diff !== 0) return diff
    return String(a.name || '').localeCompare(String(b.name || ''))
  })

  return unique
}

export default {
  command: ['waifupvp', 'pvpwaifu', 'pvpw'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    const userId = m.sender

    if (!global.db?.data?.users) global.db = { data: { users: {} } }
    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    const user = global.db.data.users[userId]

    const now = Date.now()
    user.waifu ||= { characters: [], pending: null, cooldown: 0 }
    if (user.waifu.pvpCooldown && now - user.waifu.pvpCooldown < 15000) {
      const left = Math.ceil((15000 - (now - user.waifu.pvpCooldown)) / 1000)
      return m.reply(`⏰ Espera ${left}s para usar PVP de nuevo.`)
    }

    const nums = (args || [])
      .map((x) => String(x).trim())
      .filter((x) => /^\d+$/.test(x))
      .map((x) => Number(x))

    if (nums.length < 2) {
      const help = [
        `💙⚔️ *WAIFU PVP* ⚔️💙`,
        ``,
        `Uso:`,
        `• *${usedPrefix + command}* <mi#> @usuario <su#>`,
        `• *${usedPrefix + command}* <mi#> <su#> (auto-batalla)`,
        ``,
        `Tip: mira tu lista con *${usedPrefix}col* y usa el # de la waifu (ej: #01, #02, #03...).`,
      ].join('\n')
      return m.reply(help)
    }

    const myIndex = nums[0]
    const theirIndex = nums[1]

    const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
    const opponentId = mentioned[0] || (m.quoted ? m.quoted.sender : userId)

    if (!global.db.data.users[opponentId]) global.db.data.users[opponentId] = {}
    const oppUser = global.db.data.users[opponentId]

    const myList = getSortedUniqueWaifus(user)
    const oppList = opponentId === userId ? myList : getSortedUniqueWaifus(oppUser)

    if (myList.length === 0) return m.reply(`📝 Tu colección está vacía. Usa *${usedPrefix}rw* para obtener personajes.`)
    if (oppList.length === 0) return m.reply(`📝 El oponente no tiene waifus. (Que use *${usedPrefix}rw*)`)

    if (myIndex < 1 || myIndex > myList.length) {
      return m.reply(`❌ Tu número es inválido. Tienes *${myList.length}* waifus únicas.`)
    }
    if (theirIndex < 1 || theirIndex > oppList.length) {
      return m.reply(`❌ El número del oponente es inválido. Tiene *${oppList.length}* waifus únicas.`)
    }

    let myWaifu = myList[myIndex - 1]
    let theirWaifu = oppList[theirIndex - 1]

    
    const myBefore = !!myWaifu.pvp
    const theirBefore = !!theirWaifu.pvp
    myWaifu = ensureWaifuPvp(myWaifu)
    theirWaifu = ensureWaifuPvp(theirWaifu)

    if (!myBefore) myList[myIndex - 1].pvp = myWaifu.pvp
    if (!theirBefore) oppList[theirIndex - 1].pvp = theirWaifu.pvp

    if (!myBefore || !theirBefore) {
     
      saveWaifuDatabaseFromGlobal()
    }

    const battle = simulateWaifuPvpBattle(myWaifu, theirWaifu, { maxTurns: 26, logLimit: 14 })

    const msg = formatWaifuPvpMessage(battle, {
      aOwnerTag: String(userId).split('@')[0],
      bOwnerTag: String(opponentId).split('@')[0],
    })

    user.waifu.pvpCooldown = now
    return client.reply(m.chat, msg, m, { mentions: [userId, opponentId] })
  },
}
