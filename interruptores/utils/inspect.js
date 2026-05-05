import { getUrlFromDirectPath } from "@whiskeysockets/baileys"
import _ from "lodash"

export default {
  command: ["inspect","inspeccionar"],
  category: "tools",
  run: async (client, m, args, usedPrefix, command, text) => {
    if (!text) return client.reply(m.chat, `╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Requiere una URL válida de grupo, comunidad o canal.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
    
    const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
    const settings = global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net']
    let thumb = settings.icon
    let pp 
    let inviteCode
    
    const MetadataGroupInfo = async (res) => {
      let nameCommunity = ""
      if (res.linkedParent) {
        let linkedGroupMeta = await client.groupMetadata(res.linkedParent).catch(() => null)
        nameCommunity = linkedGroupMeta ? "`Nombre:` " + linkedGroupMeta.subject : ""
      }
      pp = await client.profilePictureUrl(res.id, 'image').catch(() => null)
      inviteCode = await client.groupInviteCode(m.chat).catch(() => null)
      const formatParticipants = (participants) => participants && participants.length > 0 ? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n") : "No encontrado"
      
      let caption = `╭⋯ 📡 *RECONOCIMIENTO TÁCTICO: GRUPO* ⋯》\n\n` +
      `🆔 *Identificador del grupo:*\n${res.id || "No encontrado"}\n\n` +
      `👑 *Creador:*\n${res.owner ? `@${res.owner?.split("@")[0]}` : "No encontrado"} ${res.creation ? `el ${formatDate(res.creation)}` : "(Fecha no encontrada)"}\n\n` +
      `🏷️ *Nombre:*\n${res.subject || "No encontrado"}\n\n` +
      `✏️ *Última modificación de nombre:*\n${res.subjectOwner ? `@${res.subjectOwner?.split("@")[0]}` : "No encontrado"} ${res.subjectTime ? `el ${formatDate(res.subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
      `📄 *Normativas/Descripción:*\n${res.desc || "No encontrado"}\n\n` +
      `📝 *Descripción modificada por:*\n${res.descOwner ? `@${res.descOwner?.split("@")[0]}` : "No encontrado"}\n\n` +
      `🗃️ *ID de descripción:*\n${res.descId || "No encontrado"}\n\n` +
      `🖼️ *Imagen del grupo:*\n${pp ? pp : "No se pudo extraer"}\n\n` +
      `💫 *Autor:*\n${res.author || "No encontrado"}\n\n` +
      `🎫 *Token de invitación:*\n${res.inviteCode || inviteCode || "Revocado/No disponible"}\n\n` +
      `⌛ *Ciclo de mensajes efímeros:*\n${res.ephemeralDuration !== undefined ? `${res.ephemeralDuration} segundos` : "Desactivado"}\n\n` +
      `🛃 *Cadena de Mando (Admins):*\n${formatParticipants(res.participants)}\n\n` +
      `🔰 *Censo de Operativos:*\n${res.size || "Cantidad no encontrada"}\n\n` +
      `✨ *METADATOS AVANZADOS* ✨\n\n🔎 *Nodo principal (Comunidad):*\n${res.linkedParent ? "`Id:` " + res.linkedParent + (nameCommunity ? "\n" + nameCommunity : "") : res.isCommunity ? "Este nodo es una comunidad" : "Nodo independiente"}\n\n` +
      `⚠️ *Restricciones activas:* ${res.restrict ? "✅" : "❌"}\n` +
      `📢 *Modo Anuncio:* ${res.announce ? "✅" : "❌"}\n` +
      `🏘️ *Estructura de Comunidad:* ${res.isCommunity ? "✅" : "❌"}\n` +
      `📯 *Canal de Anuncios de Comunidad:* ${res.isCommunityAnnounce ? "✅" : "❌"}\n` +
      `🤝 *Filtro de Aprobación de Ingreso:* ${res.joinApprovalMode ? "✅" : "❌"}\n` +
      `🆕 *Permisos de adición:* ${res.memberAddMode ? "✅" : "❌"}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n`
      
      return caption.trim()
    }

    const inviteGroupInfo = async (groupData) => {
      const { id, subject, subjectOwner, subjectTime, size, creation, owner, desc, descId, linkedParent, restrict, announce, isCommunity, isCommunityAnnounce, joinApprovalMode } = groupData
      let nameCommunity = ""
      if (linkedParent) {
        let linkedGroupMeta = await client.groupMetadata(linkedParent).catch(() => null)
        nameCommunity = linkedGroupMeta ? "`Nombre:` " + linkedGroupMeta.subject : ""
      }
      pp = await client.profilePictureUrl(id, 'image').catch(() => null)
      const formatParticipants = (participants) => participants && participants.length > 0 ? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n") : "No encontrado"
      
      let caption = `╭⋯ 📡 *RECONOCIMIENTO TÁCTICO: INVITACIÓN* ⋯》\n\n` +
      `🆔 *Identificador del grupo:*\n${id || "No encontrado"}\n\n` +
      `👑 *Creado por:*\n${owner ? `@${owner?.split("@")[0]}` : "No encontrado"} ${creation ? `el ${formatDate(creation)}` : "(Fecha no encontrada)"}\n\n` +
      `🏷️ *Nombre:*\n${subject || "No encontrado"}\n\n` +
      `✏️ *Última modificación de nombre:*\n${subjectOwner ? `@${subjectOwner?.split("@")[0]}` : "No encontrado"} ${subjectTime ? `el ${formatDate(subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
      `📄 *Normativas/Descripción:*\n${desc || "No encontrada"}\n\n` +
      `💠 *ID de descripción:*\n${descId || "No encontrado"}\n\n` +
      `🖼️ *Imagen del grupo:*\n${pp ? pp : "No se pudo extraer"}\n\n` +
      `🏆 *Personal Destacado:*\n${formatParticipants(groupData.participants)}\n\n` +
      `👥 *Censo Total:*\n${size || "Cantidad no encontrada"}\n\n` +
      `✨ *METADATOS AVANZADOS* ✨\n\n🔎 *Nodo principal (Comunidad):*\n${linkedParent ? "`Id:` " + linkedParent + (nameCommunity ? "\n" + nameCommunity : "") : isCommunity ? "Este nodo es una comunidad" : "Nodo independiente"}\n\n` +      
      `📢 *Modo Anuncio:* ${announce ? "✅ Si" : "❌ No"}\n` +
      `🏘️ *Estructura de Comunidad:* ${isCommunity ? "✅ Si" : "❌ No"}\n` +
      `📯 *Canal de Anuncios de Comunidad:* ${isCommunityAnnounce ? "✅" : "❌"}\n` +
      `🤝 *Filtro de Aprobación:* ${joinApprovalMode ? "✅" : "❌"}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
      
      return caption.trim()
    }

    let info
    let res
    let inviteInfo
    try {
      res = text ? null : await client.groupMetadata(m.chat)
      info = await MetadataGroupInfo(res)
    } catch {
      const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]      
      if (inviteUrl) {
        try {
          inviteInfo = await client.groupGetInviteInfo(inviteUrl)
          info = await inviteGroupInfo(inviteInfo)
        } catch (e) {
          m.reply('╭⋯ ❌ *ERROR DE ESCANEO* ⋯》\n┊ Objetivo no encontrado o enlace revocado.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》')
          return
        }
      }
    }

    if (info) {
      const mentions = (res?.participants || inviteInfo?.participants || []).filter(p => p && p.id && (p.admin === "admin" || p.admin === "superadmin" || p.id === (res?.owner || inviteInfo?.owner))).map(p => p.id).filter(id => id && typeof id === 'string' && id.includes('@'))
      
      await client.sendMessage(m.chat, { text: info, contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          title: "🛡️ ESCÁNER DE RED LUMIBOT",
          body: "Operación de Reconocimiento Táctico",
          thumbnailUrl: pp ? pp : thumb,
          sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : "",
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false
        }
      }}, { quoted: m })
      
    } else {
      let newsletterInfo
      if (!channelUrl) return client.reply(m.chat, "╭⋯ ❌ *ERROR DE SINTAXIS* ⋯》\n┊ La URL proporcionada no pertenece a un canal de comunicación válido.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m)
      
      if (channelUrl) {
        try {
          newsletterInfo = await client.newsletterMetadata("invite", channelUrl).catch(() => null)
          if (!newsletterInfo) return client.reply(m.chat, "╭⋯ ❌ *ERROR DE CONEXIÓN* ⋯》\n┊ Imposible extraer datos. El canal no existe o la señal está encriptada.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》", m)
          
          let caption = "╭⋯ 📡 *REPORTE DE INTERCEPCIÓN DE CANAL* ⋯》\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview) + "\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》"
          
          if (newsletterInfo?.preview) {
            pp = getUrlFromDirectPath(newsletterInfo.preview)
          } else {
            pp = thumb
          }
          
          if (channelUrl && newsletterInfo) {
            await client.sendMessage(m.chat, { text: caption, contextInfo: {
              mentionedJid: Array.isArray(client.parseMention(caption)) ? client.parseMention(caption) : [],
              externalAdReply: {
                title: "🛡️ ESCÁNER DE CANALES LUMIBOT",
                body: "Reconocimiento Táctico Completado",
                thumbnailUrl: pp,
                sourceUrl: args[0],
                mediaType: 1,
                showAdAttribution: false,
                renderLargerThumbnail: false
              }
            }}, { quoted: m })
          }
          newsletterInfo.id ? client.sendMessage(m.chat, { text: `[ ID de Base de Datos: ${newsletterInfo.id} ]` }, { quoted: null }) : ''
        } catch (e) {
          console.error("[LUMIBOT DEBUG] Error en inspect.js:", e);
          await m.reply(`╭⋯ ❌ *FALLO CRÍTICO* ⋯》\n┊ El módulo de inspección colapsó.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
        }
      }
    }
  }
}

function formatDate(n, locale = "es", includeTime = true) {
  if (n > 1e12) n = Math.floor(n / 1000)
  else if (n < 1e10) n = Math.floor(n * 1000)
  const date = new Date(n)
  if (isNaN(date)) return "Fecha no válida"
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const formattedDate = date.toLocaleDateString(locale, optionsDate)
  if (!includeTime) return formattedDate
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const period = hours < 12 ? 'AM' : 'PM'
  const formattedTime = `${hours}:${minutes}:${seconds} ${period}`
  return `${formattedDate}, ${formattedTime}`
}

function newsletterKey(key) {
  return _.startCase(key.replace(/_/g, " "))
    .replace("Id", "🆔 Identificador")
    .replace("State", "📌 Estado")
    .replace("Creation Time", "📅 Fecha de creación")
    .replace("Name Time", "✏️ Fecha de modificación del nombre")
    .replace("Name", "🏷️ Nombre")
    .replace("Description Time", "📝 Fecha de modificación de la descripción")
    .replace("Description", "📜 Descripción")
    .replace("Invite", "📩 Protocolo de Invitación")
    .replace("Handle", "👤 Alias Operativo")
    .replace("Picture", "🖼️ Evidencia Visual")
    .replace("Preview", "👀 Vista previa")
    .replace("Reaction Codes", "😃 Reacciones")
    .replace("Subscribers", "👥 Reclutas (Suscriptores)")
    .replace("Verification", "✅ Estatus de Verificación")
    .replace("Viewer Metadata", "🔍 Datos avanzados")
}

function formatValue(key, value, preview) {
  switch (key) {
    case "subscribers":
      return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Base de datos vacía"
    case "creation_time":
    case "nameTime":
    case "descriptionTime":
      return formatDate(value)
    case "description": 
    case "name":
      return value || "Clasificado / Sin información"
    case "state":
      switch (value) {
        case "ACTIVE": return "En Línea (Activo)"
        case "GEOSUSPENDED": return "Bloqueo Regional"
        case "SUSPENDED": return "Dado de Baja (Suspendido)"
        default: return "Desconocido"
      }
    case "reaction_codes":
      switch (value) {
        case "ALL": return "Abierto a interacciones"
        case "BASIC": return "Interacciones limitadas"
        case "NONE": return "Canal de solo lectura"
        default: return "Desconocido"
      }
    case "verification":
      switch (value) {
        case "VERIFIED": return "Autenticado"
        case "UNVERIFIED": return "No seguro (Sin verificar)"
        default: return "Desconocido"
      }
    case "mute":
      switch (value) {
        case "ON": return "Intercomunicador silenciado"
        case "OFF": return "Intercomunicador abierto"
        case "UNDEFINED": return "Sin definir"
        default: return "Desconocido"
      }
    case "view_role":
      switch (value) {
        case "ADMIN": return "Comandante (Admin)"
        case "OWNER": return "Comandante en Jefe (Owner)"
        case "SUBSCRIBER": return "Tropa (Suscriptor)"
        case "GUEST": return "Civil (Invitado)"
        default: return "Desconocido"
      }
    case "picture":
      if (preview) return getUrlFromDirectPath(preview)
      else return "Datos visuales corruptos"
    default:
      return value !== null && value !== undefined ? value.toString() : "Clasificado"
  }
}

function processObject(obj, prefix = "", preview) {
  let caption = ""
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length > 0) {
        const sectionName = newsletterKey(prefix + key)
        caption += `\n*\`${sectionName}\`*\n`
        caption += processObject(value, `${prefix}${key}_`)
      }
    } else {
      const shortKey = prefix ? prefix.split("_").pop() + "_" + key : key
      const displayValue = formatValue(shortKey, value, preview)
      const translatedKey = newsletterKey(shortKey)
      caption += `┊ ⊳ *${translatedKey}:*\n┊ ${displayValue}\n`
    }
  })
  return caption
}
