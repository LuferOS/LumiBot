// 📂 MEMORIA TÁCTICA GLOBAL
global.suboficialEnTurno = global.suboficialEnTurno || null

// 🕒 GENERADOR DE FECHA (Hora de Colombia)
const obtenerFechaBogota = () => {
    return new Intl.DateTimeFormat('es-CO', { 
        timeZone: 'America/Bogota', 
        day: 'numeric', 
        month: 'long' 
    }).format(new Date());
}

export default {
    command: ['add', 'addoficial', 'suboficial'],
    category: 'grupo',
    run: async (client, m, args = [], usedPrefix = '.', command = 'add') => {
        
        if (!m.isGroup) return m.reply("Comandante, los comandos de ingreso solo operan dentro de grupos.")
        
        const accion = command.toLowerCase()

        // 📋 CONSULTAR SUBOFICIAL DE SERVICIO ACTUAL
        if (accion === 'suboficial') {
            if (!global.suboficialEnTurno) return m.reply("Negativo. No hay ningún Suboficial de Servicio registrado.")
            
            const sub = global.suboficialEnTurno
            return m.reply(`╭⋯ 🚨 *SUBOFICIAL DE SERVICIO* ⋯》\n┊ ⊳ *Rango/Nombre:* ${sub.nombre}\n┊ ⊳ *Contacto:* @${sub.numero}\n┊ ⊳ *Fecha de turno:* ${sub.fecha}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, null, { mentions: [`${sub.numero}@s.whatsapp.net`] })
        }

        if (args.length < 2) return m.reply(`Faltan datos. Uso correcto:\n*${usedPrefix}${command} [Número] [Nombre]*`)

        // 🧹 Limpieza y normalización del número
        let numeroObjetivo = args[0].replace(/[^0-9]/g, '')
        if (numeroObjetivo.length === 10 && numeroObjetivo.startsWith('3')) numeroObjetivo = '57' + numeroObjetivo
        
        const jid = `${numeroObjetivo}@s.whatsapp.net`
        const nombreNuevo = args.slice(1).join(' ').toUpperCase()

        try {
            // 🔍 ESCANEO DEL PERÍMETRO: Verificar si ya está en el grupo
            const groupMetadata = await client.groupMetadata(m.chat)
            const isParticipant = groupMetadata.participants.some(p => p.id === jid)

            // Si no está, intentamos agregarlo a la fuerza
            if (!isParticipant) {
                m.reply(`⏳ Ejecutando orden de adición directa para: ${nombreNuevo}...`)
                await client.groupParticipantsUpdate(m.chat, [jid], 'add')
            }

            // 🌟 PROCESO PARA SUBOFICIAL DE SERVICIO
            if (accion === 'addoficial') {
                const fechaActual = obtenerFechaBogota()
                global.suboficialEnTurno = { numero: numeroObjetivo, nombre: nombreNuevo, fecha: fechaActual }
                
                // Si ya estaba adentro, le ponemos un pequeño aviso táctico
                const avisoExtra = isParticipant ? " *(Reasignado internamente)*" : ""
                
                const texto = `╭⋯ 🚨 *RELEVO DE MANDO: SUBOFICIAL DE SERVICIO* ⋯》\n┊ ⊳ *Personal:* ${nombreNuevo}${avisoExtra}\n┊ ⊳ *Contacto:* @${numeroObjetivo}\n┊ ⊳ *Fecha:* ${fechaActual}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> .`
                
                return client.sendMessage(m.chat, { text: texto, mentions: [jid] })
            } 
            
            // 👤 PROCESO PARA USUARIO NORMAL
            if (accion === 'add') {
                if (isParticipant) return m.reply("El usuario ya se encuentra en la base. No se requiere adición.")
                
                const texto = `╭⋯ 👋 *NUEVO INGRESO* ⋯》\n┊ ⊳ *Usuario:* ${nombreNuevo}\n┊ ⊳ *Contacto:* @${numeroObjetivo}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> Bienvenido/a al grupo.`
                return client.sendMessage(m.chat, { text: texto, mentions: [jid] })
            }

        } catch (error) {
            console.error("[❌ ADD ERROR]", error)
            return m.reply("❌ Operación fallida. El bot debe ser Administrador y el usuario debe tener permitida la adición directa en su configuración de privacidad.")
        }
    }
}
