import { get_all_users_info, get_cuanto_tengo, update_user_saldo } from './helpers';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function check_cuanto_tengo(bot) {
    get_all_users_info(async (users) => {
        for (const user of users) {
            console.log(`checking saldo for user with dni ${user.dni}`);
            var dni = user.dni.toString();
            var nro_tarjeta = user.nro_tarjeta.toString();
            var notificacion_enviada = user.notificacion_enviada;
            var ultimo_saldo = user.ultimo_saldo;
            var chat_id = user.telegram_chat_id;
            get_cuanto_tengo(dni, nro_tarjeta, (response) => {
                if ('saldo' in response && response['saldo'] > ultimo_saldo) {
                    // User cargo saldo, setear notificacion_enviada=false
                    update_user_saldo(chat_id, response['saldo'], false);
                }
                if ('saldo' in response && response['saldo'] < 100 && !notificacion_enviada) {
                    // Notificamos al usuario, y seteamos notificacion_enviada=true
                    update_user_saldo(chat_id, response['saldo'], true);
                    bot.sendMessage(chat_id, "Tenés menos de 100 pesos de saldo! No te olvides de recargar.", {parse_mode: 'Markdown'});;
                } else {
                    console.log("no need to notify");
                }
            });
            await sleep(30000);
        };
    });
}