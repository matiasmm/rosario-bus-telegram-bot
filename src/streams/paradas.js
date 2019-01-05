import * as axios from 'axios';
import fs from 'fs';
import { load } from 'cheerio';
import { urlParadas, pathLineas, pathParadas, urlParadasLineas } from '../config';
import { AllHtmlEntities } from 'html-entities';

import { from, merge } from 'rxjs';
import { map, tap, filter, concatMap, switchMap, mergeMap } from 'rxjs/operators';

const entities = new AllHtmlEntities();
const transformCalles = str =>
  entities.decode(str).split(/ y /);


const paradas$ = (linea) => {
  linea.paradas = [];
  return from(axios.get(urlParadasLineas(linea.idlinea, linea.bandera))).pipe(
    map(html => load(html.data)),
    map($ => {
      const trs = [];
      let destinos
      try {
        destinos = JSON.parse($.html().match(/destinos\s*\=([^;]+)/)[1]);
      } catch (e) {
        console.error("Error en este request: ", urlParadasLineas(linea.idlinea, linea.bandera))
        return
      }
      $('tr').each((i, tr) => $(tr).prop('destino') ? trs.push($(tr)) : null);
      return trs
        .map($tr => {
          const tds = $tr.find('td').map((_, elem) => $(elem));
          return {
            calles: transformCalles(tds[1].html()),
            nro: tds[0].html(),
            destino: destinos[$tr.prop('destino')]
          };
        });
    }),
    tap(paradas => linea.paradas = paradas),
    map(() => linea)
  )
}

export default paradas$