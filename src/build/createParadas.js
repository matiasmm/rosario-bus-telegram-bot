import fs from 'fs';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { pathParadas, pathLineas } from '../config';
import paradas$ from '../streams/paradas';

if (!fs.existsSync(pathLineas)) {
  console.error('Error: Primero hay que correr createLineas');
  process.exit();
}

const lineas = JSON.parse(fs.readFileSync(pathLineas));

const combined$ = from(lineas).pipe(mergeMap(linea => paradas$(linea)));

const output = {};
combined$.subscribe(
  ({ idlinea, paradas }) => {
    if (!paradas || !paradas.length) {
      return;
    }
    paradas.forEach(
      parada =>
        output[parada.nro] || (output[parada.nro] = { ...parada, lineas: [] })
    );
    paradas.forEach(({ nro }) => output[nro].lineas.push(idlinea));
  },
  err => console.log('Error while creating paradas, retrying may be enough', err),
  () => fs.writeFileSync(pathParadas, JSON.stringify(output, null, 4)) && console.log('Archivo creado'))

