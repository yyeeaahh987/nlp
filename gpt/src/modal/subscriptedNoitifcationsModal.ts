import { model, Schema, Model, Document, Types } from 'mongoose';

interface IWorkflow extends Document {
    _id: Types.ObjectId;
    key: String;
    userAccountId: string;
    workflow: object;
    enabled: boolean;
    createdAt: object;
    updatedAt: object;
    state: boolean;
}

// const ConditionSchema: Schema = new Schema({
//     // _id: Types.ObjectId,
//     key: { type: String, require: true },
//     address: { type: String, require: true },
//     condition: { type: String, require: true },
//     alertSubscripte: { 
//         type: Object},
// });

const AlertSubscripteSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    telegram: { type: Boolean },
    email: { type: Boolean },
    discord: { type: Boolean },
});

const SubscriptedNoitifcationsSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    address: { type: String, require: true },
    condition: [{ type: String} ],
    alertSubscripte: { 
        telegram: { type: Boolean },
        email: { type: Boolean },
        discord: { type: Boolean },
        // type: Schema.Types.ObjectId, ref:"AlertSubscripte"
    },
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const SubscriptedNoitifcations: Model<any> = model('subscripted_noitifcations', SubscriptedNoitifcationsSchema);
const AlertSubscripte: Model<any> = model('alert_subscripte', AlertSubscripteSchema);
// const Condition: Model<any> = model('condition', ConditionSchema);

