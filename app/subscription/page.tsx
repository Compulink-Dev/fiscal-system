// app/dashboard/subscriptions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { SubscriptionService } from "@/services/subscription.service";
import Link from "next/link";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscription");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subscriptions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCancel = async (subscriptionId: string) => {
    try {
      await SubscriptionService.cancelSubscription(subscriptionId);
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: "Canceled" } : sub
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    }
  };

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>

      <div className="mb-4">
        <Link
          href="/subscription/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Subscription
        </Link>
      </div>

      <div className="grid gap-4">
        {subscriptions.length === 0 ? (
          <p>No subscriptions found</p>
        ) : (
          subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{subscription.plan}</h2>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        subscription.status === "Active"
                          ? "text-green-600"
                          : subscription.status === "Canceled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Expires:{" "}
                    {new Date(subscription.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                {subscription.status === "Active" && (
                  <button
                    onClick={() => handleCancel(subscription.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
