import { NextRequest, NextResponse } from "next/server";
import { getPaymentById, verifyPayNowPayment } from "@/app/actions/payment-actions";
import { createSubscriptionWithPayment } from "@/app/actions/subscription-actions";

export async function POST(
  req: NextRequest,
  context: { params: { paymentId: string } }
) {
  try {
    // Extract paymentId from params
    const paymentId = context.params.paymentId;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Verify payment
    const verification = await verifyPayNowPayment(paymentId);
    if (!verification.success) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Get payment details to create subscription
    const payment = await getPaymentById(paymentId);
    if (!payment.success || !payment.payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Create subscription
    const subscription = await createSubscriptionWithPayment({
      userId: payment.payment.userId,
      plan: "pro",
      paymentId: paymentId,
    });

    if (!subscription.success) {
      return NextResponse.json(
        { error: "Subscription creation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}