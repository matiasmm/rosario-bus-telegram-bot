const CryptoJS = require("crypto-js");
var other_key = CryptoJS.enc.Utf8.parse(process.env.OTHER_KEY);
var iv = CryptoJS.enc.Utf8.parse(process.env.IV);
var encryption_key = process.env.ENCRYPTION_KEY;

export function encrypt(dni, nro_tarjeta) {
    console.log(`dni:${dni}`);
    console.log(`nro_tarjeta: ${nro_tarjeta}`);
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse([nro_tarjeta.substring(0, nro_tarjeta.length - 1), dni].join(",")), encryption_key, other_key, {
        keySize: 128,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}
