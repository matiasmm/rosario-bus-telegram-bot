import { get_cuanto_tengo, get_user_info, save_user_info } from './helpers';
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

// Matches "/cuanto"
bot.onText(/\/cuanto/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chat_id = msg.chat.id;
  console.log(chat_id);
  get_user_info(chat_id, function(results) {
    const dni = results[0].dni.toString();
    const nro_tarjeta = results[0].nro_tarjeta.toString();
    get_cuanto_tengo(dni, nro_tarjeta, function(message) {
      // send back the matched "whatever" to the chat
      bot.sendMessage(chat_id, message, {parse_mode: 'Markdown'});
    });
  });
});

// Matches "/registro"
bot.onText(/\/registro (\d+) (\d+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  console.log(match);
  const chat_id = msg.chat.id;
  console.log(chat_id);
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