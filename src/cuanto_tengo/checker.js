import { get_user_info, get_cuanto_tengo, update_user_saldo } from './helpers';

export function check_cuanto_tengo(bot, chat_id) {
    get_user_info(chat_id, (user) => {
        const dni = user.dni.toString();
        const nro_tarjeta = user.nro_tarjeta.toString();
        const notificacion_enviada = user.notificacion_enviada;
        const ultimo_saldo = user.ultimo_saldo;
        get_cuanto_tengo(dni, nro_tarjeta, (response) => {
            if ('saldo' in response && response['saldo'] > ultimo_saldo) {
                // User cargo saldo, setear notificacion_enviada=false
                update_user_saldo(chat_id, response['saldo'], false);
            }
            if ('saldo' in response && response['saldo'] < 200 && !notificacion_enviada) {
                // Notificamos al usuario, y seteamos notificacion_enviada=true
                update_user_saldo(chat_id, response['saldo'], true);
                bot.sendMessage(chat_id, "Tenés menos de 200 pesos de saldo! No te olvides de recargar.", {parse_mode: 'Markdown'});;
            } else {
                console.log(response);
            }
        });
    });
}