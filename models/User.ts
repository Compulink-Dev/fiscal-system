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
  email: { 
    type: String, 
    required: true, 
    unique: true, // Only define index here OR in schema.index(), not both
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: { type: String, required: true },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company',
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better query performance

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);