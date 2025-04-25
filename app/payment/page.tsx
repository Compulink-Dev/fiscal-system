// app/payment/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createNewSubscription } from "@/app/actions/subscription-actions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { SubscriptionStatus } from "@prisma/client";

const paymentPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$9.99/month",
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$19.99/month",
    features: ["All Basic features", "Feature 4", "Feature 5"],
  },
];

export default function PaymentPage() {
  const { data: session, status, update } = useSession();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Optional: Add loading state for session
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setSessionLoading(false);
    }
  }, [status]);

  console.log("User :", session?.user);

  const handleSubscribe = async () => {
    // Check if session is still loading
    if (status === "loading" || sessionLoading) {
      toast.error("Please wait while we verify your session");
      return;
    }

    // Check if user is authenticated
    if (!session?.user) {
      setError("You must be logged in to subscribe");
      toast.error("Please login to continue");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createNewSubscription({
        userId: session.user.id,
        plan: selectedPlan,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Active" as SubscriptionStatus, // Explicit type casting
      });
      if (!result.success) {
        throw new Error("Failed to create subscription");
      }

      await update({
        ...session,
        user: {
          ...session.user,
          hasActiveSubscription: true,
        },
      });

      toast.success("Subscription created successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          {reason === "no_active_subscription" && (
            <p className="mt-2 text-red-600">
              Your account has no active subscription. Please choose a plan to
              continue.
            </p>
          )}
          {sessionLoading && (
            <p className="mt-2 text-blue-600">Loading session information...</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                selectedPlan === plan.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-2xl font-bold my-2">{plan.price}</p>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-2 px-4 border rounded-md ${
                  selectedPlan === plan.id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading || sessionLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
          {!session?.user && (
            <p className="mt-2 text-red-600">
              You must be logged in to subscribe
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
