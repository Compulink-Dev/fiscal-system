// app/actions/subscription-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { SubscriptionStatus } from "@prisma/client";


export async function createSubscription(data: any) {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        userId: data.user,
      },
    });
    revalidatePath("/subscription");
    return { success: true, subscription };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function updateSubscription(id: string, data: any) {
  try {
    const subscription = await prisma.subscription.update({
      where: { id },
      data,
    });
    revalidatePath(`/subscription/${id}`);
    return { success: true, subscription };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function deleteSubscription(id: string) {
  try {
    await prisma.subscription.delete({
      where: { id },
    });
    revalidatePath("/subscription");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getSubscriptionById(id: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    return { success: true, subscription };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getSubscriptionsByUser(userId: string) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, subscriptions };
  } catch (error) {
    return { success: false, error: error };
  }
}


// app/actions/subscription-actions.ts
export async function createNewSubscription(data: {
  userId: string;
  plan: string;
  expiresAt: Date;
  status?: SubscriptionStatus;
}) {
  try {
    // Create subscription and update user in a transaction
    const [subscription, updatedUser] = await prisma.$transaction([
      prisma.subscription.create({
        data: {
          userId: data.userId,
          plan: data.plan,
          status: data.status || 'Active',
          expiresAt: data.expiresAt,
        },
      }),
      prisma.user.update({
        where: { id: data.userId },
        data: { hasActiveSubscription: true },
      }),
    ]);

    revalidatePath("/subscription");
    return { 
      success: true, 
      subscription,
      user: updatedUser
    };
  } catch (error) {
    console.error("Create subscription error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create subscription" 
    };
  }
}

export async function getAllSubscriptionsWithUsers() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true, // Assuming `user` relation is set up in your Prisma schema
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, subscriptions };
  } catch (error) {
    console.error("Error fetching subscriptions with users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch data",
    };
  }
}
