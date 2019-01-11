import { get_cuanto_tengo, get_user_info } from '../cuanto_tengo/helpers';
import Dialog from './Dialog';

class CuantoTengoDialog extends Dialog {
  onMessage(msg, match) {
    const chat_id = msg.from.id;
    get_user_info(chat_id, function(results) {
        const dni = results[0].dni.toString();
        const nro_tarjeta = results[0].nro_tarjeta.toString();
        get_cuanto_tengo(dni, nro_tarjeta, function(message) {
            this.bot.sendMessage(chat_id, message, {parse_mode: 'Markdown'});
        });
    });
  }
}

export default CuantoTengoDialog;
