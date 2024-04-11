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

const EmailMappingSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    address: { type: String},
    email: { type: String},
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const EmailMapping: Model<any> = model('email_mappings', EmailMappingSchema);
