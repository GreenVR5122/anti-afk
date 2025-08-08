const mineflayer = require('mineflayer');
const express = require('express');

const BOT_NAME = 'AntiAFK_Bot';
const HOST = 'AidensServer.aternos.me';
const PORT = 51889;
const VERSION = '1.20.4'; // set your exact version here

// Tiny web server for uptime robot
const app = express();
app.get('/', (req, res) => res.send('Bot alive'));
app.listen(3000, () => console.log('UptimeRobot server running on port 3000'));

function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    physicsEnabled: false, // disable physics (no knockback, etc)
    defaultChatPatterns: false // disable automatic chat events to reduce noise
  });

  bot.once('spawn', () => {
    console.log('Bot spawned! Starting anti-AFK');

    // Anti-AFK: just jump every 15 seconds
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 15000);
  });

  // Ignore all events except errors and disconnects

  bot.on('end', () => {
    console.log('Bot disconnected! Reconnecting in 5 seconds...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err.message);
  });
}

startBot();
