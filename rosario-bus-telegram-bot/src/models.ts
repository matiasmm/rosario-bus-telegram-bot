import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

const { NODE_ENV } = process.env;
if (NODE_ENV === 'DEV') {
  dynamoose.aws.ddb.local();
} 

class LineaDocument extends Document {
    id: number;

    identidad: number;

    bandera: string;

    idlinea: number;

    text: string;
}

export const Linea = dynamoose.model<LineaDocument>('Linea', {
  id: Number, identidad: Number, bandera: String, idlinea: Number, text: String
});
