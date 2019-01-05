import { get_cuanto_tengo } from './helpers';
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/cuanto (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const user_info = match[1].split(" ");
  const dni = user_info[0];
  const nro_tarjeta = user_info[1];
  
  get_cuanto_tengo(dni, nro_tarjeta, function(message){
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, message, {parse_mode: 'Markdown'});
  });

});
