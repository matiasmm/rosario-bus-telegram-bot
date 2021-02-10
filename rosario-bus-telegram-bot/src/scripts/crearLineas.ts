import { filter, map, pipe, prop, propIs } from 'ramda';
import { load as cheerioLoad } from 'cheerio';
import axios from 'axios';
import { urlParadas } from '../urls';

interface Linea {
  identidad: string;
  bandera: string;
  idlinea: string;
  text: String;
  value: String;
}

const lineasFromOptions = ($: cheerio.Root) =>
  pipe(
    map($),
    map(($elem: cheerio.Cheerio) => ({
      identidad: $elem.prop('identidad'),
      bandera: $elem.prop('bandera'),
      idlinea: $elem.prop('idlinea'),
      text: $elem.text(),
      value: $elem.val(),
    })),
    filter(propIs(String, 'idlinea'))
  )($('#linea option').toArray());

const bodyToObjects = pipe(prop('data'), cheerioLoad, lineasFromOptions);

export default async function crearLineas() {
  const body = await axios.get(urlParadas);
  const lineas: Linea[] = bodyToObjects(body);
  return lineas;
}
