import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import moment from 'moment-timezone';
import os from 'os';
import { getMarkovMessageCount } from './markov_db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();
      const usedMemory = totalMemory - freeMemory;
      const ramUsage = ((usedMemory / totalMemory) * 100).toFixed(2);
      
      const markovCount = await getMarkovMessageCount().catch(() => 0);
      
      res.json({
        status: 'online',
        uptime: uptime,
        users: usersCount,
        chats: chatsCount,
        ramUsage: ramUsage,
        markovMessages: markovCount,
        ping: 'Estable'
      });
    } catch (e) {
      res.status(500).json({ error: 'Fallo al obtener datos internos' });
    }
  });

  app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`\n╭⋯ 🌐 SERVIDOR DASHBOARD INICIADO ⋯》`));
    console.log(chalk.cyan(`┊ Panel Web Activo: ${chalk.whiteBright(`http://localhost:${PORT}`)}`));
    console.log(chalk.bold.cyan(`╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n`));
  });
}
