import {
  filter, map, pipe, prop, propIs,
} from 'ramda';
import { load as cheerioLoad } from 'cheerio';
import axios from 'axios';
import { urlParadas } from '../urls';
import { Linea } from '../models';
import { groupsOf } from '../utils/ramdaUtils'

interface ILinea {
  id: number;
  identidad: string;
  bandera: string;
  idlinea: string;
  text: string;
}

const lineasFromOptions = ($: cheerio.Root) => pipe(
  map($),
  map(($elem: cheerio.Cheerio) => ({
    identidad: parseInt($elem.prop('identidad')),
    bandera: $elem.prop('bandera'),
    idlinea: parseInt($elem.prop('idlinea')),
    text: $elem.text(),
    id: parseInt($elem.val()),
  })),
  filter(propIs(String, 'idlinea')),
)($('#linea option').toArray());

const bodyToObjects = pipe(
  prop('data'), 
  cheerioLoad, 
  lineasFromOptions);

export default async function crearLineas() {
  const body = await axios.get(urlParadas);
  const lineas: ILinea[] = bodyToObjects(body);

  for (const batch of groupsOf(20, lineas)) {
    try{
       await Linea.batchPut(batch);
    } catch(error) {
      console.error("Not able to insert lineas")
      throw error;
    }
  }
}
