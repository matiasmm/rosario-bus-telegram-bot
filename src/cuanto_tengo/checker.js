import { get_user_info, get_cuanto_tengo, update_user_saldo } from './helpers';

export function check_cuanto_tengo(chat_id) {
    get_user_info(chat_id, (user) => {
        const dni = user.dni.toString();
        const nro_tarjeta = user.nro_tarjeta.toString();
        get_cuanto_tengo(dni, nro_tarjeta, (response) => {
            if ('saldo' in response && response['saldo'] < 100) {
                update_user_saldo(chat, response['saldo'], true);
                //notifyLow(chat_id, saldo);
            } else {
                console.log(response);
            }
        });
    });
}