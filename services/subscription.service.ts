// services/subscription.service.ts
import prisma from "@/lib/prisma";

export class SubscriptionService {
    
  static async createSubscription(data: {
    userId: string;
    plan: string;
    status?: 'Active' | 'Inactive' | 'Canceled' | 'PendingPayment';
    expiresAt: Date;
  }) {
    try {
        return await prisma.subscription.create({
          data: {
            userId: data.userId,
            plan: data.plan,
            status: data.status || 'Active',
            expiresAt: data.expiresAt,
          },
        });
      } catch (error) {
        console.error("SubscriptionService.createSubscription error:", error);
        throw error;
      }
    }
  

  static async getActiveSubscription(userId: string) {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: 'Active',
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: 'desc' },
    });
  }

  static async updateSubscription(
    id: string,
    data: Partial<{
      status: 'Active' | 'Inactive' | 'Canceled' | 'PendingPayment';
      plan: string;
      expiresAt: Date;
    }>
  ) {
    return prisma.subscription.update({
      where: { id },
      data,
    });
  }

  static async cancelSubscription(id: string) {
    return this.updateSubscription(id, { status: 'Canceled' });
  }

  static async getUserSubscriptions(userId: string) {
    return prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}