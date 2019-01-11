import { get_cuanto_tengo, get_user_info } from '../cuanto_tengo/helpers';
import Dialog from './Dialog';

class CuantoTengoDialog extends Dialog {
  onMessage(msg, match) {
    const chat_id = msg.from.id;
    get_user_info(chat_id, (user) => {
        const dni = user.dni.toString();
        const nro_tarjeta = user.nro_tarjeta.toString();
        get_cuanto_tengo(dni, nro_tarjeta, (response) => {
          var message;
          if ('error' in response) {
            message = response['error'];
          } else {
            var message = `Che, al *${response['fecha']} ${response['hora']}* tenés *$${response['saldo']}* de saldo.`;
          }
            this.bot.sendMessage(chat_id, message, {parse_mode: 'Markdown'});
        });
    });
  }
}

export default CuantoTengoDialog;