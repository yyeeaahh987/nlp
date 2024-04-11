import { model, Schema, Model, Document, Types } from 'mongoose';

interface IAlertHistory extends Document {
    key: String;
    address: String;
    condition: String;
    createDate: Date;
}

const AlertHistorySchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    address: { type: String, require: true },
    condition: {type: String},
    createDate:{type: Date},
});


export const AlertHistory = model<IAlertHistory>('alert_historys', AlertHistorySchema);

// const User = model<IUser>('User', userSchema);