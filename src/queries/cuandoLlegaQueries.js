import * as axios from 'axios';
import cheerio from 'cheerio';

import { urlComoLlego } from '../config';

export async function cuandoLlega(parada, idlinea, value) {
  console.log(`parada=${parada}&linea=${idlinea}&entidad=${
    value
  }&adaptado=false&accion=getSmsEfisat`);
  const response = await axios.post(
    urlComoLlego,
    `parada=${parada}&linea=${idlinea}&entidad=${
      value
    }&adaptado=false&accion=getSmsEfisat`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'es,en-AU;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        pragma: 'no-cache',
        'x-requested-with': 'XMLHttpRequest'
      }
    }
  );
  const $ = cheerio.load(response.data);
  const table = [];
  $('table tbody tr').each((i, elem) => {
    const row = [];
    $(elem)
      .find('td')
      .map((i, td) =>
        row.push(
          $(td)
            .text()
            .trim()
        )
      );
    table.push({ text: row[0], arribo: row[1] });
  });
  return table;
}
