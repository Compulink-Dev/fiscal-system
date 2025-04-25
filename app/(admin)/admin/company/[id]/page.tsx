// app/admin/company/[id]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCompanyById,
  updateCompanyAction,
} from "@/app/actions/company-actions";
import { CompanyRegistrationForm } from "@/components/forms/EditCoRegistration";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";

export type CompanyDetails = {
  id: string;
  createdById: string;
  deviceId: string;
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
  primaryContact: {
    name: string;
  };
  authorizedPersons: Array<{
    name: string;
    designation: string;
    signature: string;
    date: string;
  }>;
};

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [company, setCompany] = React.useState<CompanyDetails | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCompany = async () => {
      try {
        const result = await getCompanyById(companyId);
        if (result.success && result.company) {
          const parsedCompany = {
            ...result.company,
            address:
              typeof result.company.address === "string"
                ? JSON.parse(result.company.address)
                : result.company.address,
            contacts:
              typeof result.company.contacts === "string"
                ? JSON.parse(result.company.contacts)
                : result.company.contacts,
            primaryContact:
              typeof result.company.primaryContact === "string"
                ? JSON.parse(result.company.primaryContact)
                : result.company.primaryContact,
            authorizedPersons:
              typeof result.company.authorizedPersons === "string"
                ? JSON.parse(result.company.authorizedPersons)
                : result.company.authorizedPersons,
          };
          setCompany(parsedCompany);
        } else {
          throw new Error("Company not found");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load company"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleUpdate = async (data: any) => {
    try {
      const result = await updateCompanyAction(companyId, data);
      if (result.success) {
        toast.success("Company updated successfully");
        router.push("/admin/company");
      } else {
        throw new Error(result.error || "Failed to update company");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update company"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Edit Company</h1>
        <BackButton />
      </div>
      <CompanyRegistrationForm
        createdById={company.createdById}
        defaultValues={{
          deviceId: company.deviceId,
          companyName: company.name,
          companyTradeName: company.tradeName,
          zimraDetails: {
            vatNumber: company.vatNumber,
            tin: company.tin,
          },
          companyAddress: {
            streetNo: company.address.houseNo,
            streetName: company.address.street,
            city: company.address.city,
            telephone: company.contacts.phoneNo,
          },
          primaryContact: {
            name: company.primaryContact.name,
            email: company.contacts.email,
            mobile: company.contacts.mobile,
          },
          station: company.station,
          accountingSystem: company.accountingSystem,
          authorizedPersons: company.authorizedPersons,
        }}
        onSubmit={handleUpdate}
        isEditMode={true}
      />
    </div>
  );
}
