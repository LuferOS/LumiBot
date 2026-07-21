import fetch from 'node-fetch'
import { search, download } from 'aptoide-scraper'

const ALYA_APK_SEARCH = 'https://api.alyacore.xyz/search/apk'
// ⚡ LUMIBOT OVERRIDE: Clave ASCII ofuscada desencriptada (DEPOOL-key60015). Usaremos su cuota de API gratis.
const ALYA_KEY = process.env.ALYA_KEY || 'DEPOOL-key60015' 

export default {
  command: ['apk', 'aptoide', 'apkdl'],
  category: 'download',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args || !args.length) {
      return m.reply(`╭⋯ ❌ *LUMIBOT - SINTAXIS* ⋯》\n┊ Ingrese el identificador del paquete o nombre de la app.\n┊ Ejemplo: *${usedPrefix}${command} whatsapp*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
    
    await m.react('🕒')
    
    const query = args.join(' ').trim()
    try {
      const apkInfo = await resolveApkInfo(query)
      if (!apkInfo) {
        await m.react('✖️')
        return m.reply(`╭⋯ ❌ *BÚSQUEDA FALLIDA* ⋯》\n┊ No se encontraron binarios para: *${query}*.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      const { name, package: id, size, downloadUrl, lastup, source } = apkInfo
      const caption = `╭⋯ 📦 *EXTRACCIÓN DE BINARIO* ⋯》
┊ ⊳ *Objetivo:* ${name}
┊ ⊳ *ID Paquete:* ${id}
┊ ⊳ *Compilación:* ${lastup}
┊ ⊳ *Peso:* ${size}
┊ ⊳ *Origen:* ${source}
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
> 🛡️ *Powered by LuferOS Security*`

      const sizeBytes = parseSize(size)
      if (sizeBytes > 524288000) {
        await m.react('✖️')
        return m.reply(`╭⋯ ⚠️ *LÍMITE EXCEDIDO* ⋯》\n┊ El binario supera los 500MB de seguridad.\n┊ ⊳ *Enlace directo:* ${downloadUrl}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }
      
      await client.sendMessage(m.chat, { document: { url: downloadUrl }, mimetype: 'application/vnd.android.package-archive', fileName: `${name}.apk`, caption }, { quoted: m })
      await m.react('✔️')
      
     } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en apk.js:", e);
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *ERROR DE EXTRACCIÓN* ⋯》\n┊ Falla en la inyección de datos de la app.\n┊ Detalles: ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  },
}

async function resolveApkInfo(query) {
  const alyaResults = await searchAlyaApk(query)

  if (alyaResults.length) {
    const top = alyaResults[0]

    if (top.downloadUrl) {
      return {
        name: top.name || query,
        package: top.package || 'N/A',
        size: top.size || 'Desconocido',
        downloadUrl: top.downloadUrl,
        lastup: top.lastup || 'Desconocida',
        source: 'AlyaCore',
      }
    }

    if (top.package) {
      try {
        const apt = await download(top.package)
        if (apt?.dllink) return normalizeAptoideData(apt)
      } catch {}
    }
  }

  try {
    const searchA = await search(query)
    if (!searchA || searchA.length === 0) return null

    const apt = await download(searchA[0].id)
    if (!apt?.dllink) return null

    return normalizeAptoideData(apt)
  } catch (e) {
    return null
  }
}

function normalizeAptoideData(apkInfo = {}) {
  return {
    name: apkInfo.name || 'Sin nombre',
    package: apkInfo.package || apkInfo.id || 'N/A',
    size: apkInfo.size || 'Desconocido',
    downloadUrl: apkInfo.dllink || apkInfo.download || apkInfo.url || '',
    lastup: apkInfo.lastup || apkInfo.updated || 'Desconocida',
    source: 'Aptoide',
  }
}

async function searchAlyaApk(query = '') {
  try {
    const url = `${ALYA_APK_SEARCH}?query=${encodeURIComponent(query)}&key=${encodeURIComponent(ALYA_KEY)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    })
    if (!res.ok) return []

    const json = await res.json()
    const raw =
      (Array.isArray(json?.data) && json.data) ||
      (Array.isArray(json?.result) && json.result) ||
      (Array.isArray(json?.results) && json.results) ||
      (Array.isArray(json?.data?.results) && json.data.results) ||
      []

    return raw
      .map((item) => {
        if (typeof item === 'string') {
          return {
            name: item,
            package: '',
            size: '',
            downloadUrl: '',
            lastup: '',
          }
        }

        return {
          name: item?.name || item?.title || item?.app_name || item?.appName || '',
          package: item?.package || item?.package_name || item?.id || item?.appId || item?.pkg || '',
          size: item?.size || item?.file_size || item?.filesize || '',
          downloadUrl: item?.download || item?.dllink || item?.dl || item?.url || item?.link || '',
          lastup: item?.lastup || item?.updated || item?.last_update || item?.update || '',
        }
      })
      .filter((x) => x.name || x.package || x.downloadUrl)
  } catch {
    return []
  }
}

function parseSize(sizeStr) {
  if (!sizeStr) return 0
  const parts = sizeStr.trim().toUpperCase().split(' ')
  const value = parseFloat(parts[0])
  const unit = parts[1] || 'B'
  switch (unit) {
    case 'KB': return value * 1024
    case 'MB': return value * 1024 * 1024
    case 'GB': return value * 1024 * 1024 * 1024
    default: return value
  }
}
