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
            
            const jidList = [m.sender, client.user.id.split(':')[0] + '@s.whatsapp.net'];
            
            if (/video/.test(mime)) {
                await client.sendMessage('status@broadcast', { 
                    video: buffer, 
                    caption: '🚀 *Video HD Procesado por LumiBot*\n> Toca "Reenviar" para subirlo a tu estado.', 
                    mimetype: 'video/mp4' 
                }, { statusJidList: jidList });
            } else if (/image/.test(mime)) {
                await client.sendMessage('status@broadcast', { 
                    image: buffer, 
                    caption: '🚀 *Imagen HD Procesada por LumiBot*\n> Toca "Reenviar" para subirla a tu estado.', 
                    mimetype: 'image/jpeg' 
                }, { statusJidList: jidList });
            }
            
            await m.reply('✅ *¡Listo!* Lo he subido a mi Estado de WhatsApp.\n\nVe a la pestaña de Estados, mira mi estado más reciente y toca el botón de "Reenviar" o "Compartir" para subirlo a tu propio estado sin perder calidad. 🚀');
        } catch (e) {
            console.error('[LUMIBOT ERROR] En estadohd.js:', e);
            await m.reply(`> Ocurrió un error inesperado ejecutando el comando *${usedPrefix + command}*.\n> [Error: *${e.message}*]`);
        }
    }
}
