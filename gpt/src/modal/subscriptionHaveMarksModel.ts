import { model, Schema, Model, Document, Types } from 'mongoose';

interface IWorkflow extends Document {
    _id: Types.ObjectId;
    key: Number;
    userAccountId: string;
    workflow: object;
    enabled: boolean;
    createdAt: object;
    updatedAt: object;
    state: boolean;
}

const SubscriptionHaveMarksSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: Number, require: true },
    address: { type: String },
    marks: { type: Number },
    createDate: { type: Date },
    createBy: { type: String },
    lastUpdateDate: { type: Date },
    lastUpdateBy: { type: String },
    used: { type: Boolean },
});


export const SubscriptionHaveMarks: Model<any> = model('subscription_have_marks', SubscriptionHaveMarksSchema);

// subscription_have_marks
// SubscriptionHaveMarks
