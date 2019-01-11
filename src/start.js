import { save_user_info } from './cuanto_tengo/helpers';

import CuandoDialog from './dialogs/CuandoDialog';
import CuantoTengoDialog from './dialogs/CuantoTengoDialog';

const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

// Matches "/registro"
bot.onText(/\/registro (\d+) (\d+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chat_id = msg.from.id;
  const dni = match[1];
  const nro_tarjeta = match[2];
  save_user_info(chat_id, dni, nro_tarjeta, function(result) {
    if (result) {
      var message = "Genial! Ahora podés consultar tu saldo mediante /cuanto";
    } else {
      var message = "La cagaste";
    }
    bot.sendMessage(chat_id, message, {parse_mode: 'Markdown'});
  });
});

new CuandoDialog(bot, /\/cuando (.+)/)

new CuantoTengoDialog(bot, /\/cuanto/)

// bot.on('message', (ctx) => console.log(ctx))
bot.on('polling_error', (error) => {
 // console.log(error);  // => 'EFATAL'
});
