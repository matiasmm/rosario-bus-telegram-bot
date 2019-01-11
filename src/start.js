import { get_cuanto_tengo, get_user_info, save_user_info } from './cuanto_tengo/helpers';
import { searchEsquina } from './queries/byEsquina';

const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

// Matches "/cuanto"
bot.onText(/\/cuanto/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chat_id = msg.from.id;
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

bot.onText(/\/cuando (.+)/, (msg, match) => {
  const chat_id = msg.from.id;
  console.log(searchEsquina(match[1]))
  bot.sendMessage(chat_id, 'test', {parse_mode: 'Markdown',


    "reply_markup": JSON.stringify({
      "keyboard": [
        [{text: "Send Location", request_location: true}],
        [{text: "Send Contact", request_contact: true}]
      ],
      "one_time_keyboard": true
    })

  });
})