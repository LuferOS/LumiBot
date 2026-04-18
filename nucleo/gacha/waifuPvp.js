export function ensureWaifuPvp(waifu) {
  if (!waifu) return waifu
  if (!waifu.pvp) {
    const basePower = waifu.power || 100
    waifu.pvp = {
      hp: basePower * 10,
      atk: Math.floor(basePower * 0.8),
      def: Math.floor(basePower * 0.6),
      spd: Math.floor(basePower * 0.5),
      crit: 0.1,
      wins: 0,
      losses: 0
    }
  }
  return waifu
}

export function instantiateWaifu(waifu) {
  if (!waifu) return null
  return {
    ...waifu,
    pvp: ensureWaifuPvp(waifu).pvp
  }
}

export function formatPvpLine(waifu) {
  if (!waifu || !waifu.pvp) return ''
  const p = waifu.pvp
  return `HP: ${p.hp} | ATK: ${p.atk} | DEF: ${p.def} | SPD: ${p.spd}`
}

export function simulateWaifuPvpBattle(waifuA, waifuB, options = {}) {
  const { maxTurns = 20, logLimit = 10 } = options
  const log = []
  let a = { ...waifuA.pvp, currentHp: waifuA.pvp.hp }
  let b = { ...waifuB.pvp, currentHp: waifuB.pvp.hp }
  
  for (let turn = 1; turn <= maxTurns; turn++) {
    // A attacks B
    const aDamage = Math.max(1, a.atk - Math.floor(b.def * 0.5))
    const aCrit = Math.random() < a.crit
    const aFinalDamage = aCrit ? aDamage * 2 : aDamage
    b.currentHp -= aFinalDamage
    
    if (log.length < logLimit) {
      log.push(`Turn ${turn}: ${waifuA.name} deals ${aFinalDamage}${aCrit ? ' (CRIT!)' : ''} damage to ${waifuB.name}`)
    }
    
    if (b.currentHp <= 0) {
      if (log.length < logLimit) log.push(`${waifuB.name} fainted!`)
      return { winner: 'A', log, turns: turn }
    }
    
    // B attacks A
    const bDamage = Math.max(1, b.atk - Math.floor(a.def * 0.5))
    const bCrit = Math.random() < b.crit
    const bFinalDamage = bCrit ? bDamage * 2 : bDamage
    a.currentHp -= bFinalDamage
    
    if (log.length < logLimit) {
      log.push(`Turn ${turn}: ${waifuB.name} deals ${bFinalDamage}${bCrit ? ' (CRIT!)' : ''} damage to ${waifuA.name}`)
    }
    
    if (a.currentHp <= 0) {
      if (log.length < logLimit) log.push(`${waifuA.name} fainted!`)
      return { winner: 'B', log, turns: turn }
    }
  }
  
  // Draw if both survive
  return { winner: 'draw', log, turns: maxTurns }
}

export function formatWaifuPvpMessage(battle, options = {}) {
  const { aOwnerTag = 'Player A', bOwnerTag = 'Player B' } = options
  const { winner, log, turns } = battle
  
  let msg = '⚔️ **WAIFU PVP BATTLE** ⚔️\n\n'
  msg += `${aOwnerTag} vs ${bOwnerTag}\n`
  msg += `Turns: ${turns}\n\n`
  
  log.forEach(line => {
    msg += `${line}\n`
  })
  
  if (winner === 'A') {
    msg += `\n🏆 ${aOwnerTag} wins!`
  } else if (winner === 'B') {
    msg += `\n🏆 ${bOwnerTag} wins!`
  } else {
    msg += `\n🤝 It's a draw!`
  }
  
  return msg
}
