var request = require('request');
var mysql = require('mysql');
import { encrypt } from './encrypter';

export function get_cuanto_tengo(dni, nro_tarjeta, callback) {
    var encrypted_data = encrypt(dni, nro_tarjeta)
    console.log(encrypted_data);
    request.post({ url: 'http://www.etr.gov.ar/ajax/getCuantoTengoResponse.php', form: { dataUser: encrypted_data } }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log(httpResponse);

        console.log('Server responded with:', body);
        try {
            var fecha_hora_array = JSON.parse(body)[0]['fecha'].split("  ");
            var fecha = fecha_hora_array[0];
            var hora = fecha_hora_array[1];
            var saldo = JSON.parse(body)[0]["saldo"];
            var mensaje = `Che, al *${fecha} ${hora}* tenés *$${saldo}* de saldo.`;
        } catch (ex) {
            if (body.indexOf("Espere") !== -1) {
                var mensaje = "Esperá 20 segundos y probá de nuevo.";
            }
        }
        callback(mensaje);
    });
}

export function get_user_info(chat_id, callback) {
    var connection = mysql.createConnection(process.env.DATABASE_URL);
    connection.connect();
    console.log("DB connected");
    connection.query('SELECT dni, nro_tarjeta FROM users WHERE telegram_chat_id = ?', [chat_id],  function (error, results, fields) {
        console.log(results);
        if (error) console.log(error.toString());
        callback(results);
        console.log('User found with dni: ', results[0].dni);
      });
    connection.destroy();
}