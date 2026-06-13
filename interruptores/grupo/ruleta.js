import fetch from 'node-fetch';

export default {
  command: ['ruleta', 'roulette', 'suerte'],
  category: 'grupo',
  run: async (client, m) => {
    const bala = Math.floor(Math.random() * 6); // 1 in 6 chance
    
    const deathMessages = [
      "🔫 *¡BANG!* 💥\n\n> 💀 Literal te volaste los sesos. Fuiste, amig@, te toca reiniciar partida en otra vida 💅.",
      "🔫 *¡BANG!* 💥\n\n> 💀 Esa bala tenía tu nombre escrito en Comic Sans. Game over 🤡.",
      "🔫 *¡BANG!* 💥\n\n> 💀 PUM. Ni modo, de todos modos no estabas aportando mucho al grupo ✨.",
      "🔫 *¡BANG!* 💥\n\n> 💀 Adiós vaquero. Tu historial de búsqueda será borrado como pediste 💅.",
      "🔫 *¡BANG!* 💥\n\n> 💀 Te moriste. Ojalá en tu próxima vida tengas mejor ping 🌐.",
      "🔫 *¡BANG!* 💥\n\n> 💀 Directo con San Pedro. Tráete un recuerdito de allá arriba ☁️.",
      "🔫 *¡BANG!* 💥\n\n> 💀 Literal caíste más rápido que tu dignidad por tu ex 🤡.",
      "🔫 *¡BANG!* 💥\n\n> 💀 F en el chat. Descansa en paz, amig@ 💅."
    ];

    const safeMessages = [
      "🔫 *¡Click!* 💨\n\n> ✨ Te salvaste. La bala no salió. Hoy la muerte te dijo 'no mi ciela' 💅.",
      "🔫 *¡Click!* 💨\n\n> ✨ Sigue respirando. Hoy no es tu día de suerte, pero tampoco el de tu muerte 🤡.",
      "🔫 *¡Click!* 💨\n\n> ✨ Te perdoné la vida. De nada 💅.",
      "🔫 *¡Click!* 💨\n\n> ✨ No moriste, así que todavía te toca ir a trabajar/estudiar mañana 💀.",
      "🔫 *¡Click!* 💨\n\n> ✨ Ufff, por poquito. Ya estabas viendo la luz al final del túnel 👀.",
      "🔫 *¡Click!* 💨\n\n> ✨ Estás a salvo. El diablo todavía no te quiere allá abajo 🔥.",
      "🔫 *¡Click!* 💨\n\n> ✨ Suerte de principiante, literal 🙄.",
      "🔫 *¡Click!* 💨\n\n> ✨ Nada de balas. Qué aburrido, yo quería ver sangre 🩸 (broma 💅)."
    ];

    let caption = '';
    let inter = '';
    if (bala === 0) {
      caption = deathMessages[Math.floor(Math.random() * deathMessages.length)];
      inter = 'scared';
    } else {
      caption = safeMessages[Math.floor(Math.random() * safeMessages.length)];
      inter = 'smug';
    }

    try {
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      await m.reply(caption);
    }
  }
}
