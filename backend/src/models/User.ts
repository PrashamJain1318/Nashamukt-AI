import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  age?: number;
  gender?: string;
  productsUsed?: string[];
  yearsOfAddiction?: number;
  dailyQuantity?: number;
  dailySpending?: number;
  reasonForAddiction?: string;
  reasonToQuit?: string;
  targetQuitDate?: Date;
  preferredLanguage?: string;
  avatar?: string;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    age: { type: Number },
    gender: { type: String },
    productsUsed: [{ type: String }],
    yearsOfAddiction: { type: Number },
    dailyQuantity: { type: Number },
    dailySpending: { type: Number },
    reasonForAddiction: { type: String },
    reasonToQuit: { type: String },
    targetQuitDate: { type: Date },
    preferredLanguage: { type: String, default: 'English' },
    avatar: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
