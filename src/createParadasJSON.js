import * as axios from 'axios';
import fs from 'fs';
import { load } from 'cheerio';
import { urlParadas, pathLineas, pathParadas, urlParadasLineas } from './config';
import { AllHtmlEntities } from 'html-entities';

import { from, merge } from 'rxjs';
import { map, tap, filter, concatMap, switchMap, mergeMap } from 'rxjs/operators';


const entities = new AllHtmlEntities();


const toJson = (obj) => JSON.stringify(obj, null, 2).replace(/(?:\n|^)/g, (v) => v + "  ");
const transformCalles = str => 
  entities.decode(str).split(/ y /);

const getParadas$ = (linea) => {
  linea.paradas = [];
  return from(axios.get(urlParadasLineas(linea.idlinea, linea.bandera))).pipe(
    map(html => load(html.data)),
    tap(x => 'getParadas$'),
    map($ => {
      const trs = [];
      const destinos = JSON.parse($.html().match(/destinos\s*\=([^;]+)/)[1]);
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

const lineas$ = from(axios.get(urlParadas))
  .pipe(
    map(html => load(html.data)),
    tap(x => 'lineas$'),
    map($ => $('#linea option')
      .map((_, elem) => ({
          identidad: $(elem).prop('identidad'),
          bandera: $(elem).prop('bandera'),
          idlinea: $(elem).prop('idlinea'),
          text: $(elem).text(),
          value: $(elem).val()
        })
      )),
    map(obj => Object.keys(obj).map(k => obj[k]).filter(o => o.identidad)),
    switchMap(arr => from(arr))
  )

function createLineas(pathLineas) {
  let count = 0;
  const wstream = fs.createWriteStream(pathLineas);
  wstream.write('[\n');

  lineas$.subscribe(data => {
      wstream.write( ((count++ === 0)? '': ',\n' ) + toJson(data));
    },
    err => console.log(err),
    () => {
      wstream.write(']');
      wstream.end();
    });
}


const combined$ = lineas$.pipe(
   mergeMap(linea => getParadas$(linea))
);


function createFiles() {
  const lineas = {}, paradas = {};
  combined$.subscribe(
    ({ identidad, bandera, idlinea, text, value, paradas }) => {
      console.log(idlinea, text, paradas[0].nro);
      //lineas[idlinea] = lineas[idlinea]? lineas[idlinea] : {};
    },
    err => err,
    () => console.log(lineas)
  );
}

// createLineas(pathLineas);
// getParadas$(1130, 'ROJO').subscribe(
//  data => console.log(data)
// );

createFiles();