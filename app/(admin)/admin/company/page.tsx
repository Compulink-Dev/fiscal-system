// app/company/page.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  deleteCompany,
  getCompaniesForTable,
} from "@/app/actions/company-actions";
import toast from "react-hot-toast";
import { DeleteConfirmationDialog } from "../../_components/DeleteDialog";

export type Company = {
  id: string;
  _id: string;
  name: string;
  tradeName: string;
  tin: string;
  vatNumber: string;
  station: string;
  accountingSystem: string;
  address: {
    street: string;
    houseNo: string;
    city: string;
    province: string;
  };
  contacts: {
    phoneNo: string;
    email: string;
    mobile: string;
  };
};
export default function CompanyPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompaniesForTable();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedCompanyId) return;
    const toastId = toast.loading("Deleting company...");
    try {
      await deleteCompany(selectedCompanyId);
      toast.success("Company deleted successfully", { id: toastId });
      setCompanies((prev) =>
        prev.filter((company) => company._id !== selectedCompanyId)
      );
    } catch (error) {
      console.log(error);

      toast.error("Error deleting company", { id: toastId });
    } finally {
      setIsDialogOpen(false);
      setSelectedCompanyId(null);
    }
  };

  const columns: ColumnDef<Company>[] = [
    { accessorKey: "name", header: "Company Name" },
    { accessorKey: "tradeName", header: "Trade Name" },
    { accessorKey: "tin", header: "TIN" },
    { accessorKey: "vatNumber", header: "VAT Number" },
    { accessorKey: "station", header: "Station" },
    { accessorKey: "accountingSystem", header: "Accounting System" },
    { accessorKey: "address.city", header: "City" },
    { accessorKey: "contacts.email", header: "Email" },
    {
      id: "actions",
      cell: ({ row }) => {
        const company = row.original;
        const handleOpenDeleteDialog = () => {
          setSelectedCompanyId(company._id);
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
                onClick={() => navigator.clipboard.writeText(company._id)}
              >
                Copy company ID
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/company/${company._id}`}
                  className="flex items-center w-full"
                >
                  Edit company
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenDeleteDialog}>
                <p className="text-red-600">Delete company</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold mb-6">Companies</h1>
        <Button className="button">
          <Link href={"/admin/company/create"} className="flex items-center">
            <Plus className="mr-2" />
            Add Company
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={companies} searchKey="name" />

      <DeleteConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
