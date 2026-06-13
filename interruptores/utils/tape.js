export default {
  command: ['tape', 'confesar', 'secreto', 'chismesito'],
  category: 'utils',
  run: async (client, m, args) => {
    // Limitar solo a mensajes de texto
    const hasMedia = m.message?.imageMessage || m.message?.videoMessage || m.message?.documentMessage || m.message?.audioMessage || m.message?.stickerMessage;
    if (hasMedia) {
      return m.reply('🙄 *Amiga, puro texto por favor.* Cero imágenes, audios o stickers. No queremos virus ni quemarnos los ojos. 💅');
    }

    const text = args.join(' ').trim();
    if (!text) {
      return m.reply('🙄 *Bruh... ¿Y el chisme?* Escribe algo después de .tape, literal no soy adivina. 💅\n> Ejemplo: .tape me comí la torta de la nevera');
    }

    // Lógica de Cooldown (60s)
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
    const lastTape = global.db.data.users[m.sender].lastTapeTime || 0;
    const now = Date.now();
    const cooldown = 60000; // 60 segundos

    if (now - lastTape < cooldown) {
      const remaining = Math.ceil((cooldown - (now - lastTape)) / 1000);
      return m.reply(`✋ *Cálmate fiera.* Estás muy chismos@ y el sistema se satura. Espera *${remaining} segundos* antes de mandar otro chisme. 💅`);
    }

    // Filtro de malas palabras
    const badWords = ['sexo', 'pene', 'vagina', 'puta', 'puto', 'mierda', 'cp', 'porn', 'porno', 'pack', 'nudes', 'violacion', 'gore', 'zorra', 'prostituta', 'verga', 'semen'];
    const lowerText = text.toLowerCase();
    
    // Check if any bad word is exactly matched
    const hasBadWord = badWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerText);
    });

    if (hasBadWord) {
      return m.reply('🤬 *¡Epa!* Ese vocabulario no, amig@. Te bloqueé el mensaje por puerco/a. 💅 (Cero contenido explícito permitido).');
    }

    try {
      // Intentar obtener el ID del canal
      let channelId = '120363169294281316@newsletter'; // Fallback por defecto de LumiBot
      try {
        const metadata = await client.newsletterMetadata("invite", "0029VbDLGOdA89MmnXC2b62Z");
        if (metadata && metadata.id) {
          channelId = metadata.id;
        }
      } catch (err) {
        console.error("Error obteniendo metadata del canal, usando fallback:", err);
      }

      // Enviar al canal
      const mensajeCanal = `☕ *CHISMESITO ANÓNIMO* ☕\n\n📝 "${text}"\n\n> 🤫 _Enviado desde el confesionario de LumiBot_\n\n*Chisme y tape*\nGrupo oficial: https://chat.whatsapp.com/LtKXaxng3L4GdJjYgRoMG1?s=cl&p=a&mlu=4\nConfesionario y bot\n+57 310 6218015\n.tape y su mensaje\n\nCanal \nhttps://whatsapp.com/channel/0029VbDLGOdA89MmnXC2b62Z`;
      
      await client.sendMessage(channelId, { text: mensajeCanal });

      // Actualizar el tiempo del cooldown SOLO si se envió con éxito
      global.db.data.users[m.sender].lastTapeTime = now;

      // Reenviar a todos los grupos en los que está el bot
      const groupsObj = await client.groupFetchAllParticipating().catch(() => ({}));
      const groups = Object.keys(groupsObj);
      
      const broadcastPayload = {
        text: mensajeCanal
      };

      for (const jid of groups) {
        if (!jid.endsWith('@g.us')) continue;
        try {
          await client.sendMessage(jid, broadcastPayload);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay para evitar ban
        } catch (err) {}
      }

      // Confirmar al usuario
      await m.reply('✨ *¡Chisme enviado al canal y reenviado a todos los grupos!* Tu secreto es tendencia mundial ahora mismo 😂 💅.');

    } catch (e) {
      console.error("Error al enviar chisme al canal:", e);
      await m.reply(`🙄 *Bruh, falló el envío.* Capaz me quitaron los permisos de admin en ese canal o algo explotó internamente. 💅\n> Detalles: ${e.message}`);
    }
  }
}
