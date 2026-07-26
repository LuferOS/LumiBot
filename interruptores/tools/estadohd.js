export default {
    command: ['estadohd', 'waenhancer', 'hdenhancer'],
    category: 'herramientas',
    run: async (client, m, args, usedPrefix, command) => {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (!mime) {
            return await m.reply(`📸 Responde a un archivo de documento (imagen o video) con el comando *${usedPrefix + command}* para convertirlo a formato multimedia normal en alta calidad (estilo WA Enhancer).`);
        }
        
        if (!/image|video/.test(mime)) {
            return await m.reply(`❌ El archivo no parece ser una imagen o video válido. Mimetype detectado: ${mime}`);
        }
        
        try {
            await m.reply('⏳ *Procesando archivo en máxima calidad para tus estados...*\nPor favor, espera un momento.');
            const buffer = await quoted.download();
            
            const isOwner = global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender) || m.sender.startsWith('573118353868');
            const jidList = Object.keys(global.db.data.users).filter(jid => jid.endsWith('@s.whatsapp.net'));
            
            if (isOwner) {
                // Owner: Enviar al estado y al chat actual
                if (/video/.test(mime)) {
                    await client.sendMessage('status@broadcast', { 
                        video: buffer, 
                        caption: '🚀 *Video HD Procesado por LumiBot*\n> Toca "Reenviar" para subirlo a tu estado.', 
                        mimetype: 'video/mp4',
                        contextInfo: { isForwarded: true, forwardingScore: 1 }
                    }, { statusJidList: jidList });
                    
                    await client.sendMessage(m.chat, { 
                        video: buffer, 
                        caption: '🚀 *Video HD Procesado*\n> Reenvía este mensaje directamente a tu estado de WhatsApp para mantener la calidad original.', 
                        mimetype: 'video/mp4' 
                    }, { quoted: m });
                } else if (/image/.test(mime)) {
                    await client.sendMessage('status@broadcast', { 
                        image: buffer, 
                        caption: '🚀 *Imagen HD Procesada por LumiBot*\n> Toca "Reenviar" para subirla a tu estado.', 
                        mimetype: 'image/jpeg',
                        contextInfo: { isForwarded: true, forwardingScore: 1 }
                    }, { statusJidList: jidList });
                    
                    await client.sendMessage(m.chat, { 
                        image: buffer, 
                        caption: '🚀 *Imagen HD Procesada*\n> Reenvía este mensaje directamente a tu estado de WhatsApp para mantener la calidad original.', 
                        mimetype: 'image/jpeg' 
                    }, { quoted: m });
                }
                await m.reply('✅ *¡Listo, mi creador!* Lo he subido a mi Estado de WhatsApp para ti y también te lo envié por aquí.');
            } else {
                // Usuario normal: Enviar solo al chat
                if (/video/.test(mime)) {
                    await client.sendMessage(m.chat, { 
                        video: buffer, 
                        caption: '🚀 *Video HD Procesado*\n> Reenvía este mensaje directamente a tu estado de WhatsApp para mantener la calidad original.', 
                        mimetype: 'video/mp4' 
                    }, { quoted: m });
                } else if (/image/.test(mime)) {
                    await client.sendMessage(m.chat, { 
                        image: buffer, 
                        caption: '🚀 *Imagen HD Procesada*\n> Reenvía este mensaje directamente a tu estado de WhatsApp para mantener la calidad original.', 
                        mimetype: 'image/jpeg' 
                    }, { quoted: m });
                }
            }
        } catch (e) {
            console.error('[LUMIBOT ERROR] En estadohd.js:', e);
            await m.reply(`> Ocurrió un error inesperado ejecutando el comando *${usedPrefix + command}*.\n> [Error: *${e.message}*]`);
        }
    }
}
