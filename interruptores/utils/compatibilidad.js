import fetch from 'node-fetch';

export default {
  command: ['compatibilidad', 'amor', 'lovemeter'],
  category: 'juegos',
  run: async (client, m, args) => {
    let mentionedJid = m.mentionedJid;
    const target = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
    
    if (!target) {
      return m.reply("🙄 *Bruh, tienes que etiquetar o responder a alguien para medir el amor.* 💅");
    }
    
    const fromName = global.db.data.users[m.sender]?.name || '@' + m.sender.split('@')[0];
    const toName = global.db.data.users[target]?.name || '@' + target.split('@')[0];
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(target) || target.startsWith('573118353868');
    const isOwnerSender = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender) || m.sender.startsWith('573118353868');
    const percent = (isOwnerTarget || isOwnerSender) ? 100 : Math.floor(Math.random() * 101);
    
    let msg = "";
    let inter = "";
    if (percent < 20) { msg = "💀 Corran por sus vidas, son veneno puro juntos."; inter = "slap"; }
    else if (percent < 50) { msg = "😬 Mejor como amigos... de lejitos."; inter = "cringe"; }
    else if (percent < 80) { msg = "😏 Hay química, no se hagan los locos."; inter = "blush"; }
    else { msg = "💍 ¡Boda mañana! Son el uno para el otro, literal."; inter = "kiss"; }

    const caption = `💖 *MEDIDOR DE AMOR* 💖\n\n\`${fromName}\` x \`${toName}\`\n\n💘 *Compatibilidad:* ${percent}%\n> ${msg}`;
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=LumiBot-alya`);
      const json = await res.json();
      if (json.result) {
        await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [m.sender, target] }, { quoted: m });
      } else {
        throw new Error('No URL');
      }
    } catch (e) {
      await client.sendMessage(m.chat, { text: caption, mentions: [m.sender, target] }, { quoted: m });
    }
  }
}
