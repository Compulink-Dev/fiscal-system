// app/users/page.tsx
"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { getAllUsers, deleteUser } from "@/app/actions/user-actions";
import toast from "react-hot-toast";
import { DeleteConfirmationDialog } from "../../_components/DeleteDialog";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  company: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null
  );

  const fetchUsers = async () => {
    const res = await getAllUsers();
    if (res.success && Array.isArray(res.users)) {
      const normalizedUsers: User[] = res.users.map((user: any) => ({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        company: user.company
          ? {
              _id: user.company._id || user.company.id,
              name: user.company.name,
            }
          : null,
      }));
      setUsers(normalizedUsers);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;
    const toastId = toast.loading("Deleting user...");
    try {
      const { success } = await deleteUser(selectedUserId);
      if (success) {
        toast.success("User deleted successfully", { id: toastId });
        setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
      }
    } catch (error) {
      console.log(error);

      toast.error("Error deleting user", { id: toastId });
    } finally {
      setIsDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "company.name",
      header: "Company",
      cell: ({ row }) => (
        <div>{row.original.company?.name || "No company"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const handleOpenDeleteDialog = () => {
          setSelectedUserId(user._id);
          setIsDialogOpen(true);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user._id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/user/${user._id}`} className="w-full">
                  View user
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/user/${user._id}/edit`} className="w-full">
                  Edit user
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenDeleteDialog}>
                <span className="text-red-600">Delete user</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild className="button">
          <Link href="/admin/user/create" className="flex items-center">
            <Plus className="mr-2" />
            Add User
          </Link>
        </Button>
      </div>
      <DataTable columns={userColumns} data={users} searchKey="email" />
      <DeleteConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
