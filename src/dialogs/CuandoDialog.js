import { forOwn } from 'lodash';
import { searchEsquina } from '../queries/byEsquina';
import { cuandoLlega } from '../queries/cuandoLlegaQueries';
import * as TelegramBot from 'node-telegram-bot-api';
import Dialog from './Dialog';

class CuandoDialog extends Dialog {
  makeButtons(paradas, parada) {
    const botones = [];
    paradas[parada].lineas.map(l => {
      botones.push([
        {
          text: `${l.text} - ${l.destino}`,
          callback_data: JSON.stringify({
            i: l.idlinea,
            v: l.value,
            dialog: 'CuandoDialog',
            p: parada,
          })
        }
      ]);
    });
    return botones;
  }

  onMessage(msg, match) {
    const chat_id = msg.from.id;
    const paradas = searchEsquina(match[1]);
    const count = Object.keys(paradas).length
    if (count == 0) {
      this.bot.sendMessage(chat_id, "🤷 No encontré ninguna parada en esas calles", {
        parse_mode: 'Markdown'})
    } else if (count < 10) {
      forOwn(paradas, parada =>
        this.bot.sendMessage(chat_id, `*Parada:* ${parada.nro} - ${parada.calles.join(',')}`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: this.makeButtons(paradas, parada.nro)
          }
        })
      );
    } else {
      this.bot.sendMessage(chat_id, "🤷 Muchas paradas, podrías ser más especifico?", {
        parse_mode: 'Markdown'})
    }
  }


  async onCallback(msg, data) {
    const chat_id = msg.from.id;
    const response = await cuandoLlega(data.p, data.i, data.v)
    const messages = response.map(({ text, arribo }) => `*${text}:* ${arribo} `);
    messages.length?
    this.bot.sendMessage(chat_id, messages.join("\n"), {
      parse_mode: 'Markdown'}) :     this.bot.sendMessage(chat_id, "🤷", {
        parse_mode: 'Markdown'})
    this.bot.answerCallbackQuery({callback_query_id: msg.id});
  }
}

export default CuandoDialog;
