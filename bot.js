const mineflayer = require('mineflayer');
const express = require('express');

const BOT_NAME = 'AntiAFK_Bot';
const HOST = 'AidensServer.aternos.me';
const PORT = 51889;
const VERSION = '1.20.4';

const app = express();
app.get('/', (req, res) => res.send('Bot alive'));
app.listen(3000, () => console.log('UptimeRobot server running on port 3000'));

function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    physicsEnabled: false,
    defaultChatPatterns: false
  });

  bot.once('spawn', () => {
    console.log('Bot spawned! Starting minimal anti-AFK');

    // Only jump once every 30 seconds to avoid AFK kick
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 30000);
  });

  // Remove all event listeners that handle heavy packets
  // Just ignoring those events:
  bot._client.removeAllListeners('entity_equipment');
  bot._client.removeAllListeners('explosion');
  bot._client.removeAllListeners('chunk_data');
  bot._client.removeAllListeners('map_chunk');
  bot._client.removeAllListeners('entity_metadata');
  bot._client.removeAllListeners('named_entity_spawn');
  bot._client.removeAllListeners('spawn_entity');
  bot._client.removeAllListeners('player_info');
  bot._client.removeAllListeners('keep_alive');

  // Keep alive hack (some servers require responding to keep_alive packets)
  bot._client.on('keep_alive', (packet) => {
    bot._client.write('keep_alive', { keepAliveId: packet.keepAliveId });
  });

  bot.on('end', () => {
    console.log('Bot disconnected! Reconnecting in 5 seconds...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err.message);
  });
}

startBot();
