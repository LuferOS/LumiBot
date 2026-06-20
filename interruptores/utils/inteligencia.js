export default {
  command: ['inteligencia', 'iq', 'iqtest'],
  category: 'utils',
  run: async (client, m) => {
    const mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    
    const isOwnerTarget = global.owner.map(num => num + '@s.whatsapp.net').includes(mentioned) || mentioned.startsWith('573118353868');
    const porcentaje = isOwnerTarget ? 9999 : Math.floor(Math.random() * 201); // IQ de 0 a 200
    
    const comentariosBajo = [
      "🤡 Tu cerebro está de adorno, literal.",
      "🧠 Tienes el IQ de una piedra mojada.",
      "💀 ¿Acaso respiras en automático o se te olvida a veces?",
      "📉 Si la estupidez doliera, vivirías gritando.",
      "🚩 Tienes un doctorado en tomar malas decisiones.",
      "🦍 Uga buga. Mono no saber pensar.",
      "🤡 Literalmente una maceta tiene más actividad cerebral.",
      "💀 De milagro lograste enviar este mensaje.",
      "📉 Tus neuronas están en huelga permanente.",
      "🧠 Pensar no es lo tuyo, mejor dedícate a ser guap@."
    ];
    
    const comentariosMedio = [
      "🤔 Eres promedio. Ni muy genio, ni muy bestia.",
      "👀 Tienes tus momentos de brillantez, pero son raros.",
      "🤡 A veces pareces inteligente, luego hablas y se te pasa.",
      "🧠 Sobrevives en la sociedad, eso ya es un logro.",
      "📉 Tienes lo justo para no cagarte encima.",
      "🤔 Eres de los que suman con los dedos bajo la mesa.",
      "👀 Aprobabas los exámenes copiando, y lo sabes.",
      "🤡 Tu nivel de inteligencia es como el WiFi público: inestable.",
      "🧠 Funciona, pero a 144p.",
      "📉 Entiendes los chistes 5 minutos después."
    ];
    
    const comentariosAlto = [
      "🤓 Vaya nerd, seguro usas lentes.",
      "✨ Cerebrito detectado. ¡Alabado sea el genio!",
      "📚 Te leías hasta los términos y condiciones.",
      "💡 Esa cabeza tuya tiene buenas ideas, asusta.",
      "🚀 Literal podrías trabajar en la NASA (limpiando, pero en la NASA).",
      "🤓 Einstein estaría celoso de tu potencial.",
      "✨ Eres el que siempre hacía la tarea y no la pasaba.",
      "📚 Te sabes todos los chismes de historia.",
      "💡 Solucionas problemas que ni sabíamos que teníamos.",
      "🚀 Tu cerebro sí que paga alquiler por estar ahí."
    ];
    
    const comentariosMaximo = [
      "👽 Literal eres un extraterrestre infiltrado.",
      "🧠 ALERTA DE MEGA MENTE. Demasiada inteligencia junta.",
      "✨ Podrías dominar el mundo pero te da pereza.",
      "🤯 Rompiste el medidor, tu IQ asusta a los mortales.",
      "🏆 Eres el ser superior del grupo. Los demás son plebeyos.",
      "👽 Te comunicas por telepatía de tan avanzado que estás.",
      "🧠 Has trascendido esta dimensión. Felicidades.",
      "✨ La Matrix te tiene miedo, wey.",
      "🤯 No deberías estar aquí, deberías estar curando el cáncer.",
      "🏆 Definitivamente, eres la prueba de que Dios tiene favoritos."
    ];
    
    let comentario = "";
    if (porcentaje < 50) comentario = comentariosBajo[Math.floor(Math.random() * comentariosBajo.length)];
    else if (porcentaje < 100) comentario = comentariosMedio[Math.floor(Math.random() * comentariosMedio.length)];
    else if (porcentaje < 140) comentario = comentariosAlto[Math.floor(Math.random() * comentariosAlto.length)];
    else comentario = comentariosMaximo[Math.floor(Math.random() * comentariosMaximo.length)];
    
    const texto = `🧠 *TEST DE INTELIGENCIA (IQ)* 🧠\n\nResultados de @${mentioned.split('@')[0]}:\n\n> 📊 *Puntaje IQ:* ${porcentaje}\n> 📝 *Diagnóstico:* ${comentario}\n\n*— Referencia de Puntos —*\n📉 *0-49:* Bruto / Falta de oxígeno\n🤔 *50-99:* Promedio / Sobreviviente\n🤓 *100-139:* Inteligente / Nerdge\n👽 *140-200:* Genio / Mega Mente`;
    
    await client.sendMessage(m.chat, { text: texto, mentions: [mentioned] }, { quoted: m });
  }
}
