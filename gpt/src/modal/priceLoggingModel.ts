import { model, Schema, Model, Document, Types } from 'mongoose';
import { Sequences } from '../modal/sequencesModel'

interface IPriceLogging extends Document {
    key: Number;
    ceth: String;
    cusdc: String;
    createDate: Date;
}

const PriceLoggingSchema: Schema = new Schema({
    key: { type: Number, require: true },
    ceth: { type: String },
    cusdc: { type: String },
    createDate: { type: Date },
});


export const PriceLogging = model<IPriceLogging>('price_logging', PriceLoggingSchema);