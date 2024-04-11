import mongoose , { model, Schema, Model, Document, Types } from 'mongoose';

interface ISequences extends Document {
    sequence: Number;
    type: String;
}

const SequencesSchema: Schema = new Schema({
    sequence: { type: Number, require: true },
    type: { type: String },
});

export const Sequences = model<ISequences>('sequences', SequencesSchema);