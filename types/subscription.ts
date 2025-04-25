// types/subscription.ts
export interface Subscription {
    id: string;
    userId: string;
    status: 'Active' | 'Inactive' | 'Canceled' | 'PendingPayment';
    plan: string;
    expiresAt: Date;
    createdAt: Date;
  }