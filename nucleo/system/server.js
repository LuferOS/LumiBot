import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import moment from 'moment-timezone';
import os from 'os';
import { getMarkovMessageCount } from './markov_db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const PORT = 3000;

  // Servir archivos estáticos del panel web
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));

  // Endpoint de estadísticas en tiempo real
  app.get('/api/stats', async (req, res) => {
    try {
      const db = global.db?.data || {};
      const usersCount = db.users ? Object.keys(db.users).length : 0;
      const chatsCount = db.chats ? Object.keys(db.chats).length : 0;
      
      const uptimeMs = global.client?.uptime ? Date.now() - global.client.uptime : 0;
      const uptime = moment.utc(uptimeMs).format('HH:mm:ss');
      
      // RAM Metrics
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const usedMemory = totalMemory - freeMemory;
      const ramUsagePct = ((usedMemory / totalMemory) * 100).toFixed(2);
      const usedGb = (usedMemory / 1024 / 1024 / 1024).toFixed(2);
      const totalGb = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
      
      // CPU Metrics
      const cpuLoad = getCpuLoad();
      const cpuModel = os.cpus()[0]?.model || 'Unknown CPU';
      const osPlatform = os.platform() + ' ' + os.arch();
      const nodeVersion = process.version;
      
      // Markov DB Size
      let markovSizeMb = 0;
      const dbPath = path.resolve(__dirname, '../../lumi_markov.db');
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        markovSizeMb = (stats.size / 1024 / 1024).toFixed(2);
      }
      const markovCount = await getMarkovMessageCount().catch(() => 0);
      
      // Connection Status
      const isConnected = global.client?.ws?.isOpen ? true : false;
      
      res.json({
        status: isConnected ? 'online' : 'offline',
        uptime: uptime,
        users: usersCount,
        chats: chatsCount,
        
        hardware: {
          cpuLoad: cpuLoad,
          cpuModel: cpuModel,
          ramUsagePct: ramUsagePct,
          usedGb: usedGb,
          totalGb: totalGb,
          os: osPlatform,
          node: nodeVersion
        },
        
        markov: {
          messages: markovCount,
          sizeMb: markovSizeMb
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Fallo al obtener datos internos' });
    }
  });

  app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`\n╭⋯ 🌐 SERVIDOR DASHBOARD INICIADO ⋯》`));
    console.log(chalk.cyan(`┊ Panel Web Activo: ${chalk.whiteBright(`http://localhost:${PORT}`)}`));
    console.log(chalk.bold.cyan(`╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n`));
  });
}
