export const url = 'http://rosario';
export const urlParadas = 'http://www.etr.gov.ar/paradas.php';
export const urlComoLlego =
  'http://www.emr.gov.ar/ajax/cuandollega/getSmsResponseEfisat.php';
export const urlParadasLineas = (
  idlinea: number | string,
  bandera: number | string
) =>
  `http://www.etr.gov.ar/ajax/getParadasLinea.php?linea=${idlinea}&bandera=${bandera}&sentido=`;
