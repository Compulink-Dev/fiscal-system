"use server";

import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { paynow } from "./paynow-actions";

export async function initiatePayNowPayment({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
  description: string;
}) {
  try {
    // Create payment record
    const reference = `PAY-${uuidv4()}`;
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        reference,
        paymentMethod: "PayNow",
        status: "Pending",
      },
    });

    // Create PayNow order
    const payNowResponse = await paynow.createPayNowOrder(reference, amount);

    // Update payment with poll URL
    await prisma.payment.update({
      where: { id: payment.id },
      data: { pollUrl: payNowResponse.pollUrl },
    });

    return {
      success: true,
      redirectUrl: payNowResponse.link,
      paymentId: payment.id,
    };
  } catch (error) {
    console.error("Payment initiation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment initiation failed",
    };
  }
}

export async function verifyPayNowPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.pollUrl) {
      throw new Error("No poll URL available for this payment");
    }

    // Verify payment with PayNow
    const verification = await paynow.capturePayNowOrder(payment.pollUrl);

    if (!verification.success) {
      throw new Error("Payment verification failed");
    }

    // Update payment status
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "Completed",
          updatedAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          paymentId: payment.id,
          transactionId: verification.id,
          amount: payment.amount,
          status: "Paid",
          paymentDetails: verification.paymentDetails,
          processedAt: verification.paidAt ? new Date(verification.paidAt) : new Date(),
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Payment verification error:", error);
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "Failed",
        updatedAt: new Date(),
      },
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment verification failed",
    };
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        transaction: true,
        subscription: true,
      },
    });
    return { success: true, payment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment",
    };
  }
}