// app/users/[id]/edit/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserById, updateUser } from "@/app/actions/user-actions";
import { useParams } from "next/navigation";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user"]),
  company: z.string().optional(),
});

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Get params from the router
  const userId = params.id as string;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user" as const,
      company: "",
    },
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      const { success, user, error } = await getUserById(userId);
      if (success && user) {
        form.reset({
          name: user.name,
          email: user.email,
          role: user.role as "admin" | "user",
          company: user.company?.id || "",
        });
      } else {
        setError("Failed to load user: " + (error as any)?.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId, form]);

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    const { success, error } = await updateUser(userId, {
      ...values,
      companyId: values.company,
    });

    if (success) {
      router.push(`/admin/user/${userId}`);
    } else {
      setError("Failed to update user: " + (error as any)?.message);
    }
  };

  // Loading, error, and form rendering stays unchanged...

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!params.id) {
    return <div className="container mx-auto py-10">User not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <Button asChild variant="outline">
          <Link href={`/admin/user/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add company selection if needed */}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
