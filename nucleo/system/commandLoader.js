import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.comandos = new Map();
global.plugins = {};
const pluginCache = new Map();
const commandsFolder = path.join(__dirname, "../../interruptores");

// ⚡ LUMIBOT OVERRIDE: Motor de Verificación de Integridad Táctica
function verifyIntegrity(comando, pluginName) {
  if (!comando) {
    throw new Error("Estructura vacía o exportación 'default' ausente.");
  }
  if (!comando.command || !Array.isArray(comando.command) || comando.command.length === 0) {
    throw new Error("Matriz de directivas (command: []) inválida, vacía o no definida.");
  }
  if (typeof comando.run !== "function") {
    throw new Error("Motor de ejecución principal (run: async...) corrupto o ausente.");
  }
  if (comando.category && typeof comando.category !== "string") {
    throw new Error("Parámetro de categoría con formato incorrecto.");
  }
  return true; // Pasa la prueba de ejecución estructural
}

async function seeCommands(dir = commandsFolder) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  for (const fileOrFolder of items) {
    const fullPath = path.join(dir, fileOrFolder);
    
    if (fs.lstatSync(fullPath).isDirectory()) {
      await seeCommands(fullPath);
      continue;
    }
    
    if (!fileOrFolder.endsWith(".js")) continue;
    
    try {
      const mtime = fs.statSync(fullPath).mtimeMs;
      const cached = pluginCache.get(fullPath);
      let imported;
      
      if (cached && cached.mtime === mtime) {
        imported = cached.imported;
      } else {
        const modulePath = `${path.resolve(fullPath)}?update=${Date.now()}`;
        imported = await import(modulePath);
        pluginCache.set(fullPath, { mtime, imported });
      }
      
      const comando = imported.default;
      const pluginName = fileOrFolder.replace(".js", "");
      
      // ⚡ LUMIBOT OVERRIDE: Ejecutar prueba de verificación antes de registrar
      verifyIntegrity(comando, pluginName);
      
      global.plugins[pluginName] = imported;
      
      comando.command.forEach(cmd => {
        global.comandos.set(cmd.toLowerCase(), {
          pluginName,
          run: comando.run,
          category: comando.category || "uncategorized",
          isOwner: comando.isOwner || false,
          isAdmin: comando.isAdmin || false,
          botAdmin: comando.botAdmin || false,
          before: imported.before || null,
          after: imported.after || null,
          info: comando.info || {}
        });
      });
    } catch (e) {
      console.error(chalk.red(`[🛡️ LUMIBOT SECURITY] ⚠ Amenaza/Error detectado en módulo [${fileOrFolder}]:`), chalk.yellow(e.message));
    }
  }
}

const debounceMap = new Map();
global.reload = async (_ev, fullPath) => {
  if (!fullPath.endsWith(".js")) return;
  if (debounceMap.has(fullPath)) clearTimeout(debounceMap.get(fullPath));
  
  debounceMap.set(fullPath, setTimeout(async () => {
    debounceMap.delete(fullPath);
    const filename = path.basename(fullPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(chalk.yellow(`[🛡️ LUMIBOT] ⚠ Módulo neutralizado/eliminado: ${filename}`));
      pluginCache.delete(fullPath);
      const pluginName = filename.replace(".js", "");
      for (const [cmd, data] of global.comandos.entries()) {
        if (data.pluginName === pluginName) global.comandos.delete(cmd);
      }
      delete global.plugins[pluginName];
      return;
    }
    
    try {
      const mtime = fs.statSync(fullPath).mtimeMs;
      const cached = pluginCache.get(fullPath);
      if (cached && cached.mtime === mtime) {
        return; // Silenciamos el log de "Sin cambios" para no hacer spam en consola
      }
      
      const modulePath = `${fullPath}?update=${Date.now()}`;
      const imported = await import(modulePath);
      const pluginName = filename.replace(".js", "");
      const comando = imported.default;
      
      // ⚡ LUMIBOT OVERRIDE: Verificación en caliente (Hot-Reload)
      verifyIntegrity(comando, pluginName);
      
      pluginCache.set(fullPath, { mtime, imported });
      
      for (const [cmd, data] of global.comandos.entries()) {
        if (data.pluginName === pluginName) global.comandos.delete(cmd);
      }
      
      global.plugins[pluginName] = imported;
      
      const cmds = Array.isArray(comando.command) ? comando.command : [comando.command];
      cmds.forEach(cmd => {
        if (cmd) global.comandos.set(cmd.toLowerCase(), {
          pluginName,
          run: comando.run,
          category: comando.category || "uncategorized",
          isOwner: comando.isOwner || false,
          isAdmin: comando.isAdmin || false,
          botAdmin: comando.botAdmin || false,
          before: imported.before || null,
          after: imported.after || null,
          info: comando.info || {}
        });
      });
      
      console.log(chalk.cyan(`[🛡️ LUMIBOT] ✓ Módulo verificado y recargado: ${filename}`));
    } catch (e) {
      console.error(chalk.red(`[🛡️ LUMIBOT SECURITY] ⚠ Módulo [${filename}] rechazado en recarga:\n`), chalk.yellow(e.message));
    }
  }, 300));
};

Object.freeze(global.reload);
const watchers = [];

function startWatcher() {
  for (const w of watchers) { try { w.close(); } catch {} }
  watchers.length = 0;
  
  function watchDir(dir) {
    if (!fs.existsSync(dir)) return;
    try {
      const w = fs.watch(dir, (event, filename) => {
        if (filename && filename.endsWith('.js')) global.reload(event, path.join(dir, filename));
      });
      watchers.push(w);
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.lstatSync(full).isDirectory()) watchDir(full);
      }
    } catch {}
  }
  watchDir(commandsFolder);
}

startWatcher();

export default seeCommands;
