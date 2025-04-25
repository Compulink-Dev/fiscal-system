// models/User.ts
import mongoose, { Document } from "mongoose";

interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
  status: string;
  createdAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better query performance

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema);