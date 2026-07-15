import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalEntry extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood: string;
  tags?: string[];
  createdAt: Date;
}

const JournalEntrySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
