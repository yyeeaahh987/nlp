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

const SubscriberInformationSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    address: { type: String, require: true },
    status: { type: String, require: true },
    condition: [{ type: Object} ],
    notification:{
        telegram: { 
            status:{type: String},
            chatId:{type: String},
            username:{type: String}
        },
        email: { 
            status:{type: String},
            toList:{type: String},
            ccList:{type: String}
        },
        discord: { 
            status:{type: String},
            chatId:{type: String},
            clientId:{type: String}
        },
    }
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const SubscriberInformation: Model<any> = model('subscriber_informations', SubscriberInformationSchema);
