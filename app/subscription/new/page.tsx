// app/dashboard/subscriptions/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewSubscription } from "@/app/actions/subscription-actions";
import { getSession } from "next-auth/react";

const PLANS = [
  { id: "basic", name: "Basic Plan", price: "$9.99/month" },
  { id: "pro", name: "Pro Plan", price: "$19.99/month" },
  { id: "enterprise", name: "Enterprise Plan", price: "$49.99/month" },
];

export default function NewSubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await getSession();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      if (!selectedPlan) {
        throw new Error("Please select a plan");
      }

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const result = await createNewSubscription({
        userId: session.user.id,
        plan: selectedPlan,
        expiresAt,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      router.push("/subscription");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Subscription</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <p className="text-gray-600">{plan.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !selectedPlan}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Subscribe"}
          </button>
        </div>
      </form>
    </div>
  );
}
