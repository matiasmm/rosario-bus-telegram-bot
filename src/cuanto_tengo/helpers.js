var request = require('request');
import { encrypt } from './encrypter';

export function get_cuanto_tengo(dni, nro_tarjeta, callback) {
    var encrypted_data = encrypt(dni, nro_tarjeta)
    console.log(encrypted_data);
    request.post({ url: 'http://www.etr.gov.ar/ajax/getCuantoTengoResponse.php', form: { dataUser: encrypted_data } }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log(httpResponse);

        console.log('Upload successful!  Server responded with:', body);
        var fecha_hora_array = JSON.parse(body)[0]['fecha'].split("  ");
        var fecha = fecha_hora_array[0];
        var hora = fecha_hora_array[1];
        var saldo = JSON.parse(body)[0]["saldo"];
        var mensaje = `Che, al *${fecha} ${hora}* tenés *$${saldo}* de saldo.`;
        callback(mensaje);
    });
}
