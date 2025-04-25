// app/users/[id]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/types/user";
import { deleteUser, getUserById } from "@/app/actions/user-actions";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Get params from the router
  const userId = params.id as string;
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId || userId === "create") return;

    const fetchUser = async () => {
      try {
        const { success, user, error } = await getUserById(userId);
        if (!success || !user) throw new Error(error as string);

        const mappedUser: User = {
          ...user,
          _id: user.id, // Use user.id instead of trying to access _id
          role: user.role as "user" | "admin",
          company: user.company
            ? {
                _id: user.company.id, // Use company.id instead of company._id
                name: user.company.name,
              }
            : null,
          createdAt: new Date(user.createdAt).toISOString(),
        };

        setUser(mappedUser);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      const { success } = await deleteUser(userId);
      if (success) {
        toast.success("User deleted successfully", { id: toastId });
        router.push("/admin/users");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error", {
        id: toastId,
      });
    }
  };

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;
  if (error)
    return (
      <div className="container mx-auto py-10 text-red-500">Error: {error}</div>
    );
  if (!user)
    return <div className="container mx-auto py-10">User not found</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <BackButton />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-500">
                Basic Information
              </h2>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  <span className="capitalize">{user.role}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-500">
                Company Information
              </h2>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {user.company?.name || "No company"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-500">
                Account Information
              </h2>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Joined:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users">Back to Users</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/user/${userId}/edit`}>Edit User</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}
