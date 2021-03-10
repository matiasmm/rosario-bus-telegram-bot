import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

const { NODE_ENV } = process.env;
if (NODE_ENV === 'DEV') {
  dynamoose.aws.ddb.local();
}

export class LineaDocument extends Document {
  id: number;

  identidad: number;

  bandera: string;

  idlinea: number;

  text: string;
}

export const Linea = dynamoose.model<LineaDocument>('Linea', {
  id: Number,
  identidad: Number,
  bandera: String,
  idlinea: Number,
  text: String,
});

/* Parada */

class ILineaParada {
  id: number;

  identidad: number;

  bandera: string;

  idlinea: number;

  text: string;

  destino: string;
}

export class ParadaDocument extends Document {
  id: number;

  calles: string[];

  lineasParada: ILineaParada[];
}

export const Parada = dynamoose.model<ParadaDocument>('Parada', {
  id: Number,
  calles: {
    type: Array,
    schema: [String],
    default: [],
  },
  lineasParada: {
    schema: [
      {
        type: Object,
        schema: {
          id: Number,
          identidad: Number,
          bandera: String,
          idlinea: Number,
          text: String,
          destino: String,
        },
      },
    ],
    type: Array,
    default: [],
  },
});
