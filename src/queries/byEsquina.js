import { byEsquina, byParada } from '../helpers/paradasLoaders';

export function searchParada(str) {
  const result = byParada(str);
  return result;
}

export function searchEsquina(str) {
  const result = byEsquina(str);
  return result;
}
