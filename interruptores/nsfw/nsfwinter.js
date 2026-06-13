import fetch from 'node-fetch';
import { resolveLidToRealJid } from "../../nucleo/utils.js"

const _0xanimeKey = 'api-lYsN6';

const captions = {
  spank: (from, to) => from === to ? 'se dio una nalgada a sí mismo.' : 'le dio una buena nalgada a',
  undress: (from, to) => from === to ? 'se empezó a desvestir lentamente.' : 'está desvistiendo a',
  yuri: (from, to) => from === to ? 'está fantaseando (yuri).' : 'está haciendo tijeras con',
  sixnine: (from, to) => from === to ? 'está pensando en hacer un 69.' : 'está haciendo un 69 con',
  anal: (from, to) => from === to ? 'se metió un dedo.' : 'le está dando por detrás a',
  fuck: (from, to) => from === to ? 'se está masturbando salvajemente.' : 'se está follando a',
  cummouth: (from, to) => from === to ? 'se corrió en su propia boca.' : 'se corrió en la boca de',
  suckboobs: (from, to) => from === to ? 'se está manoseando sus propios pechos.' : 'le está chupando los pechos a',
  cumshot: (from, to) => from === to ? 'se corrió a todos lados.' : 'le hizo un cumshot a',
  lickpussy: (from, to) => from === to ? 'se está masturbando la vagina.' : 'le está lamiendo la vagina a',
  lickdick: (from, to) => from === to ? 'se lamió su propio miembro.' : 'le está chupando la verga a',
  lickass: (from, to) => from === to ? 'se olió el dedo después de pasarlo por ahí.' : 'le está lamiendo el culo a',
  handjob: (from, to) => from === to ? 'se está haciendo una paja.' : 'le está haciendo una paja a',
  grope: (from, to) => from === to ? 'se está manoseando rico.' : 'está manoseando a',
  cum: (from, to) => from === to ? 'se corrió riquísimo.' : 'se corrió junto a',
  fingering: (from, to) => from === to ? 'se está metiendo los dedos.' : 'le está metiendo los dedos a',
  creampie: (from, to) => from === to ? 'se auto-creampie.' : 'dejó llenita/o (creampie) a',
  facesitting: (from, to) => from === to ? 'se sentó en una silla.' : 'se le sentó en la cara a',
  futanari: (from, to) => from === to ? 'sacó su sorpresa futa.' : 'le está dando durísimo (futa) a',
  pegging: (from, to) => from === to ? 'se puso un cinturón.' : 'le está dando por atrás (pegging) a',
  bondage: (from, to) => from === to ? 'se amarró a sí mismo.' : 'amarró y dominó a',
  deepthroat: (from, to) => from === to ? 'se atoró con su propia saliva.' : 'le está haciendo garganta profunda a',
  thighjob: (from, to) => from === to ? 'se frota los muslos.' : 'le está haciendo una paja rusa a',
  yaoi: (from, to) => from === to ? 'está fantaseando yaoi.' : 'le está dando (yaoi) a',
  bukkake: (from, to) => from === to ? 'se imagina un bukkake.' : 'inició un bukkake contra',
  orgy: (from, to) => from === to ? 'quiere una orgía.' : 'armó una orgía con',
  grabboobs: (from, to) => from === to ? 'se apretó los pechos.' : 'le agarró los pechos a',
  blowjob: (from, to) => from === to ? 'se intentó mamar a sí mismo.' : 'le está haciendo una buena mamada a',
  boobjob: (from, to) => from === to ? 'se frotó sus propios pechos.' : 'le hace una paja con los pechos (rusa) a',
  fap: (from, to) => from === to ? 'se está haciendo tremenda paja.' : 'se está pajeando pensando en',
  footjob: (from, to) => from === to ? 'se soba los pies.' : 'le está haciendo una paja con los pies a',
  squirting: (from, to) => from === to ? 'se vino a chorros (squirt).' : 'hizo que le saliera a chorros a',
}

const symbols = ['🔞', '🥵', '🔥', '💦', '😈', '👅', '🍆', '🍑', '🥵💦', '🔥🍆']
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const alias = {
  spank: ['spank', 'nalgada', 'azotar'],
  undress: ['undress', 'desvestir', 'quitarropa'],
  yuri: ['yuri', 'tijeras'],
  sixnine: ['sixnine', '69'],
  anal: ['anal'],
  fuck: ['fuck', 'follar', 'coger'],
  cummouth: ['cummouth', 'correrboca'],
  suckboobs: ['suckboobs', 'chuparpechos', 'chupartetas'],
  cumshot: ['cumshot'],
  lickpussy: ['lickpussy', 'lamervagina', 'comer'],
  lickdick: ['lickdick', 'chupar', 'mamar'],
  lickass: ['lickass', 'lamerculo', 'comerculo'],
  handjob: ['handjob', 'paja', 'pajear'],
  grope: ['grope', 'manosear', 'tocar'],
  cum: ['cum', 'correrse', 'venirse'],
  fingering: ['fingering', 'dedos', 'meterdedos'],
  creampie: ['creampie', 'rellenar'],
  facesitting: ['facesitting', 'sentarsecara'],
  futanari: ['futanari', 'futa'],
  pegging: ['pegging'],
  bondage: ['bondage', 'amarrar', 'atar'],
  deepthroat: ['deepthroat', 'gargantaprofunda'],
  thighjob: ['thighjob', 'rusamuslos'],
  yaoi: ['yaoi'],
  bukkake: ['bukkake'],
  orgy: ['orgy', 'orgia', 'fiesta'],
  grabboobs: ['grabboobs', 'agarrarpechos'],
  blowjob: ['blowjob', 'mamada'],
  boobjob: ['boobjob', 'rusa', 'pajapechos'],
  fap: ['fap', 'masturbarse'],
  footjob: ['footjob', 'pajapies'],
  squirting: ['squirting', 'squirt', 'chorrear'],
};

export default {
  command: [
    'spank', 'nalgada', 'azotar', 'undress', 'desvestir', 'quitarropa', 'yuri', 'tijeras', 'sixnine', '69', 'anal', 'fuck', 'follar', 'coger', 'cummouth', 'correrboca', 'suckboobs', 'chuparpechos', 'chupartetas', 'cumshot', 'lickpussy', 'lamervagina', 'comer', 'lickdick', 'chupar', 'mamar', 'lickass', 'lamerculo', 'comerculo', 'handjob', 'paja', 'pajear', 'grope', 'manosear', 'tocar', 'cum', 'correrse', 'venirse', 'fingering', 'dedos', 'meterdedos', 'creampie', 'rellenar', 'facesitting', 'sentarsecara', 'futanari', 'futa', 'pegging', 'bondage', 'amarrar', 'atar', 'deepthroat', 'gargantaprofunda', 'thighjob', 'rusamuslos', 'yaoi', 'bukkake', 'orgy', 'orgia', 'fiesta', 'grabboobs', 'agarrarpechos', 'blowjob', 'mamada', 'boobjob', 'rusa', 'pajapechos', 'fap', 'masturbarse', 'footjob', 'pajapies', 'squirting', 'squirt', 'chorrear'
  ],
  category: 'nsfw',
  nsfw: true,
  run: async (client, m, args, usedPrefix, command) => {
    const currentCommand = Object.keys(alias).find(key => alias[key].includes(command)) || command
    if (!captions[currentCommand]) return
    let mentionedJid = m.mentionedJid
    let who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)
    const fromName = global.db.data.users[m.sender]?.name || '@'+m.sender.split('@')[0]
    const toName = global.db.data.users[who]?.name || '@'+who.split('@')[0]
    const captionText = captions[currentCommand](fromName, toName)
    const caption = who !== m.sender ? `\`${fromName}.\` ${captionText} \`${toName}.\` ${getRandomSymbol()}` : `\`${fromName}\` ${captionText} ${getRandomSymbol()}`
    
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`https://api.alyacore.xyz/nsfw/interaction?inter=${currentCommand}&key=${_0xanimeKey}`, { signal: controller.signal })
      const json = await response.json()
      clearTimeout(timeout)
      const videoUrl = json?.result
      if (!videoUrl) {
        throw new Error('API muerta o sin videoUrl');
      }
      await client.sendMessage(m.chat, { video: { url: videoUrl }, gifPlayback: true, caption, mentions: [who, m.sender] }, { quoted: m });
    } catch (e) {
      await client.sendMessage(m.chat, { text: caption + '\n\n> 🔞 (Error al cargar el video, pero imagina la escena).', mentions: [who, m.sender] }, { quoted: m });
    }
  },
};
