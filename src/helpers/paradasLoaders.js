import fs from 'fs';
import { pathParadas, pathLineas } from '../config';
import accents from 'remove-accents';
import { pickBy } from 'lodash';

const lineas = JSON.parse(fs.readFileSync(pathLineas));
const paradas = JSON.parse(fs.readFileSync(pathParadas));

const normalize = str => accents(str).toUpperCase();

export const searchLinea = (idlinea, bandera) =>
  lineas.find(linea => linea.bandera === bandera && linea.idlinea === idlinea);

export const populateLineas = parada =>
  (parada.lineas = parada.lineas.map(({ idlinea, bandera, destino }) => {
    const linea = searchLinea(idlinea, bandera);
    return { ...linea, destino };
  }));

export const byEsquina = (query, populate = true) => {
  const calles = normalize(query).split(/\s+[ye]\s+/i);
  const matches = pickBy(paradas, (parada, nro) => {
    return (
      normalize(parada.calles[0]).indexOf(calles[0]) !== -1 &&
      normalize(parada.calles[1]).indexOf(calles[1]) !== -1
    );
  });
  if (populate) {
    Object.keys(matches).map(function(k) {
      populateLineas(matches[k]);
    });
  }
  return matches;
};

export const byParada = (nro_parada, populate = true) => {
  const matches = pickBy(paradas, (parada, nro) => {
    return (
      parada.nro == nro_parada
    );
  });
  if (populate) {
    Object.keys(matches).map(function(k) {
      populateLineas(matches[k]);
    });
  }
  return matches;
};