// app/auth/signin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { getUserByEmail } from "@/app/actions/user-actions";
import { getSubscriptionsByUser } from "@/app/actions/subscription-actions";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // if (res?.error) {
    //   setError("Invalid email or password");
    // } else {
    //   // Wait a moment to ensure the session is available
    //   const session = await getSession();

    //   const role = session?.user?.role;

    //   if (role === "admin") {
    //     router.push("/admin");
    //   } else {
    //     router.push("/dashboard");
    //   }
    // }

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    // Get user session and details
    const session = await getSession();
    if (!session?.user) {
      setError("Session error - please try again");
      return;
    }

    const role = session.user.role;

    // Admin users bypass subscription checks
    if (role === "admin") {
      router.push("/admin");
      return;
    }

    try {
      // Get user details
      const userResult = await getUserByEmail(email);
      if (!userResult.success || !userResult.user) {
        throw new Error("User not found");
      }

      // Get active subscriptions
      const subscriptionsResult = await getSubscriptionsByUser(
        userResult.user.id
      );
      if (!subscriptionsResult.success) {
        throw new Error("Failed to check subscription status");
      }

      // Check for at least one active subscription
      // app/auth/signin/page.tsx
      const hasActiveSubscription =
        subscriptionsResult.subscriptions?.some(
          (sub) =>
            sub.status === "Active" && new Date(sub.expiresAt) > new Date()
        ) ?? false;
      if (!hasActiveSubscription) {
        // Redirect to payment page if no active subscription
        router.push("/payments?reason=no_active_subscription");
        return;
      }

      // If everything is good, proceed to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Subscription check error:", err);
      setError("Error verifying your subscription - please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className=""></div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          {"Don't have an account?"}{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
