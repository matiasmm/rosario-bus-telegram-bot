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
        console.log('Server responded with:', body);
        try {
            var fecha_hora_array = JSON.parse(body)[0]['fecha'].split("  ");
            var fecha = fecha_hora_array[0];
            var hora = fecha_hora_array[1];
            var saldo = JSON.parse(body)[0]["saldo"];
            var response = {'fecha': fecha, 'hora': hora, 'saldo': parseFloat(saldo).toFixed(2)};
        } catch (ex) {
            var response = {'error': body};
        }
        callback(response);
    });
}

export function get_user_info(chat_id, callback) {
    var connection = mysql.createConnection(process.env.DATABASE_URL);
    connection.connect();
    console.log("DB connected");
    connection.query('SELECT dni, nro_tarjeta FROM users WHERE telegram_chat_id = ?', [chat_id],  function (error, results, fields) {
        connection.end();
        console.log(results);
        if (error) console.log(error.toString());
        callback(results[0]);
    });
}

export function save_user_info(chat_id, dni, nro_tarjeta, callback) {
    var connection = mysql.createConnection(process.env.DATABASE_URL);
    connection.connect();
    console.log("DB connected");
    connection.query('INSERT INTO users (telegram_chat_id, dni, nro_tarjeta) VALUES(?, ?, ?)', [chat_id, dni, nro_tarjeta],  function (error, results, fields) {
        connection.end();
        console.log(results);
        if (error) console.log(error.toString());
        callback(true);
    });
}

export function update_user_saldo(chat_id, saldo, notificacion_enviada) {
    var connection = mysql.createConnection(process.env.DATABASE_URL);
    connection.connect();
    console.log("DB connected");
    connection.query('UPDATE users SET ultimo_saldo = ?, notificacion_enviada= ? WHERE telegram_chat_id = ?', [saldo, notificacion_enviada, chat_id],  function (error, results, fields) {
        connection.end();
        console.log(results);
        if (error) console.log(error.toString());
    });
}