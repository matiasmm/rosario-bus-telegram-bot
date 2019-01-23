import { get_user_info, get_cuanto_tengo, update_user_saldo } from './helpers';

export function check_cuanto_tengo(bot, chat_id) {
    get_user_info(chat_id, (user) => {
        const dni = user.dni.toString();
        const nro_tarjeta = user.nro_tarjeta.toString();
        get_cuanto_tengo(dni, nro_tarjeta, (response) => {
            if ('saldo' in response && response['saldo'] < 200) {
                update_user_saldo(chat_id, response['saldo'], true);
                bot.sendMessage(chat_id, "Tenés menos de 200 pesos de saldo! No te olvides de recargar.", {parse_mode: 'Markdown'});;
            } else {
                console.log(response);
            }
        });
    });
}