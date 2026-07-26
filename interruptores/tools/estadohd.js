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
        } catch (e) {
            console.error('[LUMIBOT ERROR] En estadohd.js:', e);
            await m.reply(`> Ocurrió un error inesperado ejecutando el comando *${usedPrefix + command}*.\n> [Error: *${e.message}*]`);
        }
    }
}
