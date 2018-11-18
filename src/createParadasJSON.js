import * as axios from 'axios';
import fs from 'fs';
import { load } from 'cheerio';
import { urlParadas, pathLineas } from './config';

import { from } from 'rxjs';
import { map, tap, filter, concatMap, switchMap } from 'rxjs/operators';

const lineas = [], paradas = [];

const toJson = (obj) => JSON.stringify(obj, null, 2).replace(/(?:\n|^)/g, (v) => v + "  ");

const paradas$ = from(axios.get(urlParadas))
  .pipe(
    map(html => load(html.data)),
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

  paradas$.subscribe(data => {
      wstream.write( ((count++ === 0)? '': ',\n' ) + toJson(data));
    },
    err => console.log(err),
    () => {
      wstream.write(']');
      wstream.end();
    });
}

createLineas(pathLineas);