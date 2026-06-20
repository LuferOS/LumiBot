import fetch from 'node-fetch';

export default {
  command: ['suerte'],
  category: 'juegos',
  run: async (client, m) => {
    const fromName = global.db.data.users[m.sender]?.name || '@' + m.sender.split('@')[0];
    const suertes = [
      { text: "🍀 Hoy tendrás un día increíble, pero alguien te pedirá plata prestada.", inter: "sad" },
      { text: "🍀 Tu crush te va a hablar hoy. (O te bloqueará, 50/50).", inter: "curious" },
      { text: "🍀 Encuentras dinero en la calle, pero pisarás caca de perro.", inter: "cringe" },
      { text: "🍀 Alguien está pensando en ti ahora mismo. Y no es tu mamá.", inter: "blush" },
      { text: "🍀 Cuidado con los mensajes de números desconocidos hoy.", inter: "scared" },
      { text: "🍀 Hoy todo te saldrá bien, menos el internet.", inter: "angry" },
      { text: "🍀 Te vas a enterar de un chisme súper jugoso antes de las 12.", inter: "coffee" },
      { text: "🍀 Vas a recibir buenas noticias económicas. (Un billete de a luca falso).", inter: "laugh" },
      { text: "🍀 Te vas a enamorar hoy... de un personaje ficticio.", inter: "love" },
      { text: "🍀 Un ex te va a escribir. Ignóralo.", inter: "nope" }
    ];
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender) || m.sender.startsWith('573118353868');
    const resp = isOwnerTarget ? { text: "🍀 Eres un Dios, tienes el control de todo el universo en tus manos. La suerte te obedece a ti.", inter: "smug" } : suertes[Math.floor(Math.random() * suertes.length)];
    const caption = `🔮 *TU SUERTE DE HOY* 🔮\n\n> ${resp.text}\n\nConfiésale esto al universo, \`${fromName}\`. ✨`;
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${resp.inter}&key=LumiBot-alya`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [m.sender] }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      m.reply(caption, { mentions: [m.sender] });
    }
  }
}
