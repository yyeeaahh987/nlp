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

const TelegramMappingSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String, require: true },
    address: { type: String, require: true },
    username: { type: String, require: true },
    chatId: { type: Number},
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const TelegramMapping: Model<any> = model('tg_id_username_mappings', TelegramMappingSchema);
