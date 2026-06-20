export default {
  command: ['simp', 'simpeo', 'simpometro'],
  category: 'utils',
  run: async (client, m) => {
    const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(mentioned) || mentioned.startsWith('573118353868');
    const porcentaje = isOwnerTarget ? 0 : Math.floor(Math.random() * 101);
    const comentariosBajo = [
      "💅 Literal tienes dignidad, aplausos.",
      "😎 Eres inalcanzable, tu amor propio está intacto.",
      "✨ No le ruegas a nadie, qué elegancia la de Francia.",
      "🛡️ Tienes un escudo contra el enamoramiento pendejo.",
      "🥶 Corazón de hielo. Literal ni te inmutas.",
      "🏆 Ganando como siempre. Cero simpeo detectado.",
      "👑 Reina/Rey indiscutible. La dignidad por los cielos.",
      "💯 Estás en modo zen, el amor no te controla.",
      "💅 Eres tú quien deja en visto, no al revés.",
      "✨ Prefieres dormir a rogar atención. Basad@."
    ];
    
    const comentariosMedio = [
      "👀 Un poco de interés, pero te controlas.",
      "🤡 Estás coqueteando con el peligro, cuidado.",
      "📉 Tu dignidad está tambaleando, pero sobrevive.",
      "🤔 Todavía estás a tiempo de salvarte del abismo.",
      "🚨 Alerta amarilla: Estás empezando a stalkear historias.",
      "💬 Le contestas rápido, pero al menos no envías doble texto.",
      "👀 Ya le guardaste el contacto con un emoji, yo lo sé.",
      "🤡 No eres simp al 100%, pero sí un 50% payas@.",
      "📱 Esperas su mensaje, pero finges que no te importa.",
      "📉 Estás cayendo poco a poco en las redes del simpeo."
    ];
    
    const comentariosAlto = [
      "🤡 Amig@, estás a un mensaje de rogar amor.",
      "💀 Literal le perdonarías una infidelidad, oso mil.",
      "📉 Cero dignidad. Le respondes en 0.5 segundos.",
      "🚩 Eres la definición de 'date cuenta'.",
      "🤡 Te conformas con migajas de atención. Qué triste.",
      "📱 Le mandas memes que no responde y tú sigues.",
      "💀 Eres el/la 'casi algo' eterno. Qué humillación.",
      "🤡 Te cancela las citas y tú dices 'no te preocupes'.",
      "🚩 Estás justificando red flags que se ven desde la luna.",
      "📉 Tu estabilidad emocional depende de sus 'buenos días'."
    ];
    
    const comentariosMaximo = [
      "💀 ALERTA DE SIMP MÁXIMO. Literal le pagas el OnlyFans.",
      "🤡 Le depositas dinero 'para que coma rico'. Humillante.",
      "🚩 Tatuarte su nombre sería tu siguiente paso lógico.",
      "💀 Le escribes Biblias y te responde con un 'jaja ok'.",
      "🤡 Si el simpeo fuera deporte olímpico, tendrías oro.",
      "🚩 Eres el tapete donde se limpia los pies. Literal.",
      "💀 Gastas más en sus caprichos que en tu propia vida.",
      "🤡 Defiendes lo indefendible. Tu familia está preocupada.",
      "🚩 Le das like a sus fotos con su nueva pareja. Triste.",
      "💀 Tu nivel de simp rompió mis servidores. Busca ayuda."
    ];
    
    let comentario = "";
    if (porcentaje < 20) comentario = comentariosBajo[Math.floor(Math.random() * comentariosBajo.length)];
    else if (porcentaje < 50) comentario = comentariosMedio[Math.floor(Math.random() * comentariosMedio.length)];
    else if (porcentaje < 80) comentario = comentariosAlto[Math.floor(Math.random() * comentariosAlto.length)];
    else comentario = comentariosMaximo[Math.floor(Math.random() * comentariosMaximo.length)];
    
    const texto = `💖 *SIMPÓMETRO ACTIVADO* 💖\n\nNivel de simp de @${mentioned.split('@')[0]}:\n\n> 📊 *Porcentaje:* ${porcentaje}%\n> 📝 *Diagnóstico:* ${comentario}`;
    
    await client.sendMessage(m.chat, { text: texto, mentions: [mentioned] }, { quoted: m });
  }
}
