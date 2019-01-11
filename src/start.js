import CuandoDialog from './dialogs/CuandoDialog';
import CuantoTengoDialog from './dialogs/CuantoTengoDialog';
import RegistroDialog from './dialogs/RegistroDialog';

const TelegramBot = require('node-telegram-bot-api');
const BOT_TOKEN = process.env.BOT_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

new CuandoDialog(bot, /\/cuando (.+)/)

new CuantoTengoDialog(bot, /\/cuanto/)

new RegistroDialog(bot, /\/registro (\d+) (\d+)/)

// bot.on('message', (ctx) => console.log(ctx))
bot.on('polling_error', (error) => {
 // console.log(error);  // => 'EFATAL'
});
