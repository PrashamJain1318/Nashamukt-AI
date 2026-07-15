import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackerLog extends Document {
  user: mongoose.Types.ObjectId;
  product: string;
  quantity: number;
  time: string;
  mood: string;
  trigger: string;
  notes?: string;
  createdAt: Date;
}

const TrackerLogSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    time: { type: String, required: true },
    mood: { type: String, required: true },
    trigger: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const TrackerLog = mongoose.model<ITrackerLog>('TrackerLog', TrackerLogSchema);
