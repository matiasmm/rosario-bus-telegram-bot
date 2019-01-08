import { get_cuanto_tengo, get_user_info } from './helpers';
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

// Matches "/cuanto [whatever]"
bot.onText(/\/cuanto (.*)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  console.log("hola");

  const chatId = msg.chat.id;
  get_user_info(chat_id, function(results) {
    const dni = results[0].dni;
    const nro_tarjeta = results[0].nro_tarjeta;
    get_cuanto_tengo(dni, nro_tarjeta, function(message) {
      // send back the matched "whatever" to the chat
      bot.sendMessage(chatId, message, {parse_mode: 'Markdown'});
    });
  });

});
