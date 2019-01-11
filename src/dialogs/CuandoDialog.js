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
    forOwn(paradas, parada =>
      this.bot.sendMessage(chat_id, `Parada: ${parada.nro}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: this.makeButtons(paradas, parada.nro)
        }
      })
    );
  }

  async onCallback(msg, data) {
    const chat_id = msg.from.id;
    const response = await cuandoLlega(data.p, data.i, data.v)
    response.forEach(({ text, arribo }) =>
      this.bot.sendMessage(chat_id, `*${text}:* ${arribo} `, {
      parse_mode: 'Markdown'}))
  }
}

export default CuandoDialog;
