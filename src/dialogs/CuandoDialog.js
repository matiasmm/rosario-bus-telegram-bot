import { forOwn } from 'lodash';
import { searchEsquina } from '../queries/byEsquina';
import * as TelegramBot from 'node-telegram-bot-api';
import Dialog from './Dialog';

class CuandoDialog extends Dialog {
  makeButtons(paradas, parada) {
    const botones = [];
    paradas[parada].lineas.map(l => {
      botones.push([
        {
          text: `${l.text} - ${l.destino}`,
          callback_data: 'okis'
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
      }).then()
    );
  }
}

export default CuandoDialog;
