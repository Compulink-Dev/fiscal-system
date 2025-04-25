// app/dashboard/clients/page.tsx
import { getAllSubscriptionsWithUsers } from "@/app/actions/subscription-actions";

export default async function ClientsPage() {
  const { success, subscriptions, error } =
    await getAllSubscriptionsWithUsers();

  if (!success) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subscribed Clients</h1>
      {subscriptions.length === 0 ? (
        <p>No subscribed users found.</p>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{sub.user.name}</h2>
              <p>Email: {sub.user.email}</p>
              <p>
                Plan: <strong>{sub.plan}</strong>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`font-medium ${
                    sub.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {sub.status}
                </span>
              </p>
              <p>Expires At: {new Date(sub.expiresAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
