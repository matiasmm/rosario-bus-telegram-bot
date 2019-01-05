import fs from 'fs';
import { pathLineas } from '../config'
import lineas$ from '../streams/lineas'

const toJson = (obj) => JSON.stringify(obj, null, 2).replace(/(?:\n|^)/g, (v) => v + "  ");

function createLineas() {
  let count = 0;
  const wstream = fs.createWriteStream(pathLineas);
  wstream.write('[\n');

  lineas$.subscribe(data => {
      wstream.write( ((count++ === 0)? '': ',\n' ) + toJson(data));
    },
    err => console.log(err),
    () => {
      wstream.write(']');
      wstream.end();
    });
}


createLineas()