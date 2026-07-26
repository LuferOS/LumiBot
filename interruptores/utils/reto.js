import fetch from 'node-fetch';

export default {
  command: ['reto'],
  category: 'juegos',
  run: async (client, m) => {
    const retos = [
  {
    "text": "Manda un audio respirando fuerte. 🔥",
    "inter": "smug"
  },
  {
    "text": "Haz mandar captura de tus chats y manda prueba. 🔥",
    "inter": "angry"
  },
  {
    "text": "Confiesa tu secreto más oscuro en el grupo. 🔥",
    "inter": "curious"
  },
  {
    "text": "Haz 10 flexiones y manda prueba. 🔥",
    "inter": "smug"
  },
  {
    "text": "Escribe un mensaje a un número al azar diciéndole 'tengo un secreto'. 🔥",
    "inter": "smug"
  },
  {
    "text": "Escribe un mensaje a tu mejor amig@ diciéndole 'te amo'. 🔥",
    "inter": "blush"
  },
  {
    "text": "Ponte una foto de perfil de Shrek por 24 horas. 🔥",
    "inter": "shy"
  },
  {
    "text": "Llama a un número al azar y dile 'préstame plata'. 🔥",
    "inter": "shy"
  },
  {
    "text": "Escribe un mensaje a la última persona que mandó mensaje diciéndole 'me gustas'. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Llama a tu vecin@ y dile 'estoy embarazad@/voy a ser papá'. 🔥",
    "inter": "curious"
  },
  {
    "text": "Manda un audio imitando a un animal. 🔥",
    "inter": "happy"
  },
  {
    "text": "Manda un audio cantando opening de anime. 🔥",
    "inter": "blush"
  },
  {
    "text": "Escribe un mensaje a tu profesor diciéndole 'estoy en la cárcel'. 🔥",
    "inter": "curious"
  },
  {
    "text": "Confiesa tu fetiche en el grupo. 🔥",
    "inter": "angry"
  },
  {
    "text": "Escribe un mensaje a tu crush diciéndole 'te amo'. 🔥",
    "inter": "smug"
  },
  {
    "text": "Ponte una foto de perfil de un perro feo por 24 horas. 🔥",
    "inter": "peek"
  },
  {
    "text": "Haz mostrar tu historial de búsqueda y manda prueba. 🔥",
    "inter": "angry"
  },
  {
    "text": "Haz bloquear a alguien y manda prueba. 🔥",
    "inter": "happy"
  },
  {
    "text": "Manda un audio gimiendo. 🔥",
    "inter": "blush"
  },
  {
    "text": "Manda un audio hablando como bebé. 🔥",
    "inter": "scared"
  },
  {
    "text": "Escribe un mensaje a el admin diciéndole 'tengo un secreto'. 🔥",
    "inter": "blush"
  },
  {
    "text": "Confiesa tu peor miedo en el grupo. 🔥",
    "inter": "peek"
  },
  {
    "text": "Confiesa tu mayor arrepentimiento en el grupo. 🔥",
    "inter": "sad"
  },
  {
    "text": "Ponte una foto de perfil de tu ex por 24 horas. 🔥",
    "inter": "cry"
  },
  {
    "text": "Confiesa cuántos días llevas sin bañarte en el grupo. 🔥",
    "inter": "scared"
  },
  {
    "text": "Escribe un mensaje a el admin diciéndole 'estoy embarazad@/voy a ser papá'. 🔥",
    "inter": "nope"
  },
  {
    "text": "Confiesa algo ilegal que hiciste en el grupo. 🔥",
    "inter": "stare"
  },
  {
    "text": "Escribe un mensaje a tu mamá diciéndole 'me gustas'. 🔥",
    "inter": "laugh"
  },
  {
    "text": "Manda un audio pidiendo perdón. 🔥",
    "inter": "curious"
  },
  {
    "text": "Escribe un mensaje a un número al azar diciéndole 'te amo'. 🔥",
    "inter": "sad"
  },
  {
    "text": "Escribe un mensaje a un número al azar diciéndole 'quiero volver contigo'. 🔥",
    "inter": "smug"
  },
  {
    "text": "Llama a tu vecin@ y dile 'me gustas'. 🔥",
    "inter": "nope"
  },
  {
    "text": "Llama a tu vecin@ y dile 'tengo un secreto'. 🔥",
    "inter": "scared"
  },
  {
    "text": "Confiesa a quién stalkeas en el grupo. 🔥",
    "inter": "shy"
  },
  {
    "text": "Manda un audio llorando falsamente. 🔥",
    "inter": "curious"
  },
  {
    "text": "Escribe un mensaje a la última persona que mandó mensaje diciéndole 'estoy en la cárcel'. 🔥",
    "inter": "peek"
  },
  {
    "text": "Llama a tu mamá y dile 'te amo'. 🔥",
    "inter": "laugh"
  },
  {
    "text": "Escribe un mensaje a el admin diciéndole 'préstame plata'. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Ponte una foto de perfil de una cucaracha por 24 horas. 🔥",
    "inter": "cringe"
  },
  {
    "text": "Escribe un mensaje a tu vecin@ diciéndole 'te amo'. 🔥",
    "inter": "smug"
  },
  {
    "text": "Escribe un mensaje a tu crush diciéndole 'ya no te soporto'. 🔥",
    "inter": "stare"
  },
  {
    "text": "Llama a el admin y dile 'te amo'. 🔥",
    "inter": "cringe"
  },
  {
    "text": "Haz un baile de TikTok y manda prueba. 🔥",
    "inter": "cringe"
  },
  {
    "text": "Escribe un mensaje a tu profesor diciéndole 'préstame plata'. 🔥",
    "inter": "curious"
  },
  {
    "text": "Escribe un mensaje a tu jefe diciéndole 'ya no te soporto'. 🔥",
    "inter": "cry"
  },
  {
    "text": "Escribe un mensaje a tu mamá diciéndole 'estoy en la cárcel'. 🔥",
    "inter": "curious"
  },
  {
    "text": "Escribe un mensaje a tu mamá diciéndole 'quiero volver contigo'. 🔥",
    "inter": "shy"
  },
  {
    "text": "Haz comer un ajo crudo y manda prueba. 🔥",
    "inter": "blush"
  },
  {
    "text": "Llama a el admin y dile 'ya no te soporto'. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Confiesa tu mentira más grande en el grupo. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Haz dibujar algo feo y manda prueba. 🔥",
    "inter": "smug"
  },
  {
    "text": "Manda un audio declarando tu amor. 🔥",
    "inter": "curious"
  },
  {
    "text": "Ponte una foto de perfil de el admin por 24 horas. 🔥",
    "inter": "sad"
  },
  {
    "text": "Llama a tu crush y dile 'estoy en la cárcel'. 🔥",
    "inter": "nope"
  },
  {
    "text": "Ponte una foto de perfil de un payaso por 24 horas. 🔥",
    "inter": "shy"
  },
  {
    "text": "Ponte una foto de perfil de un meme rancio por 24 horas. 🔥",
    "inter": "sad"
  },
  {
    "text": "Escribe un mensaje a tu vecin@ diciéndole 'quiero volver contigo'. 🔥",
    "inter": "shy"
  },
  {
    "text": "Ponte una foto de perfil de un mono por 24 horas. 🔥",
    "inter": "scared"
  },
  {
    "text": "Escribe un mensaje a la última persona que mandó mensaje diciéndole 'soy un extraterrestre'. 🔥",
    "inter": "angry"
  },
  {
    "text": "Llama a tu ex y dile 'quiero volver contigo'. 🔥",
    "inter": "sad"
  },
  {
    "text": "Llama a tu vecin@ y dile 'ya no te soporto'. 🔥",
    "inter": "smug"
  },
  {
    "text": "Escribe un mensaje a tu jefe diciéndole 'me gustas'. 🔥",
    "inter": "stare"
  },
  {
    "text": "Manda un audio insultando al admin. 🔥",
    "inter": "stare"
  },
  {
    "text": "Ponte una foto de perfil de un personaje otaku por 24 horas. 🔥",
    "inter": "sad"
  },
  {
    "text": "Haz borrar una foto de Instagram y manda prueba. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Haz tomar un vaso de agua con sal y manda prueba. 🔥",
    "inter": "nope"
  },
  {
    "text": "Escribe un mensaje a tu crush diciéndole 'tengo un secreto'. 🔥",
    "inter": "coffee"
  },
  {
    "text": "Llama a tu ex y dile 'me gustas'. 🔥",
    "inter": "sad"
  },
  {
    "text": "Escribe un mensaje a el admin diciéndole 'te amo'. 🔥",
    "inter": "angry"
  },
  {
    "text": "Haz cantar en la calle y manda prueba. 🔥",
    "inter": "smug"
  },
  {
    "text": "Escribe un mensaje a tu ex diciéndole 'soy un extraterrestre'. 🔥",
    "inter": "laugh"
  },
  {
    "text": "Escribe un mensaje a tu ex diciéndole 'tengo un secreto'. 🔥",
    "inter": "blush"
  },
  {
    "text": "Escribe un mensaje a tu vecin@ diciéndole 'ya no te soporto'. 🔥",
    "inter": "scared"
  },
  {
    "text": "Confiesa qué opinas del grupo en el grupo. 🔥",
    "inter": "shy"
  },
  {
    "text": "Escribe un mensaje a tu crush diciéndole 'adiós para siempre'. 🔥",
    "inter": "peek"
  },
  {
    "text": "Escribe un mensaje a tu mamá diciéndole 'ya no te soporto'. 🔥",
    "inter": "cry"
  },
  {
    "text": "Llama a tu vecin@ y dile 'soy un extraterrestre'. 🔥",
    "inter": "shy"
  },
  {
    "text": "Llama a tu profesor y dile 'estoy embarazad@/voy a ser papá'. 🔥",
    "inter": "sad"
  },
  {
    "text": "Manda un audio cantando reggaeton viejo. 🔥",
    "inter": "peek"
  },
  {
    "text": "Escribe un mensaje a tu jefe diciéndole 'préstame plata'. 🔥",
    "inter": "nope"
  },
  {
    "text": "Escribe un mensaje a tu mejor amig@ diciéndole 'tengo un secreto'. 🔥",
    "inter": "sad"
  },
  {
    "text": "Escribe un mensaje a tu mamá diciéndole 'tengo un secreto'. 🔥",
    "inter": "laugh"
  },
  {
    "text": "Confiesa con quién soñaste en el grupo. 🔥",
    "inter": "happy"
  },
  {
    "text": "Ponte una foto de perfil de Peppa Pig por 24 horas. 🔥",
    "inter": "stare"
  },
  {
    "text": "Llama a tu mamá y dile 'soy un extraterrestre'. 🔥",
    "inter": "happy"
  }
];
    const resp = retos[Math.floor(Math.random() * retos.length)];
    const caption = `🔥 *RETO EXTREMO* 🔥\n\n> ${resp.text}\n\nSi no lo cumples, todo el grupo te va a funar. 💅`;
    
    try {
      const res = await fetch(`https://api.alyacore.xyz/sfw/interaction?inter=${resp.inter}&key=LumiBot-alya`);
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
