// app/api/subscriptions/route.ts
import { NextResponse } from "next/server";
import { SubscriptionService } from "@/services/subscription.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.log("Error fetching subscriptions:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const subscription = await SubscriptionService.createSubscription({
      userId: session.user.id,
      plan: body.plan,
      expiresAt: new Date(body.expiresAt),
    });
    return NextResponse.json(subscription);
  } catch (error) {
    console.log("Error creating subscription:", error);
    
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}