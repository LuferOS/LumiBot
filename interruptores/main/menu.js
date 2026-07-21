import { getDevice } from 'baileys-next';
import { getCoins } from '../../nucleo/coinsDB.js';

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      
      const banner = botSettings.banner || 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
      const usersCount = db.users ? Object.keys(db.users).length : 0;
      
      const sender = m.sender;
      const userName = db.users?.[sender]?.name || m.pushName || 'Usuario';
      const userLevel = db.users?.[sender]?.level || 1;
      const userExp = db.users?.[sender]?.exp || 0;
      const userCoins = getCoins(sender);

      const menuText = `Hola @${sender.split('@')[0]} 👋 Bienvenido a *LumiBot* ✨ espero que tengas un lindo día 🌞 y que disfrutes del bot.

┏━━━━━━━━━━━━━━━
┃╭──────────────┄
┃│◈ 👑 *By LuferOS Team* 👑
┃│◈ 👤 Owner: \`LuferOS\`
┃│◈ 🤖 Bot Name: \`LumiBot\`
┃│◈ 👥 Usuarios: \`${usersCount}\`
┃│◈ 🔄 Update: \`Custom (4.0)\`
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━
┃╭──────────────┄
┃│◈ 👤 Usuario: @${sender.split('@')[0]}
┃│◈ 🪙 LumiCoins: ${userCoins}
┃│◈ 🌟 Nivel: ${userLevel}
┃│◈ ⚡ Experiencia: ${userExp}
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

			*📋 L I S T A  -  M E N Ú S 📋*

┏━━━━━⦅ ℹ️ \`INFO\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🖥️ .testram
┃│◈ 📊 .totalfunciones
┃│◈ 👨‍💻 .creador
┃│◈ 🌐 .dashboard
┃│◈ 🟢 .estado
┃│◈ 👥 .grupos
┃│◈ 🤖 .infobot
┃│◈ 📋 .menu
┃│◈ 🏓 .ping
┃│◈ 💡 .suggest
┃│◈ ⏱️ .runtime
┃│◈ 👑 .owner
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🧠 \`IA's\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 👧 .monika
┃│◈ 🌪️ .tatsumaki
┃│◈ ✨ .gemini
┃│◈ 🤖 .chatgpt
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🔍 \`SEARCH\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🌸 .animesearch
┃│◈ 🔞 .hentaisearch
┃│◈ 🖼️ .pixabay
┃│◈ 🟧 .pornhubsearch
┃│◈ 👽 .redditsearch
┃│◈ 🌌 .rsearch
┃│◈ 🎧 .spotifysearch
┃│◈ 🎵 .tiktoksearch <texto>
┃│◈ 🐦 .tweetposts *<búsqueda>*
┃│◈ 📺 .ytsearch *<búsqueda>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🎮 \`GAME\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🤔 .acertijo
┃│◈ 🪢 .ahorcados
┃│◈ 🔠 .anagrama
┃│◈ 🎰 .apostar *<cantidad>*
┃│◈ 🐎 .carrera *[1-4] [apuesta]*
┃│◈ 🎲 .dado
┃│◈ ⚔️ .duelo *@usuario [apuesta]*
┃│◈ 🧠 .iqtest
┃│◈ 🔢 .mates
┃│◈ 💣 .minas *[apuesta]*
┃│◈ 🪙 .moneda *<cara/cruz> [apuesta]*
┃│◈ ❓ .quiz *facil/dificil*
┃│◈ 🥷 .rob *@usuario*
┃│◈ 🎡 .ruleta *<cantidad> <color>*
┃│◈ 🔫 .ruletarusa
┃│◈ 🍒 .slot *<apuesta>*
┃│◈ 🏆 .topquiz
┃│◈ 🟩 .wordle
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🤖 \`SUB BOTS\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🤖 .bots
┃│◈ 🔗 .serbot
┃│◈ ❌ .delsession
┃│◈ 🔄 .reconectar
┃│◈ 🔁 .reconectall
┃│◈ 📞 .reconum <número>
┃│◈ ⚙️ .set *<opción>*
┃│◈ 🛑 .stop
┃│◈ 📊 .totalbots
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🎒 \`RPG\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 💰 .bal
┃│◈ 🏦 .bank
┃│◈ 📦 .cofre
┃│◈ 🔪 .crimen
┃│◈ 🎁 .claim
┃│◈ 💸 .darcoins @user <cantidad>
┃│◈ 🌟 .darxp @user <cantidad>
┃│◈ 🏦 .depositar
┃│◈ 🏆 .lb
┃│◈ ⬆️ .levelup
┃│◈ ⛏️ .minar
┃│◈ 📅 .monthly
┃│◈ 🪅 .piñata
┃│◈ 🏧 .retirar
┃│◈ 🛒 .buy
┃│◈ 🛍️ .buyall
┃│◈ 💃 .slut
┃│◈ 📆 .weekly
┃│◈ 💼 .work
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 📝 \`REGISTRO\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🔢 .sn
┃│◈ 👤 .perfil
┃│◈ 👥 .perfil *@user*
┃│◈ ✍️ .reg *<nombre.edad>*
┃│◈ ❌ .unreg
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🏷️ \`STICKER\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🟩 .brat *<texto>*
┃│◈ 🎭 .emojimix *<emoji+emoji>*
┃│◈ 💬 .quotly *<texto>*
┃│◈ 🖼️ .sticker
┃│◈ 🏷️ .wm
┃│◈ 🏷️ .wm2
┃│◈ 🖼️ .toimg *<sticker>*
┃│◈ 🎥 .tovid *<sticker>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🖼️ \`IMAGE\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🎵 .tiktokimg *<url>*
┃│◈ 👤 .avatar
┃│◈ 🇰🇷 .corean
┃│◈ 👗 .cosplay
┃│◈ 🔞 .doujin
┃│◈ 🔞 .ero
┃│◈ 🦊 .foxgirl
┃│◈ 🔍 .imagen *<búsqueda>*
┃│◈ 🔍 .imagen2 <búsqueda>
┃│◈ 👧 .loli
┃│◈ 🌸 .marin
┃│◈ 💥 .megumin
┃│◈ 🐱 .neko
┃│◈ 🐱 .neko2
┃│◈ 🍈 .oppai
┃│◈ 📦 .pack
┃│◈ 📌 .pinterest
┃│◈ 🎨 .pixiv *<búsqueda>*
┃│◈ 💑 .ppcouple
┃│◈ 🤳 .selfie
┃│◈ 🦋 .shinobu
┃│◈ 👰 .waifu
┃│◈ 🍈 .boobs
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 👥 \`GROUPS\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🛡️ .antibot *<on/off>*
┃│◈ ⏱️ .checkexpired
┃│◈ 🗑️ .delete
┃│◈ ⬇️ .demote *@tag*
┃│◈ 🧹 .erase
┃│◈ ℹ️ .infogp
┃│◈ 📋 .grouplist
┃│◈ 📩 .invite
┃│◈ 🥾 .kick *@user*
┃│◈ 🔗 .link
┃│◈ 🔇 .mute *<1d/2h/10m>*
┃│◈ 🔊 .unmute *@user*
┃│◈ 🤖 .bot
┃│◈ 📊 .encuesta *<pregunta|opciones>*
┃│◈ ⬆️ .promote *@user*
┃│◈ 🔄 .resetlink
┃│◈ 🚪 .group *abrir/cerrar*
┃│◈ 👑 .setprimary *asignar/eliminar*
┃│◈ 📣 .tag <mensaje>
┃│◈ 🏷️ .tag
┃│◈ 🧹 .wipe
┃│◈ 📉 .ds
┃│◈ ⬇️ .odemote *@tag*
┃│◈ ⬆️ .opromote *@user*
┃│◈ 🏷️ .otag
┃│◈ 📏 .botdistancia
┃│◈ 📝 .getbio
┃│◈ 📝 .getbio *@tag*
┃│◈ 👤 .getname
┃│◈ 👤 .getname *@tag*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ ⚙️ \`ON / OFF\` ⦆━━━━━
┃╭──────────────┄
┃│◈ ✅ .enable
┃│◈ ❌ .disable
┃│◈ 🤖 .bot
┃│◈ 👑 .onlyadmin *<on/off>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 💎 \`PREMIUM\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 📁 .mediafire *<url>*
┃│◈ 🔍 .inspect *<link>*
┃│◈ ☁️ .mega *<url>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 📥 \`DOWNLOAD\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🛒 .aptoide *<búsqueda>*
┃│◈ 🌸 .danbooru *<url>*
┃│◈ 📘 .fb *<link fb>*
┃│◈ 🐙 .gitclone *<url git>*
┃│◈ 📸 .instagram *<link ig>*
┃│◈ 💖 .likeedl *<url>*
┃│◈ 📁 .mediafire *<url>*
┃│◈ 🎧 .spotify *<texto/link>*
┃│◈ 🧵 .threads <url>
┃│◈ 🎵 .tiktok <url tt>
┃│◈ 🖼️ .tiktokimg *<url>*
┃│◈ 👤 .tiktokuser *<usuario>*
┃│◈ 🎥 .tiktokvid *<búsqueda>*
┃│◈ 🐦 .x <url>
┃│◈ 🎨 .pixiv *<búsqueda>*
┃│◈ 🔞 .xnxxdl *<url>*
┃│◈ 🔞 .xvideosdl *<url>*
┃│◈ ☁️ .mega *<url>*
┃│◈ ▶️ .play <búsqueda>
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🛠️ \`TOOLS\` ⦆━━━━━
┃╭──────────────┄
┃│◈ ⌨️ .setcmd <texto>
┃│◈ 🔧 .fixdb
┃│◈ 📊 .infodb
┃│◈ 📋 .lista
┃│◈ ✂️ .acortar *<url>*
┃│◈ ⬛ .blackbox
┃│◈ 🧮 .cal *<ecuacion>*
┃│◈ 🎵 .chazam *<audio>*
┃│◈ 🎨 .dalle
┃│◈ 🎭 .fake *<texto/@tag/texto>*
┃│◈ 📱 .getnum
┃│◈ 🖼️ .getpp
┃│◈ 📺 .hd
┃│◈ ☁️ .ibb
┃│◈ 🎤 .lyrics <canción>
┃│◈ 🧠 .Ia
┃│◈ 📡 .morse *<encode|decode>*
┃│◈ 🔳 .qrcode <texto>
┃│◈ 😄 .react *<emoji>*
┃│◈ 📖 .readmore *<teks>|<teks>*
┃│◈ 📷 .readqr
┃│◈ 🔄 .reenviar
┃│◈ 📸 .ss *<url>*
┃│◈ 💻 .ssweb *<url>*
┃│◈ 💅 .style *<texto>*
┃│◈ 📄 .document *<audio/video>*
┃│◈ 🎥 .togifaud
┃│◈ 🖼️ .toimg *<sticker>*
┃│◈ 🎵 .tomp3
┃│◈ ☁️ .githubupload
┃│◈ 🎥 .tovid *<sticker>*
┃│◈ 🌍 .trad *<leng> <texto>*
┃│◈ 📝 .transcripyt *<url>*
┃│◈ 🗣️ .tts *<texto>*
┃│◈ 📇 .vcard *@tag*
┃│◈ 🎵 .whatmusic
┃│◈ ♈ .zodiac *2002 02 25*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🥳 \`FUN\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 💤 .afk *<razón>*
┃│◈ 💔 .infiel
┃│◈ 📽️ .proyectado
┃│◈ 🏳️‍🌈 .gay2 *@user*
┃│◈ 👩‍❤️‍👩 .lesbiana *@user*
┃│◈ 💦 .pajero *@user*
┃│◈ 💦 .pajera *@user*
┃│◈ 💅 .puto *@user*
┃│◈ 💅 .puta *@user*
┃│◈ ♿ .manco *@user*
┃│◈ ♿ .manca *@user*
┃│◈ 🐀 .rata *@user*
┃│◈ 💄 .prostituta *@user*
┃│◈ 💄 .prostituto *@user*
┃│◈ 💦 .cumear @tag
┃│◈ 💃 .dance *<@user>*
┃│◈ 👉👌 .follar
┃│◈ 💑 .formarpareja
┃│◈ 🏳️‍🌈 .gay *@user*
┃│◈ 🤗 .abrazar @tag
┃│◈ 🔪 .kill *<@user>*
┃│◈ 💋 .kiss @tag
┃│◈ ❤️ .love *@user*
┃│◈ 🥷 .nombreninja *<texto>*
┃│◈ 👋 .ola
┃│◈ 🧠 .personalidad *<nombre>*
┃│◈ 😍 .piropo
┃│◈ ❓ .pregunta *<texto>*
┃│◈ 🎯 .reto
┃│◈ 🔝 .top
┃│◈ 👋 .hola
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🔞 \`NSFW\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🎥 .hvideo
┃│◈ 🎮 .genshin
┃│◈ 🩱 .swimsuit
┃│◈ 🏫 .schoolswimsuit
┃│◈ 🤍 .white
┃│◈ 👣 .barefoot
┃│◈ 🌸 .touhou
┃│◈ 🎮 .gamecg
┃│◈ 🎤 .hololive
┃│◈ 🔓 .uncensored
┃│◈ 🕶️ .sunglasses
┃│◈ 👓 .glasses
┃│◈ 🔫 .weapon
┃│◈ 👕 .shirtlift
┃│◈ ⛓️ .chain
┃│◈ 👉👌 .fingering
┃│◈ 🪟 .flatchest
┃│◈ 👗 .torncloth
┃│◈ 🪢 .bondage
┃│◈ 😈 .demon
┃│◈ 💦 .wet
┃│◈ 🩲 .pantypull
┃│◈ 👒 .headdress
┃│◈ 🎧 .headphone
┃│◈ 👔 .tie
┃│◈ 🍑 .anusview
┃│◈ 👖 .shorts
┃│◈ 🧦 .stokings
┃│◈ 👙 .topless
┃│◈ 🏖️ .beach
┃│◈ 🐰 .bunnygirl
┃│◈ 🐇 .bunnyear
┃│◈ 🎤 .idol
┃│◈ 🦇 .vampire
┃│◈ 🔫 .gun
┃│◈ 🧹 .maid
┃│◈ 👙 .bra
┃│◈ 🚫 .nobra
┃│◈ 👙 .bikini
┃│◈ 🤍 .whitehair
┃│◈ 👱‍♀️ .blonde
┃│◈ 💖 .pinkhair
┃│◈ 🛏️ .bed
┃│◈ 👱‍♀️ .ponytail
┃│◈ 🔞 .nude
┃│◈ 👗 .dress
┃│◈ 🩲 .underwear
┃│◈ 🦊 .foxgirl
┃│◈ 🏫 .uniform
┃│◈ 👗 .skirt
┃│◈ 👉👌 .sex
┃│◈ 👉👌 .sex2
┃│◈ 👉👌 .sex3
┃│◈ 🍈 .breast
┃│◈ 👧 .twintail
┃│◈ 🍑 .spreadpussy
┃│◈ 😢 .tears
┃│◈ 🪟 .seethrough
┃│◈ 👐 .breasthold
┃│◈ 🍺 .drunk
┃│◈ ⚔️ .fateseries
┃│◈ 🦵 .spreadlegs
┃│◈ 👔 .openshirt
┃│◈ 🎀 .headband
┃│◈ 🍔 .food
┃│◈ 🔍 .close
┃│◈ 🌳 .tree
┃│◈ 🍒 .nipples
┃│◈ 🍒 .erectnipples
┃│◈ 😈 .horns
┃│◈ 💚 .greenhair
┃│◈ 🐺 .wolfgirl
┃│◈ 🐱 .catgirl
┃│◈ 🔞 .rule34 *<búsqueda>*
┃│◈ 🎥 .ttvideo
┃│◈ 🔞 .xnxxdl *<url>*
┃│◈ 🔞 .xvideosdl *<url>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🗄️ \`DATABASE\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🗑️ .delcmd *<texto>*
┃│◈ 📋 .listcmd
┃│◈ 💥 .delallcmd
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 👑 \`OWNER\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🐛 .debugst
┃│◈ 🌟 .addxp <cantidad> @tag
┃│◈ 💰 .addcoins <cantidad> @tag
┃│◈ ⏱️ .expired *<días>*
┃│◈ 💎 .addprem *@user*
┃│◈ 🤖 .autoadmin
┃│◈ 🚫 .banlist
┃│◈ 🔨 .ban *@user*
┃│◈ ⛔ .block <número>
┃│◈ 📋 .blocklist
┃│◈ 🧹 .clearsessions
┃│◈ ➖ .delxp <cantidad> @tag
┃│◈ ➖ .delcoins <cantidad> @tag
┃│◈ 🗑️ .deluser *@user*
┃│◈ 🗑️ .deleteuser *@user*
┃│◈ 🧹 .delexpired
┃│◈ 🗑️ .delplug
┃│◈ ❌ .delprem *@user*
┃│◈ 📥 .dldb
┃│◈ 👑 .dsowner
┃│◈ 🔗 .fetch *( Link )*
┃│◈ 🗄️ .getdb
┃│◈ 🧩 .getplug <nombre del plugin>
┃│◈ 📄 .getrootfile <nombre del archivo>
┃│◈ 🔑 .getsesion
┃│◈ ➕ .join *<link> <días>*
┃│◈ 🌟 .josuexp
┃│◈ 📋 .listplugs
┃│◈ 🛠️ .makeplug <name>|<code>
┃│◈ 💾 .memoxp
┃│◈ 📉 .nerftopxp
┃│◈ 🛑 .offallbot
┃│◈ 🥾 .okick *@user*
┃│◈ 📁 .plugs <categoría>
┃│◈ 🔄 .resetuser *@user*
┃│◈ 🔄 .restart
┃│◈ 📂 .rootlist
┃│◈ 🚪 .salir
┃│◈ 💾 .saveplugin <nombre>
┃│◈ ✏️ .setxp <cantidad> @tag
┃│◈ ✏️ .setcoins <cantidad> @tag
┃│◈ 💲 .setprice
┃│◈ 🔓 .unban *@user*
┃│◈ 🟢 .unblock <número>
┃│◈ 🔄 .update
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🎵 \`AUDIOS\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🔊 .bass *<mp3/vn>*
┃│◈ 💥 .blown *<mp3/vn>*
┃│◈ 🌊 .deep *<mp3/vn>*
┃│◈ 🙉 .earrape *<mp3/vn>*
┃│◈ ⏩ .fast *<mp3/vn>*
┃│◈ 🐘 .fat *<mp3/vn>*
┃│◈ 🌙 .nightcore *<mp3/vn>*
┃│◈ ⏪ .reverse *<mp3/vn>*
┃│◈ 🤖 .robot *<mp3/vn>*
┃│◈ 🐢 .slow *<mp3/vn>*
┃│◈ ☁️ .smooth *<mp3/vn>*
┃│◈ 🐿️ .tupai *<mp3/vn>*
┃│◈ 🎵 .reverb *<mp3/vn>*
┃│◈ 👥 .chorus *<mp3/vn>*
┃│◈ 🚁 .flanger *<mp3/vn>*
┃│◈ 🎸 .distortion *<mp3/vn>*
┃│◈ 📈 .pitch *<mp3/vn>*
┃│◈ 📻 .highpass *<mp3/vn>*
┃│◈ 🔈 .lowpass *<mp3/vn>*
┃│◈ 🌊 .underwater *<mp3/vn>*
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 💻 \`ADVANCED\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 💻 $
┃│◈ 💻 <
┃│◈ 💻 =<
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ ✨ \`CUSTOM\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 🌟 .yachiyoxp
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🎲 \`ROLLWAIFU\` ⦆━━━━━
┃╭──────────────┄
┃│◈ ℹ️ .ainfo
┃│◈ 🎁 .claimwf
┃│◈ 🎲 .c
┃│◈ 👰 .miswaifus
┃│◈ 👯‍♀️ .harem
┃│◈ ℹ️ .ginfo
┃│◈ ℹ️ .gachainfo
┃│◈ 💰 .sell
┃│◈ 💰 .vender
┃│◈ 🏪 .haremshop
┃│◈ 🏪 .tiendawaifus
┃│◈ 💳 .comprarwaifu
┃│◈ 💳 .buycharacter
┃│◈ 🎲 .rollwaifu
┃│◈ 🗳️ .vote
┃│◈ 🖼️ .wimage *<name>*
┃│◈ ℹ️ .wfinfo
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🤖 \`AUTOMATION\` ⦆━━━━━
┃╭──────────────┄
┃│◈ ⚙️ .onautodsowner
┃│◈ ⚙️ .onautods
┃│◈ 🛑 .stopds
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━

┏━━━━━⦅ 🤝 \`ASISTENCIA\` ⦆━━━━━
┃╭──────────────┄
┃│◈ 👨‍🔧 .asistente
┃╰──────────────┄
┗━━━━━━━━━━━━━━━━`;

      let msgPayload = {
        contextInfo: {
          mentionedJid: [m.sender]
        }
      };

      if (banner.includes('.mp4') || banner.includes('.webm')) {
        msgPayload.video = { url: banner };
        msgPayload.gifPlayback = true;
        msgPayload.caption = menuText;
      } else {
        msgPayload.image = { url: banner };
        msgPayload.caption = menuText;
      }

      try {
        await client.sendMessage(m.chat, msgPayload, { quoted: m });
      } catch (mediaError) {
        console.error("[LUMIBOT DEBUG] Error de imagen, enviando texto plano:", mediaError.message);
        await client.sendMessage(m.chat, { text: menuText, contextInfo: msgPayload.contextInfo }, { quoted: m });
      }
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error crítico en menú:", e);
      await m.reply(`🙄 *Bruh...* el menú falló.\n> 🚩 Razón: *${e.message}*`);
    }
  }
};
