// models/User.ts
import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  company: mongoose.Types.ObjectId;
  role: "admin" | "user";
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company',
    required: true 
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ company: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);