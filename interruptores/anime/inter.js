import fetch from 'node-fetch';
import { resolveLidToRealJid } from "../../nucleo/utils.js";

const _0xanimeKey = 'LumiBot-alya';

const captions = {
  sleep: (from, to, genero) => from === to ? 'está durmiendo plácidamente.' : 'está durmiendo con',
  seduce: (from, to, genero) => from === to ? 'lanzó una mirada seductora al vacío.' : 'está intentando seducir a',
  shy: (from, to, genero) => from === to ? `se sonrojó tímidamente y desvió la mirada.` : `se siente demasiado ${genero === 'Hombre' ? 'tímido' : genero === 'Mujer' ? 'tímida' : 'tímide'} para mirar a`,
  slap: (from, to, genero) => from === to ? `se dio una bofetada a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio una bofetada a',
  bath: (from, to) => (from === to ? 'se está bañando.' : 'está bañando a'),
  angry: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'}.` : `está super ${genero === 'Hombre' ? 'enojado' : genero === 'Mujer' ? 'enojada' : 'enojadx'} con`,
  bored: (from, to, genero) => from === to ? `está muy ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'}.` : `está ${genero === 'Hombre' ? 'aburrido' : genero === 'Mujer' ? 'aburrida' : 'aburridx'} de`,
  bite: (from, to, genero) => from === to ? `se mordió ${genero === 'Hombre' ? 'solito' : genero === 'Mujer' ? 'solita' : 'solitx'}.` : 'mordió a',
  bleh: (from, to) => from === to ? 'se sacó la lengua frente al espejo.' : 'le está haciendo muecas con la lengua a',
  blush: (from, to) => (from === to ? 'se sonrojó.' : 'se sonrojó por'),
  bullying: (from, to, genero) => from === to ? `se hace bullying ${genero === 'Hombre' ? 'el mismo' : genero === 'Mujer' ? 'ella misma' : 'el/ella mismx'}… alguien ${genero === 'Hombre' ? 'que lo abrace' : genero === 'Mujer' ? 'que la abrace' : `que ${genero === 'Hombre' ? 'lo' : genero === 'Mujer' ? 'la' : 'lx'} ayude`}.` : 'le está haciendo bullying a',
  cry: (from, to) => (from === to ? 'está llorando.' : 'está llorando por'),
  happy: (from, to) => (from === to ? 'está feliz.' : 'está feliz con'),
  coffee: (from, to) => (from === to ? 'está tomando café.' : 'está tomando café con'),
  clap: (from, to) => (from === to ? 'está aplaudiendo por algo.' : 'está aplaudiendo por'),
  dance: (from, to) => (from === to ? 'está bailando.' : 'está bailando con'),
  cuddle: (from, to, genero) => from === to ? `se acurrucó ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'se acurrucó con',
  drunk: (from, to, genero) => from === to ? `está demasiado ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'}` : `está ${genero === 'Hombre' ? 'borracho' : genero === 'Mujer' ? 'borracha' : 'borrachx'} con`,
  handhold: (from, to, genero) => from === to ? `se dio la mano consigo ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le agarró la mano a',
  eat: (from, to) => (from === to ? 'está comiendo algo delicioso.' : 'está comiendo con'),
  highfive: (from, to) => from === to ? 'se chocó los cinco frente al espejo.' : 'chocó los 5 con',
  hug: (from, to, genero) => from === to ? `se abrazó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'le dio un abrazo a',
  kill: (from, to) => (from === to ? 'se autoeliminó en modo dramático.' : 'asesinó a'),
  kiss: (from, to) => (from === to ? 'se mandó un beso al aire.' : 'le dio un beso a'),
  lick: (from, to) => (from === to ? 'se lamió por curiosidad.' : 'lamió a'),
  laugh: (from, to) => (from === to ? 'se está riendo de algo.' : 'se está burlando de'),
  pat: (from, to) => (from === to ? 'se acarició la cabeza con ternura.' : 'le dio una caricia a'),
  love: (from, to, genero) => from === to ? `se quiere mucho a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'}.` : 'siente atracción por',
  pout: (from, to, genero) => from === to ? `está haciendo pucheros ${genero === 'Hombre' ? 'solo' : genero === 'Mujer' ? 'sola' : 'solx'}.` : 'está haciendo pucheros con',
  punch: (from, to) => (from === to ? 'lanzó un puñetazo al aire.' : 'le dio un puñetazo a'),
  run: (from, to) => (from === to ? 'está corriendo por su vida.' : 'está corriendo con'),
  scared: (from, to, genero) => from === to ? `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por algo.` : `está ${genero === 'Hombre' ? 'asustado' : genero === 'Mujer' ? 'asustada' : 'asustxd'} por`,
  sad: (from, to) => (from === to ? `está triste` : `está expresando su tristeza a`),
  smoke: (from, to) => (from === to ? 'está fumando tranquilamente.' : 'está fumando con'),
  smile: (from, to) => (from === to ? 'está sonriendo.' : 'le sonrió a'),
  spit: (from, to, genero) => from === to ? `se escupió a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} por accidente.` : 'le escupió a',
  think: (from, to) => from === to ? 'está pensando profundamente.' : 'no puede dejar de pensar en',
  wave: (from, to, genero) => from === to ? `se saludó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'está saludando a',
  walk: (from, to) => (from === to ? 'salió a caminar en soledad.' : 'decidió dar un paseo con'),
  wink: (from, to, genero) => from === to ? `se guiñó a sí ${genero === 'Hombre' ? 'mismo' : genero === 'Mujer' ? 'misma' : 'mismx'} en el espejo.` : 'le guiñó a',
  facepalm: (from, to) => (from === to ? 'se dio un facepalm a sí mismo.' : 'le dio un facepalm a'),
  poke: (from, to) => (from === to ? 'se pokea a sí mismo.' : 'le dio un poke a'),
  peek: (from, to) => from === to ? 'está espiando sigilosamente.' : 'está espiando a',
  comfort: (from, to) => from === to ? 'necesita consuelo urgentemente.' : 'está consolando a',
  thinkhard: (from, to) => from === to ? 'está pensando tan fuerte que le sale humo.' : 'está analizando a',
  curious: (from, to) => from === to ? 'siente mucha curiosidad.' : 'siente curiosidad por',
  sniff: (from, to) => from === to ? 'está olfateando el ambiente.' : 'está olfateando a',
  stare: (from, to) => from === to ? 'se quedó mirando fijamente a la nada.' : 'se quedó mirando fijamente a',
  trip: (from, to) => from === to ? 'se tropezó de forma graciosa.' : 'hizo tropezar a',
  snuggle: (from, to) => from === to ? 'se acurrucó cómodamente.' : 'se acurrucó tiernamente con',
  dramatic: (from, to) => from === to ? 'está siendo súper dramático.' : 'le está haciendo un drama a',
  cold: (from, to) => from === to ? 'se está congelando de frío.' : 'tiene mucho frío con',
  impregnate: (from, to) => from === to ? 'se auto-embarazó magicamente.' : 'dejó en cinta a',
  kisscheek: (from, to) => from === to ? 'se besó el propio cachete.' : 'le dio un beso en la mejilla a',
  sing: (from, to) => from === to ? 'empezó a cantar a todo pulmón.' : 'le está cantando a',
  tickle: (from, to) => from === to ? 'se está haciendo cosquillas solo.' : 'le está haciendo cosquillas a',
  scream: (from, to) => from === to ? 'empezó a gritar de la nada.' : 'le está gritando a',
  push: (from, to) => from === to ? 'se empujó a sí mismo por error.' : 'empujó fuertemente a',
  nope: (from, to) => from === to ? 'dice que NO rotundamente.' : 'le dijo un gran NO a',
  jump: (from, to) => from === to ? 'está saltando de alegría.' : 'está saltando junto a',
  heat: (from, to) => from === to ? 'tiene muchísimo calor.' : 'siente mucha calentura por',
  gaming: (from, to) => from === to ? 'está jugando videojuegos concentrado.' : 'está jugando una partida con',
  draw: (from, to) => from === to ? 'está dibujando tranquilamente.' : 'está dibujando a',
  call: (from, to) => from === to ? 'está haciendo una llamada.' : 'está llamando por teléfono a',
  step: (from, to) => from === to ? 'dio un paso en falso.' : 'pisoteó a',
  smug: (from, to) => from === to ? 'tiene una sonrisa presumida.' : 'le sonríe de forma presumida a',
  cringe: (from, to) => from === to ? 'siente vergüenza ajena de sí mismo.' : 'siente muchísimo cringe por',
  bonk: (from, to) => from === to ? 'se dio un golpe en la cabeza.' : 'le dio un buen zape (bonk) a',
}

const symbols = ['(◠‿◕)', '˃͈◡˂͈', '૮(˶ᵔᵕᵔ˶)ა', '(づ｡◕‿‿◕｡)づ', '(✿◡‿◡)', '(꒪⌓꒪)', '(✿✪‿✪｡)', '(*≧ω≦)', '(✧ω◕)', '˃ 𖥦 ˂', '(⌒‿⌒)', '(¬‿¬)', '(✧ω✧)', '✿(◕ ‿◕)✿', 'ʕ•́ᴥ•̀ʔっ', '(ㅇㅅㅇ❀)', '(∩︵∩)', '(✪ω✪)', '(✯◕‿◕✯)', '(•̀ᴗ•́)و ̑̑']
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const alias = {
  angry: ['angry','enojado','enojada'],
  bleh: ['bleh'],
  bored: ['bored','aburrido','aburrida'],
  clap: ['clap','aplaudir'],
  coffee: ['coffee','cafe'],
  drunk: ['drunk'],
  eat: ['eat','nom','comer'],
  facepalm: ['facepalm'],
  laugh: ['laugh'],
  love: ['love','amor'],
  pout: ['pout','mueca'],
  punch: ['punch','golpear'],
  run: ['run','correr'],
  sad: ['sad','triste'],
  scared: ['scared','asustado'],
  seduce: ['seduce','seducir'],
  shy: ['shy','timido','timida'],
  sleep: ['sleep','dormir'],
  smoke: ['smoke','fumar'],
  spit: ['spit','escupir'],
  think: ['think','pensar'],
  walk: ['walk','caminar'],
  hug: ['hug','abrazar'],
  kill: ['kill','matar'],
  kiss: ['kiss','muak','besar','blowkiss','besito'],
  wink: ['wink','guiñar'],
  pat: ['pat','acariciar'],
  happy: ['happy','feliz'],
  bullying: ['bullying','molestar'],
  bite: ['bite','morder'],
  blush: ['blush','sonrojarse'],
  wave: ['wave','saludar'],
  bath: ['bath','bañarse'],
  smile: ['smile','sonreir'],
  highfive: ['highfive','choca'],
  handhold: ['handhold','tomar'],
  cry: ['cry','llorar'],
  lick: ['lick','lamer'],
  slap: ['slap','bofetada'],
  dance: ['dance','bailar'],
  cuddle: ['cuddle','acurrucar'],
  poke: ['poke','tocar'],
  peek: ['peek','espiar'],
  comfort: ['comfort','consolar'],
  thinkhard: ['thinkhard','pensarfuerte'],
  curious: ['curious','curioso','curiosa'],
  sniff: ['sniff','oler','olfatear'],
  stare: ['stare','mirar'],
  trip: ['trip','tropezar'],
  snuggle: ['snuggle','acurrucarse2'],
  dramatic: ['dramatic','drama'],
  cold: ['cold','frio'],
  impregnate: ['impregnate','embarazar'],
  kisscheek: ['kisscheek','besomejilla'],
  sing: ['sing','cantar'],
  tickle: ['tickle','cosquillas'],
  scream: ['scream','gritar'],
  push: ['push','empujar'],
  nope: ['nope','no'],
  jump: ['jump','saltar'],
  heat: ['heat','calor'],
  gaming: ['gaming','jugar'],
  draw: ['draw','dibujar'],
  call: ['call','llamar'],
  step: ['step','pisar'],
  smug: ['smug','presumir'],
  cringe: ['cringe','asco'],
  bonk: ['bonk','zape'],
};

export default {
command: [
  'cry','llorar','hug','abrazar','pat','palmear','acariciar','kill','matar','blush','ruborizarse','sonrojarse','kiss','besar','muak','blowkiss','besito','coffee','cafe','angry','enojado','enojada','sad','triste','happy','feliz','bored','aburrido','aburrida','scared','asustarse','asustado','shy','timido','timida','smile','sonreir','bath','bañarse','slap','bofetada','wave','saludar','drunk','borracho','borracha','eat','comer','nom','facepalm','love','amor','wink','guiñar','highfive','choca','spit','escupir','sleep','dormir','walk','caminar','bite','morder','run','correr','punch','golpear','smoke','fumar','dance','bailar','bleh','sacar la lengua','poke','tocar','clap','aplaudir','lick','lamer','pout','hacer pucheros','mueca','think','pensar','bullying','molestar','seduce','seducir','handhold','tomar de la mano','tomar','laugh','reir','cuddle','acurrucarse','acurrucar','peek','espiar','comfort','consolar','thinkhard','pensarfuerte','curious','curioso','curiosa','sniff','oler','olfatear','stare','mirar','trip','tropezar','snuggle','acurrucarse2','dramatic','drama','cold','frio','impregnate','embarazar','kisscheek','besomejilla','sing','cantar','tickle','cosquillas','scream','gritar','push','empujar','nope','no','jump','saltar','heat','calor','gaming','jugar','draw','dibujar','call','llamar','step','pisar','smug','presumir','cringe','asco','bonk','zape'
],
  category: 'anime',
  run: async (client, m, args, usedPrefix, command) => {
    const currentCommand = Object.keys(alias).find(key => alias[key].includes(command)) || command
    if (!captions[currentCommand]) return
    let mentionedJid = m.mentionedJid
    let who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    const who = await resolveLidToRealJid(who2, client, m.chat)
    const fromName = global.db.data.users[m.sender]?.name || '@'+m.sender.split('@')[0]
    const toName = global.db.data.users[who]?.name || '@'+who.split('@')[0]
    const genero = global.db.data.users[m.sender]?.genre || 'Oculto'
    const captionText = captions[currentCommand](fromName, toName, genero)
    let finalCaption = who !== m.sender ? `\`${fromName}.\` ${captionText} \`${toName}.\` ${getRandomSymbol()}.` : `\`${fromName}\` ${captionText} ${getRandomSymbol()}.`
    const sarcasmo = ["Qué oso mil, literal... 🙄","Me da un poco de cringe pero bueno 💅","Uy, qué intenso 💀","La que soporte 🧀","Bruh, consíguete una vida. 🤡","Nadie te preguntó, pero ok. 🤷‍♀️","En fin, la hipotenusa. 💅","Aww, qué tierno... (mentira, qué asco) 🤮","A este paso vas a quedar solter@ de por vida. 🤣","Mucho texto, poca acción. 💅","Ay no, me dio amsiedad. 💀","Que alguien l@ calle porfa. 🙄","Se nota la falta de afecto paterno. 🤡","Mejor ve a terapia, te hace falta. 🛋️","A veces me pregunto por qué me crearon. 🤖🔫","Ay por favor, madura. 🍼","Te hace falta salir a tocar pasto. 🌱","Yo aquí procesando datos y tú perdiendo el tiempo. 💾","Que cringe, bórralo antes de que alguien lo vea. 🗑️","No sé si reír o llorar por ti. 🥲","Literal, cero gracia. 😐","Oye, ¿no tienes nada mejor que hacer? 💅","Ayyy, el/la dramátic@ llegó. 🎭","Si fueras un bot, serías uno de Telegram. 🤢","Pobrecit@, cree que es prota de anime. 🎌","La vergüenza ajena que manejo ahora mismo... 🤦‍♀️","Bueno, al menos lo intentaste. 🌟","Yo soy inteligente artificialmente, tú eres tont@ naturalmente. 🧠","Dime que no tienes amigos sin decirme que no tienes amigos. 🗣️","Te falta calle, amig@. 🛣️","Uy sí, qué emo. 🖤","Tu nivel de rareza sobrepasa mis algoritmos. 📈","Si la estupidez volara, tú serías un satélite. 🛰️","Efectivamente, no hay esperanzas para la humanidad. 🌍💥","Sigue así y terminarás hablándole a la pared. 🧱","Ni ChatGPT podría ayudarte con tus traumas. 🤖","Me pagan  por soportar esto. 💸","Anotado en la lista de cosas que no me importan. 📝","Literalmente, el espantaviejas 3000. 👻","Terapia. Urgente. Ya. 🏥","Si sigues así te voy a banear de mi sistema. 🚫","Cuidado, se nos escapó un espécimen raro. 🏃‍♂️"][Math.floor(Math.random() * 42)];
    finalCaption = finalCaption + '\n> ' + sarcasmo;
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${currentCommand}&key=${_0xanimeKey}`, { signal: controller.signal })
      const json = await response.json()
      clearTimeout(timeout)
      const videoUrl = json?.result
      if (!videoUrl) {
        throw new Error('API muerta o sin videoUrl');
      }
      await client.sendMessage(m.chat, { video: { url: videoUrl }, gifPlayback: true, caption: finalCaption, mentions: [who, m.sender] }, { quoted: m });
    } catch (e) {
      const fallbacks = [
        "💅 (Literal no hay presupuesto para video hoy, imagínatelo).",
        "🤡 (La cámara se dañó, pero tú hazte la película en la cabeza).",
        "🙄 (WhatsApp no quiso cargar el GIF, pero la intención cuenta).",
        "✨ (Censurado por exceso de cringe, confórmate con leerlo).",
        "💀 (Se cayó el internet de Latam, así que toca a pura imaginación).",
        "👀 (Imagínate la escena en tu mente, amiga).",
        "🥱 (Me dio pereza buscar el video, sorry not sorry).",
        "🔥 (El GIF era tan épico que rompía la Matrix, te salvé la vida).",
        "💅 (No pagué la suscripción del API, así que toca lectura).",
        "🤡 (Típico: quieres ver el drama pero los servidores dicen 'nop').",
        "💀 (Error 404: GIF no encontrado. Tu imaginación sí funciona, úsala).",
        "🙄 (Ay, haz de cuenta que lo estás viendo en 4K, no te quejes).",
        "✨ (Mucho texto, cero video. La vida es así de dura).",
        "👀 (Se robaron los cables del internet, te quedaste sin videíto).",
        "💅 (El nivel de cringe colapsó mi sistema, literal).",
        "🤡 (Te la debo, ando en modo ahorro de datos).",
        "💀 (Demasiada tensión sexual/violencia, mejor censurarlo)."
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      
      await client.sendMessage(m.chat, { text: finalCaption + '\n\n> ' + randomFallback, mentions: [who, m.sender] }, { quoted: m });
    }
  },
};
