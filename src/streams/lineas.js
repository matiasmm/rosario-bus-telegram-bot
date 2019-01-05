import * as axios from 'axios';
import { load } from 'cheerio';
import { urlParadas } from '../config';
import { from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

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

export default lineas$