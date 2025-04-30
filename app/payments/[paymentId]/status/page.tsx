"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaymentById } from "@/app/actions/payment-actions";
import toast from "react-hot-toast";

export default function PaymentStatusPage({
  params,
}: {
  params: { paymentId: string };
}) {
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const result = await getPaymentById(params.paymentId);

        if (!result.success || !result.payment) {
          throw new Error("Payment not found");
        }

        setPayment(result.payment);

        if (result.payment.status === "Completed") {
          toast.success("Payment completed successfully!");
          router.push("/dashboard");
        } else if (result.payment.status === "Failed") {
          toast.error("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        toast.error("Error verifying payment status");
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [params.paymentId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p>Verifying your payment...</p>
          </div>
        ) : (
          <div>
            {payment?.status === "Completed" ? (
              <div className="text-green-600">
                <p className="font-semibold">Payment Successful!</p>
                <p>Your subscription is now active.</p>
                <p className="mt-4">{"You'll be redirected shortly..."}</p>
              </div>
            ) : payment?.status === "Failed" ? (
              <div className="text-red-600">
                <p className="font-semibold">Payment Failed</p>
                <p>Please try again or contact support.</p>
                <button
                  onClick={() => router.push("/payments")}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <p>Payment is still being processed.</p>
                <p>This page will update automatically.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
