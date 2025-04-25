"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

// Register required Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface SessionUser {
  name?: string;
  email?: string;
  role?: string;
  companyId?: string;
}

interface CompanyData {
  device?: string;
  name?: string;
  tradeName?: string;
  tin?: string;
  vatNumber?: string;
  address?: {
    street?: string;
    houseNo?: string;
    city?: string;
    province?: string;
  };
  contacts?: {
    phoneNo?: string;
    email?: string;
    mobile?: string;
  };
  primaryContact?: {
    name?: string;
  };
  station?: string;
  accountingSystem?: string;
  createdBy?: string;
  createdAt?: Date;
  authorizedPersons?: {
    name?: string;
    designation?: string;
    signature?: string;
    date?: string;
  }[];
  vatCertificatePath?: string;
  operatingMode?: string;
}

function Dashboard() {
  const { data: session } = useSession();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Extract user data from the session
  const user = session?.user as SessionUser;

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!session?.user) return;

        // Type assertion for companyId
        const companyId = (session.user as any).companyId;
        if (!companyId) {
          setError("Company ID not found in session");
          return;
        }

        const response = await fetch("/api/companies");
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const companyData = await response.json();
        setCompany(companyData);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [session]);

  console.log("Session:", session);
  console.log("Company data:", company);
  console.log("error:", error);

  // Sample statistics
  const stats = {
    totalReceipts: 0,
    submittedInvoices: 5,
    storedInvoices: 12,
    issuedInvoices: 28,
  };

  // Data for the bar chart
  const barChartData = {
    labels: [
      "Receipts",
      "Submitted Invoices",
      "Stored Invoices",
      "Issued Invoices",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          stats.totalReceipts,
          stats.submittedInvoices,
          stats.storedInvoices,
          stats.issuedInvoices,
        ],
        backgroundColor: ["#34D399", "#059669", "#F87171", "#059669"],
        borderColor: ["#059669", "#34D399", "#DC2626", "#34D399"],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistics Overview",
      },
    },
  };

  // Format address if it exists
  const formatAddress = (address: any) => {
    if (!address) return "N/A";
    return `${address.houseNo || ""} ${address.street || ""}, ${
      address.city || ""
    }`.trim();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 h-full my-4">
        {/* Fiscal Day Information */}
        <div className="border p-4 rounded space-y-4 text-sm text-slate-500">
          <p className="text-lg font-bold text-black">Fiscal Day</p>
          <p>Date Time</p>
          <div className="flex gap-2">
            <p>Global Number:</p>
            <p>34</p>
          </div>
          <div className="flex gap-2">
            <p>Receipt Counter:</p>
            <p>56</p>
          </div>
          <div className="flex gap-2">
            <p>Status:</p>
            <p>Fiscal Day Closed</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="col-span-2 p-4 rounded border">
          <p className="text-lg font-bold text-black">Account Details</p>
          <div className="text-sm text-slate-500 space-y-1">
            <div className="flex gap-2">
              <p>Account Name:</p>
              <p>{user?.name || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Email:</p>
              <p>{user?.email || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Role:</p>
              <p className="capitalize">{user?.role || "N/A"}</p>
            </div>

            <div className="flex gap-2 mt-2">
              <p className="text-lg font-bold text-black">Company Details</p>
            </div>
            <div className="flex gap-2">
              <p>Device:</p>
              <p>{company?.device || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Company Name:</p>
              <p>{company?.name || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Trade Name:</p>
              <p>{company?.tradeName || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Company Email:</p>
              <p>{company?.contacts?.email || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Phone:</p>
              <p>{company?.contacts?.phoneNo || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Mobile:</p>
              <p>{company?.contacts?.mobile || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Address:</p>
              <p>{formatAddress(company?.address)}</p>
            </div>
            <div className="flex gap-2">
              <p>TIN:</p>
              <p>{company?.tin || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>VAT Number:</p>
              <p>{company?.vatNumber || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Station:</p>
              <p>{company?.station || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Accounting System:</p>
              <p>{company?.accountingSystem || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <p>Primary Contact:</p>
              <p>{company?.primaryContact?.name || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm font-semibold">Receipts</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalReceipts}
          </p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm font-semibold">Submitted Invoices</p>
          <p className="text-2xl font-bold text-green-900">
            {stats.submittedInvoices}
          </p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm font-semibold">Stored Invoices</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.storedInvoices}
          </p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <p className="text-sm font-semibold">Issued Invoices</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.issuedInvoices}
          </p>
        </Card>
      </div>

      {/* Bar Chart */}
      <div className="bg-white mt-4 shadow rounded-lg hidden md:flex">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
