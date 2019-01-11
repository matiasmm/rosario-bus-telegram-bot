import { save_user_info } from '../cuanto_tengo/helpers';
import Dialog from './Dialog';

class RegistroDialog extends Dialog {
  onMessage(msg, match) {
    const chat_id = msg.from.id;
    const dni = match[1];
    const nro_tarjeta = match[2];
    save_user_info(chat_id, dni, nro_tarjeta, (result) => {
        if (result) {
            const message = "Genial! Ahora podés consultar tu saldo mediante /cuanto";
        } else {
            const message = "La cagaste";
        }
        this.bot.sendMessage(chat_id, message, {parse_mode: 'Markdown'});
    });
  }
}

export default RegistroDialog;
