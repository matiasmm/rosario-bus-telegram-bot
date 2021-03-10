import { filter, map, pipe, prop, propIs, useWith, identity } from 'ramda';
import { load as cheerioLoad } from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { decode } from 'html-entities';
import { urlParadasLineas } from '../urls';
import { Linea, LineaDocument, Parada } from '../models';

const transformCalles = (str: string) => decode(str).split(/ y /);

const paradasFromOptions = (linea: LineaDocument) =>
  pipe(($: cheerio.Root) => {
    const trs: cheerio.Cheerio[] = [];
    let destinos: { destino1: string; destino2: string };
    try {
      destinos = JSON.parse(($.html().match(/destinos\s*=([^;]+)/) || [])[1]);
    } catch (e) {
      console.error(
        'Error en este request: ',
        urlParadasLineas(linea.idlinea, linea.bandera)
      );
      throw e;
    }
    $('tr').each((_, tr) => ($(tr).prop('destino') ? trs.push($(tr)) : null));
    return trs.map(($tr) => {
      const $tds = $tr.find('td');
      const [nroParada, esquina] = map(
        (td: cheerio.Element) => $(td).html(),
        $tds.toArray()
      );
      const destino: 'destino1' | 'destino2' = $tr.prop('destino');
      return {
        calles: transformCalles(esquina),
        nro: Number.parseInt(nroParada),
        destino: destinos[destino],
      };
    });
  });

const bodyToObjects = (response: AxiosResponse, linea: LineaDocument) =>
  pipe(
    prop('data'),
    cheerioLoad,
    useWith(paradasFromOptions(linea), [identity])
  )(response);

export default async function crearParadas() {
  // not smart, but we shouldn't do this so often
  for (const parada of await Parada.scan().exec()) {
    await parada.delete();
  }

  const lineas = await Linea.scan().exec();

  console.log('Actualizando paradas');

  for (const linea of lineas) {
    const url = urlParadasLineas(linea.idlinea, linea.bandera);
    const response = await axios.get(url);
    for (const { nro, calles, destino } of bodyToObjects(response, linea)) {
      let parada;
      try {
        parada =
          (await Parada.get({ id: nro })) ||
          new Parada({ id: nro, calles, lineasParada: [] });

        if (parada.lineasParada.findIndex((lp) => lp.id === linea.id) === -1) {
          parada.lineasParada.push({ ...linea, destino });
        }

        await parada.save();
      } catch (e) {
        console.error('Error creando parada', url, { nro, calles, destino });
      }
    }
  }
  console.log('Paradas actualizadas!');
}
