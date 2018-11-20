import { resolve } from 'path';

export const url = 'http://rosario';
export const urlParadas = 'http://www.etr.gov.ar/paradas.php';
export const urlParadasLineas = (idlinea, bandera) =>
  `http://www.etr.gov.ar/ajax/getParadasLinea.php?linea=${idlinea}&bandera=${bandera}&sentido=`


export const pathLineas = resolve('./data/lineas.json');
export const pathParadas = resolve('./data/paradas.json');
