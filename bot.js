// Install dependencies first:
// npm install mineflayer express

const mineflayer = require('mineflayer');
const express = require('express');

// ===== SERVER CONFIG =====
const BOT_NAME = 'AntiAFK_Bot';
const HOST = 'AidensServer.aternos.me';
const PORT = 51889;
const VERSION = '1.20.4'; // Change to your exact server version if different

// ===== EXPRESS SERVER FOR UPTIMEROBOT =====
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('🌐 UptimeRobot server started on port 3000'));

// ===== START BOT FUNCTION =====
function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    physicsEnabled: false // 🚫 disables knockback & collision to prevent crashes
  });

  function antiAFK() {
    setInterval(() => {
      const actions = ['jump', 'left', 'right', 'forward', 'back', 'rotate'];
      const choice = actions[Math.floor(Math.random() * actions.length)];

      switch (choice) {
        case 'jump':
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
          break;
        case 'left':
          bot.setControlState('left', true);
          setTimeout(() => bot.setControlState('left', false), 500);
          break;
        case 'right':
          bot.setControlState('right', true);
          setTimeout(() => bot.setControlState('right', false), 500);
          break;
        case 'forward':
          bot.setControlState('forward', true);
          setTimeout(() => bot.setControlState('forward', false), 500);
          break;
        case 'back':
          bot.setControlState('back', true);
          setTimeout(() => bot.setControlState('back', false), 500);
          break;
        case 'rotate':
          bot.look(bot.entity.yaw + (Math.random() - 0.5), bot.entity.pitch);
          break;
      }
    }, 10000);
  }

  bot.once('spawn', () => {
    console.log('✅ Bot has joined the server!');
    antiAFK();
  });

  bot.on('end', () => {
    console.log('❌ Bot disconnected! Reconnecting in 5 seconds...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', err => {
    console.log('⚠️ Bot error:', err.message);
  });
}

// ===== START EVERYTHING =====
startBot();
