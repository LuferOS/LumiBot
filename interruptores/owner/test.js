import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

export default {
  command: ['test', 'sistemtest', 'vitalidad'],
  description: 'Ejecuta un diagnóstico completo del sistema (Base de datos, Módulos, APIs, Estrés).',
  category: 'owner',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      // 1. Verificación de permisos estrictos
      const senderNumber = m.sender.split('@')[0];
      const botNumber = client.user.id.split(':')[0];
      const allowedNumbers = ['573118353868', botNumber]; // Dueño + Bot
      
      if (!allowedNumbers.includes(senderNumber)) {
        return m.reply(`╭⋯ 🚫 *ACCESO DENEGADO* ⋯》\n┊ Este comando es ultra confidencial.\n┊ Solo el Comandante Supremo (LuferOS) o la propia Queen pueden usarlo.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }

      await m.react('⏳');
      const startTotal = Date.now();

      // 2. Test de Base de Datos (Read/Write)
      let dbStatus = "⚠️ Inactiva/JSON";
      let dbTime = 0;
      if (global.sqlDb) {
        const startDb = Date.now();
        await new Promise((resolve) => {
          global.sqlDb.run("CREATE TABLE IF NOT EXISTS sys_test_table (id INTEGER PRIMARY KEY, val TEXT)", () => {
            global.sqlDb.run("INSERT INTO sys_test_table (val) VALUES (?)", ["test_ping"], function(err) {
              if (err) {
                 dbStatus = "❌ Fallo en Escritura";
                 return resolve();
              }
              const testId = this.lastID;
              global.sqlDb.get("SELECT val FROM sys_test_table WHERE id = ?", [testId], (err, row) => {
                  if (err || !row) dbStatus = "❌ Fallo en Lectura";
                  else {
                      global.sqlDb.run("DELETE FROM sys_test_table WHERE id = ?", [testId], () => {
                          dbTime = Date.now() - startDb;
                          dbStatus = "✅ Óptimo";
                          resolve();
                      });
                  }
              });
            });
          });
        });
      }

      // 3. Escaneo de Módulos (Plugins)
      const getJsFilesCount = (dir) => {
        let results = 0;
        if (!fs.existsSync(dir)) return 0;
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) { 
                results += getJsFilesCount(fullPath);
            } else if (file.endsWith('.js')) {
                results++;
            }
        });
        return results;
      };

      const pluginsDir = path.resolve('./interruptores');
      const totalMods = getJsFilesCount(pluginsDir);
      const onlineMods = Object.keys(global.plugins || {}).length;
      // Puede haber archivos js que no son comandos per se (ej. utilidades).
      // Se estima que los failed son aquellos que causaron un try-catch al cargar, pero
      // global.plugins solo tiene los cargados correctamente.
      const failedMods = Math.max(0, totalMods - onlineMods);

      // 4. Test de APIs
      let apiStatus = "❌ Caída";
      let apiPing = 0;
      try {
        const startApi = Date.now();
        const res = await fetch(`https://api.alyacore.xyz/ai/gptprompt?text=hola&prompt=test&key=LumiBot-alya`, { timeout: 5000 });
        if (res.ok) {
            apiPing = Date.now() - startApi;
            apiStatus = "✅ Operativa";
        }
      } catch (e) {
          apiStatus = "❌ Error de conexión";
      }

      // 5. Test de Estrés de CPU (100ms)
      const startStress = Date.now();
      let ops = 0;
      while (Date.now() - startStress < 100) {
        Math.sqrt(Math.random() * 1000);
        ops++;
      }
      const stressStatus = ops > 500000 ? "✅ Excelente" : (ops > 100000 ? "⚠️ Medio" : "❌ Pobre");

      // 6. Cálculo de Vitalidad
      let vitality = 100;
      if (dbTime > 50) vitality -= 5;
      if (dbTime > 200) vitality -= 15;
      if (dbStatus.includes("Fallo")) vitality -= 40;
      
      if (apiPing > 1000) vitality -= 10;
      if (apiStatus.includes("Caída") || apiStatus.includes("Error")) vitality -= 20;
      
      // Restamos 1% por cada módulo no cargado o "fallido"
      if (failedMods > 0) vitality -= Math.min(15, failedMods * 1);
      
      if (ops < 500000) vitality -= 5;
      if (ops < 100000) vitality -= 15;

      vitality = Math.max(0, Math.min(100, Math.floor(vitality)));

      // 7. Recomendación
      let recommendation = "";
      if (vitality >= 90) recommendation = "✨ Sistema en condiciones óptimas. La Queen está brillando.";
      else if (vitality >= 70) recommendation = "👍 Rendimiento aceptable, aunque podría mejorar revisando latencias o módulos inactivos.";
      else if (vitality >= 50) recommendation = "⚠️ Rendimiento subóptimo. Se sugiere revisar errores en módulos o conexión a la base de datos.";
      else recommendation = "🚨 SISTEMA INESTABLE. Se recomienda un reinicio preventivo o purga de caché profunda.";

      const totalMs = Date.now() - startTotal;

      const report = `╭⋯ 🔬 *DIAGNÓSTICO DEL SISTEMA* ⋯》
┊ ⊳ *Vitalidad de la Queen:* ${vitality}%
┊
┊ 💾 *Prueba de Base de Datos (R/W)*
┊ • Estado: ${dbStatus}
┊ • Latencia: ${dbTime} ms
┊
┊ 📦 *Estado de Módulos (Plugins)*
┊ • Total detectados: ${totalMods}
┊ • Operativos (Online): ${onlineMods}
┊ • En conflicto (Failed/Utils): ${failedMods}
┊
┊ 🌐 *Prueba de Conexión (APIs)*
┊ • Estado AlyaCore: ${apiStatus}
┊ • Latencia Ping: ${apiPing > 0 ? apiPing + ' ms' : 'N/A'}
┊
┊ 🚀 *Prueba de Estrés (CPU)*
┊ • Operaciones en 100ms: ${ops.toLocaleString()}
┊ • Rendimiento: ${stressStatus}
┊
┊ 💡 *Recomendación:*
┊ ${recommendation}
┊
┊ ⏱️ *Tiempo total de test:* ${totalMs} ms
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`;

      await m.reply(report);
      await m.react('✔️');

    } catch (err) {
      console.error("[LUMIBOT DEBUG] Error en comando .test:", err);
      m.reply(`╭⋯ ⚠️ *ERROR DE DIVA* ⋯》\n┊ El test ha colapsado críticamente.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
  }
}
