import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import moment from 'moment-timezone';
import os from 'os';
import http from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';
import { getMarkovMessageCount } from './markov_db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// CPU Load calculator
let previousCpu = os.cpus();
function getCpuLoad() {
  const currentCpu = os.cpus();
  let idleDifference = 0;
  let totalDifference = 0;
  for (let i = 0; i < currentCpu.length; i++) {
    const prev = previousCpu[i].times;
    const curr = currentCpu[i].times;
    idleDifference += curr.idle - prev.idle;
    for (let type in curr) {
      totalDifference += curr[type] - prev[type];
    }
  }
  previousCpu = currentCpu;
  if (totalDifference === 0) return 0;
  return 100 - ~~(100 * idleDifference / totalDifference);
}

export function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const PORT = 3000;

  // Global socket io for traffic emitting from index.js
  global.dashboardIo = io;

  // Servir archivos estáticos del panel web
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));
  app.use(express.json());

  // === ENDPOINTS DE ESTADÍSTICAS ===
  app.get('/api/stats', async (req, res) => {
    try {
      const db = global.db?.data || {};
      const usersCount = db.users ? Object.keys(db.users).length : 0;
      const chatsCount = db.chats ? Object.keys(db.chats).length : 0;
      
      const uptimeMs = global.client?.uptime ? Date.now() - global.client.uptime : 0;
      const uptime = moment.utc(uptimeMs).format('HH:mm:ss');
      
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const usedMemory = totalMemory - freeMemory;
      const ramUsagePct = ((usedMemory / totalMemory) * 100).toFixed(2);
      
      const cpuLoad = getCpuLoad();
      const markovCount = await getMarkovMessageCount().catch(() => 0);
      const isConnected = global.client?.ws?.isOpen ? true : false;
      
      res.json({
        status: isConnected ? 'online' : 'offline',
        uptime: uptime,
        users: usersCount,
        chats: chatsCount,
        hardware: { cpuLoad, ramUsagePct },
        markov: { messages: markovCount }
      });
    } catch (e) {
      res.status(500).json({ error: 'Fallo interno' });
    }
  });

  // === ENDPOINTS DE SISTEMA DE ARCHIVOS ===
  app.get('/api/fs/list', (req, res) => {
    const targetPath = path.join(rootDir, req.query.path || '');
    if (!targetPath.startsWith(rootDir)) return res.status(403).json({error: 'Acceso denegado'});
    try {
      const items = fs.readdirSync(targetPath, { withFileTypes: true });
      const result = items.map(item => ({
        name: item.name,
        isDirectory: item.isDirectory(),
        path: path.relative(rootDir, path.join(targetPath, item.name))
      }));
      // Ordenar: carpetas primero
      result.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/fs/read', (req, res) => {
    const targetPath = path.join(rootDir, req.query.path || '');
    if (!targetPath.startsWith(rootDir)) return res.status(403).json({error: 'Acceso denegado'});
    try {
      const content = fs.readFileSync(targetPath, 'utf8');
      res.send(content);
    } catch (e) {
      res.status(500).send('Error leyendo archivo');
    }
  });

  app.post('/api/fs/write', (req, res) => {
    const targetPath = path.join(rootDir, req.body.path || '');
    if (!targetPath.startsWith(rootDir)) return res.status(403).json({error: 'Acceso denegado'});
    try {
      fs.writeFileSync(targetPath, req.body.content, 'utf8');
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // === WEBSOCKETS (TERMINAL & TRÁFICO) ===
  io.on('connection', (socket) => {
    console.log(chalk.gray(`[+] Cliente WebOS conectado: ${socket.id}`));
    
    // Ejecución de comandos de Terminal
    socket.on('terminal_cmd', (cmd) => {
      exec(cmd, { cwd: rootDir }, (error, stdout, stderr) => {
        let output = '';
        if (error) output += `Error: ${error.message}\n`;
        if (stderr) output += `${stderr}\n`;
        if (stdout) output += `${stdout}\n`;
        socket.emit('terminal_out', output || '\n');
      });
    });
  });

  server.listen(PORT, () => {
    console.log(chalk.bold.green(`\n╭⋯ 🌐 WEB OS DATACENTER INICIADO ⋯》`));
    console.log(chalk.green(`┊ Acceso Local: ${chalk.whiteBright(`http://localhost:${PORT}`)}`));
    console.log(chalk.bold.green(`╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n`));
  });
}
