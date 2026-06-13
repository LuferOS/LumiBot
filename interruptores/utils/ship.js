import fetch from 'node-fetch';

export default {
  command: ['ship', 'shipear', 'amor', 'pareja'],
  category: 'fun',
  run: async (client, m, args) => {
    try {
      if (!m.isGroup) {
        return m.reply(`╭⋯ ⚠️ *ERROR TÁCTICO* ⋯》
┊ Bro, esto es para emparejar gente en grupos.
┊ En privado solo estamos tú y yo, no te pases. 💅
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }

      await m.react('🕒');

      // Obtenemos los miembros del grupo para la selección aleatoria
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
      const participants = groupMetadata?.participants || [];
      const members = participants.map(p => p.id);

      let user1 = m.sender;
      let user2 = '';

      // Lógica de selección de víctimas
      if (m.mentionedJid && m.mentionedJid.length >= 2) {
        user1 = m.mentionedJid[0];
        user2 = m.mentionedJid[1];
      } else if (m.mentionedJid && m.mentionedJid.length === 1) {
        user1 = m.sender;
        user2 = m.mentionedJid[0];
      } else {
        user1 = m.sender;
        const filteredMembers = members.filter(u => u !== user1);
        user2 = filteredMembers[Math.floor(Math.random() * filteredMembers.length)] || user1;
      }

      const phone1 = user1.split('@')[0];
      const phone2 = user2.split('@')[0];

      // Cálculo del algoritmo del amor
      const porcentaje = Math.floor(Math.random() * 101);
      let diagnostico = '';
      let corazones = '';
      let inter = '';

      const frases = {
        god: [
          "Boda inminente, wey. Ya consigan un cuarto. 💍",
          "Hasta mi procesador se calentó con esta pareja. 🔥",
          "Romeo y Julieta se quedan pendejos al lado de ustedes. ✨",
          "Nacieron para estar juntos, el algoritmo no miente. 💖",
          "Ya bésense, todo el grupo lo está esperando. 💋",
          "Si no se casan este año, yo mismo los obligo. ⛪",
          "El nivel de tensión sexual entre ustedes dos rompió mi código. 🥵",
          "Están a dos mensajes de poner 'en una relación' en Facebook. 📱",
          "Hacen tan bonita pareja que hasta da un poco de asco. 🤢💖",
          "El universo conspiró para que sus pings se alinearan. 🌐",
          "Parece el final feliz de un dorama coreano de 16 capítulos. 🌸",
          "100% real no fake. Lo de ustedes es amor puro. 💯",
          "Si tienen hijos van a salir preciosos, literal. 👶",
          "Son como el pan y la Nutella, perfectos juntos. 🍫",
          "Su compatibilidad es tan alta que hasta Dios les dio like. 👍",
          "Ya dejen de hacerse los locos y confirmen. 👀",
          "La química que tienen se puede cortar con un cuchillo. 🔪",
          "Tienen más futuro que mis ahorros, y eso es decir mucho. 💸",
          "Cásense y me invitan a la boda, yo pongo la música. 🎵",
          "Son la pareja aesthetic de Pinterest que todos envidian. 📸",
          "No es amor, es una obsesión mutua y nos encanta. 💅",
          "Si no terminan juntos, dejo de creer en el amor. 💔",
          "Sus cartas astrales dicen que son almas gemelas. ✨",
          "Son el 'felices para siempre' que Disney nos prometió. 🏰",
          "Literalmente el algoritmo me dijo que los shipeara. 🤖",
          "Su amor es más fuerte que mi firewall. 🛡️",
          "Ya denle el sí y dejen de perder el tiempo. ⏳"
        ],
        midHigh: [
          "Hay onda, tensión sexual no resuelta detectada. 😏",
          "Con unas caguamas esto fluye, te lo aseguro. 🍻",
          "Hacen bonita pareja, para qué te digo que no. 💅",
          "Mi escáner detecta química letal. Denle una oportunidad. 🧬",
          "Aquí hay material para una buena telenovela. 📺",
          "Un empujoncito y terminan juntos, se nota a leguas. 👀",
          "Podrían ser el 'casi algo' más intenso de la historia. 🔥",
          "Si estuvieran solos en una isla, ya sabemos qué pasaría. 🏝️",
          "Se gustan pero se hacen los difíciles, típicos orgullosos. 🙄",
          "Tienen un 50/50 de terminar en el altar o bloqueados. 🎲",
          "Son como un 'tal vez' pero con muchas ganas de que sea un 'sí'. ✨",
          "Se la pasan tirándose indirectas, ya confiesen. 🤫",
          "El amor está en el aire, pero a ustedes les da alergia. 🤧",
          "Hay potencial, pero les falta coraje, literal. 🐔",
          "Podrían funcionar si dejaran sus traumas atrás. 🤡",
          "Huele a romance adolescente y drama de secundaria. 🎒",
          "El destino los juntó, pero ustedes son medio lentos. 🐢",
          "Una salida por unos tacos y de ahí directo al motel. 🌮",
          "Se nota que se tienen ganas, pero el miedo no los deja. 💀",
          "Son como dos imanes, tarde o temprano se van a pegar. 🧲",
          "La tensión entre ustedes es más fuerte que el internet de Latam. 📶",
          "Solo falta que uno de los dos dé el primer paso. 🚶",
          "Si se atreven, podrían ser la envidia del grupo. 🌟",
          "Están a una peda de confesar todo. 🍺",
          "Tienen buena química, solo les falta física. 🧪"
        ],
        midLow: [
          "Más falsos que billete de 3 pesos. 💸",
          "Podría ser... si fuéramos los últimos humanos en la tierra. 🌍",
          "Pura lástima, mejor queden como amigos (y de lejitos). 🏃",
          "Tienen menos química que una piedra y un zapato. 🪨",
          "Ni con WiFi de la NASA se conectan ustedes dos. 📡",
          "Literal, son como el agua y el aceite, no se mezclan. 💧",
          "Amig@, date cuenta. Esa persona no es para ti. 🤡",
          "Se ven juntos y el universo llora de tristeza. 🌧️",
          "Si intentan algo, terminará en una funa masiva. 🚫",
          "Tienen la misma chispa que un fósforo mojado. 🧨",
          "Solo funcionarían en una realidad alterna donde todo esté al revés. 🙃",
          "No lo intentes, te vas a ahorrar muchos meses de terapia. 🛋️",
          "Es más fácil que yo me vuelva humano a que ustedes funcionen. 🤖",
          "El amor es ciego, pero con ustedes también se quedó sordo y mudo. 🙈",
          "Están a un mensaje de arruinar una bonita amistad. 📱",
          "Mejor sigan ignorándose, es por el bien de todos. 🤫",
          "Sus signos zodiacales están peleados a muerte. ♋",
          "Si se juntan, van a crear un agujero negro de cringe. 🕳️",
          "El algoritmo sugiere que se bloqueen mutuamente ahora mismo. ❌",
          "Serían la típica pareja que corta y vuelve cada dos semanas. ♻️",
          "Ni ChatGPT podría inventarles un futuro juntos. 🧠",
          "Tienen la compatibilidad de una piña en la pizza... controversial. 🍕",
          "Están mejor solos que mal acompañados. Literal. 💅",
          "Hay más amor entre un perro y un gato que entre ustedes. 🐕",
          "Tu mamá no lo/la aprobaría, y yo tampoco. 👵"
        ],
        low: [
          "Enemigos naturales. Se acercan y explota el chat. 💣",
          "Alerta: Riesgo de toxicidad nivel Chernóbil. ☢️",
          "Ni en un multiverso donde todos sean ciegos funcionarían. 🌌",
          "Error 404: Amor no encontrado. Vayan a terapia. 💻",
          "Mano, esto es un crimen contra la naturaleza. 🚔",
          "Sus vibras chocan tan fuerte que causan un sismo. 🌍",
          "Si se miran a los ojos, el diablo tiembla. 🔥",
          "Corran. Lejos. El uno del otro. Ahora mismo. 🏃💨",
          "Son la definición gráfica de una relación hiper tóxica. ☣️",
          "Antes se congela el infierno que verlos juntos. 🧊",
          "Tienen la misma compatibilidad que Windows 95 y un iPhone 15. 📱",
          "El universo les grita que NO, háganle caso por favor. 📢",
          "Si se casan, el divorcio está programado para el día siguiente. 📜",
          "Literal, me da un pantallazo azul solo de imaginarlos juntos. 🖥️",
          "Son como mezclar cloro y amoníaco: puro veneno. 🧪",
          "Su relación sería más dolorosa que pisar un Lego descalzo. 🦵",
          "Por favor, por el bien de la humanidad, ni se saluden. 🛑",
          "El karma debe estar muy enojado para cruzarlos en esta vida. 🧘",
          "Si esto fuera Tinder, el sistema se autodestruiría. 🔥",
          "Son la prueba de que el amor a primera vista no siempre existe. 👁️",
          "Más tóxicos que reactor nuclear sin mantenimiento. ☢️",
          "El porcentaje de odio supera al del amor por goleada. 📉",
          "Verlos juntos da más miedo que película de terror a las 3 AM. 👻",
          "Ni un amarre de brujería barata podría juntarlos. 🔮",
          "Son el claro ejemplo de por qué existen las órdenes de alejamiento. 👮"
        ]
      };

      if (porcentaje >= 75) {
        corazones = '💖🔥💞';
        diagnostico = frases.god[Math.floor(Math.random() * frases.god.length)];
        const inters = ['kiss', 'hug', 'blush', 'cuddle', 'love'];
        inter = inters[Math.floor(Math.random() * inters.length)];
      } else if (porcentaje >= 50) {
        corazones = '❤️✨';
        diagnostico = frases.midHigh[Math.floor(Math.random() * frases.midHigh.length)];
        const inters = ['stare', 'curious', 'happy', 'peek', 'shy'];
        inter = inters[Math.floor(Math.random() * inters.length)];
      } else if (porcentaje >= 25) {
        corazones = '💔🥀';
        diagnostico = frases.midLow[Math.floor(Math.random() * frases.midLow.length)];
        const inters = ['cringe', 'sad', 'nope', 'cry'];
        inter = inters[Math.floor(Math.random() * inters.length)];
      } else {
        corazones = '☠️💩';
        diagnostico = frases.low[Math.floor(Math.random() * frases.low.length)];
        const inters = ['slap', 'punch', 'angry', 'scared', 'bonk'];
        inter = inters[Math.floor(Math.random() * inters.length)];
      }

      // Interfaz Táctica LuferOS Decorada
      const caption = `╭⋯ 🔬 *ESCÁNER DE COMPATIBILIDAD* ⋯》
┊ ⊳ *Objetivo 1:* @${phone1}
┊ ⊳ *Objetivo 2:* @${phone2}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 📊 *Nivel:* ${porcentaje}% ${corazones}
┊ 📝 *Diagnóstico:* ${diagnostico}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
> ⚡ *Powered by LuferOS AI*`;

      try {
        const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${inter}&key=api-lYsN6`);
        const json = await res.json();
        if (json.result) {
          await client.sendMessage(m.chat, { video: { url: json.result }, gifPlayback: true, caption: caption, mentions: [user1, user2] }, { quoted: m });
        } else {
          throw new Error('No URL');
        }
      } catch (e) {
        await client.sendMessage(m.chat, { text: caption, mentions: [user1, user2] }, { quoted: m });
      }

      await m.react('✔️');

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en ship.js:", e);
      await m.react('✖️');
      await m.reply(`╭⋯ ❌ *Error del escáner* ⋯》\n┊ El sistema reventó procesando a estos dos.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
}
