import axios from "axios"
import FormData from "form-data"

function formatBytes(bytes) {
  if (bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

function generateUniqueFilename(mime) {
  const ext = mime.split("/")[1] || "bin"
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `${id}.${ext}`
}

async function uploadCatbox(buffer, mime) {
  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", buffer, { filename: generateUniqueFilename(mime) })

  const res = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (typeof res.data !== "string" || !res.data.startsWith("https://")) {
    throw new Error("Respuesta inválida del host: " + JSON.stringify(res.data))
  }
  return res.data
}

async function uploadUguu(buffer) {
  const form = new FormData()
  form.append("files[]", buffer, generateUniqueFilename("image/jpeg"))

  const res = await axios.post("https://uguu.se/upload.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  const data = res.data
  const url = data?.files?.[0]?.url
  if (!url) throw new Error("Respuesta inválida del host: " + JSON.stringify(data))
  return url
}

async function uploadQuax(buffer, mime) {
  const form = new FormData()
  form.append("file", buffer, { filename: generateUniqueFilename(mime), contentType: mime })

  const res = await axios.post("https://qu.ax/upload.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  const data = res.data
  if (!data?.files?.[0]?.url) throw new Error("Respuesta inválida del host: " + JSON.stringify(data))
  return data.files[0].url
}

async function uploadAuto(buffer, mime) {
  try {
    return { link: await uploadCatbox(buffer, mime), server: "catbox" }
  } catch {
    try {
      return { link: await uploadUguu(buffer), server: "uguu" }
    } catch {
      return { link: await uploadQuax(buffer, mime), server: "quax" }
    }
  }
}

export default {
  command: ["tourl", "subir", "url"],
  category: "utils",
  run: async (client, m, args, usedPrefix, command) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ""
    
    if (!mime) {
      return m.reply(`╭⋯ ⚠️ *SINTAXIS INCOMPLETA* ⋯》\n┊ Responde a un archivo multimedia para inyectarlo en la nube.\n┊ ⊳ *Uso:* ${usedPrefix + command} [catbox | quax | uguu | auto]\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }

    try {
      await m.react('🕒')
      const media = await q.download()
      if (!media) {
          await m.react('✖️')
          return m.reply(`╭⋯ ❌ *ERROR DE EXTRACCIÓN* ⋯》\n┊ Imposible descargar el archivo original. Verifica que no esté corrupto.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      const serverArg = args[0]?.toLowerCase() || "auto"
      let link, server

      if (serverArg === "catbox") {
        link = await uploadCatbox(media, mime)
        server = "catbox"
      } else if (serverArg === "uguu") {
        link = await uploadUguu(media)
        server = "uguu"
      } else if (serverArg === "quax") {
        link = await uploadQuax(media, mime)
        server = "quax"
      } else {
        const autoRes = await uploadAuto(media, mime)
        link = autoRes.link
        server = autoRes.server
      }

      const caption = `╭⋯ 📡 *ENLACE GENERADO* ⋯》
┊ ⊳ *Nodo Host:* ${server.toUpperCase()}
┊ ⊳ *Peso del paquete:* ${formatBytes(media.length)}
┊ ⊳ *Formato:* ${mime.split("/")[1].toUpperCase() || "BIN"}
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🔗 *URL:* ${link}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { text: caption }, { quoted: m })
      await m.react('✔️')

    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en tourl.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *FALLO DE CONEXIÓN* ⋯》\n┊ Los servidores rechazaron la carga del archivo.\n┊ ⊳ *Detalles:* ${e.message || String(e)}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}
