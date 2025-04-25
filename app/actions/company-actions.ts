// app/actions/company-actions.ts
"use server";


import { uploadFile } from "@/lib/file-upload";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCompany(data: any) {
  try {
    const company = await prisma.company.create({
      data: {
        ...data,
        createdById: data.createdBy,
      },
    });
    revalidatePath("/companies");
    return { success: true, company };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function updateCompany(id: string, data: any) {
  try {
    const company = await prisma.company.update({
      where: { id },
      data,
    });
    revalidatePath(`/companies/${id}`);
    return { success: true, company };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function deleteCompany(id: string) {
  try {
    await prisma.company.delete({
      where: { id },
    });
    revalidatePath("/companies");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}

// app/actions/company-actions.ts
// app/actions/company-actions.ts
// app/actions/company-actions.ts
export async function getCompaniesForTable() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        tradeName: true,
        tin: true,
        vatNumber: true,
        station: true,
        accountingSystem: true,
        address: true,
        contacts: true,
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return companies.map(company => {
      // Handle null/undefined address
      let address = { street: '', houseNo: '', city: '', province: '' };
      if (company.address) {
        address = typeof company.address === 'string' 
          ? JSON.parse(company.address) 
          : company.address;
      }

      // Handle null/undefined contacts
      let contacts = { phoneNo: '', email: '', mobile: '' };
      if (company.contacts) {
        contacts = typeof company.contacts === 'string'
          ? JSON.parse(company.contacts)
          : company.contacts;
      }

      return {
        ...company,
        _id: company.id,
        address,
        contacts
      };
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        invoices: true,
      },
    });
    return { success: true, company };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getAllCompanies() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        users: true,
      },
    });
    return { success: true, companies };
  } catch (error) {
    return { success: false, error: error };
  }
}

// app/actions/company-actions.ts
// app/actions/company-actions.ts
export async function getAllCompaniesAction() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { 
      success: true, 
      companies: companies.map(c => ({ id: c.id, name: c.name })) 
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch companies" 
    };
  }
}
// app/actions/company-actions.ts
// app/actions/company-actions.ts
export async function registerCompanyAction(formData: FormData) {
  try {
    // Handle file upload if present
    let vatCertificatePath = "";
    const vatCertificate = formData.get("vatCertificate") as File | null;
    
    if (vatCertificate && vatCertificate.size > 0) {
      vatCertificatePath = await uploadFile(vatCertificate);
    }

    // Create properly typed address, contacts, etc.
    const address = {
      street: formData.get("companyAddress.streetName") as string || '',
      houseNo: formData.get("companyAddress.streetNo") as string || '',
      city: formData.get("companyAddress.city") as string || '',
      province: formData.get("companyAddress.province") as string || '',
    };

    const contacts = {
      phoneNo: formData.get("companyAddress.telephone") as string || '',
      email: formData.get("primaryContact.email") as string || '',
      mobile: formData.get("primaryContact.mobile") as string || '',
    };

    const primaryContact = {
      name: formData.get("primaryContact.name") as string,
    };

    const authorizedPersons = JSON.parse(formData.get("authorizedPersons") as string);

    // Create company
    const company = await prisma.company.create({
      data: {
        deviceId: formData.get("deviceId") as string,
        name: formData.get("companyName") as string,
        tradeName: formData.get("companyTradeName") as string,
        tin: formData.get("zimraDetails.tin") as string,
        vatNumber: formData.get("zimraDetails.vatNumber") as string,
        address, // Now properly typed
        contacts, // Now properly typed
        primaryContact, // Now properly typed
        station: formData.get("station") as string,
        accountingSystem: formData.get("accountingSystem") as string,
        authorizedPersons, // Now properly typed
        vatCertificatePath,
        createdById: formData.get("createdBy") as string,
      },
    });

    revalidatePath("/admin/company");
    return { success: true, company };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Registration failed" 
    };
  }
}

export async function updateCompanyAction(id: string, data: any) {
  try {
    // Handle file upload if present
    let vatCertificatePath = "";
    const vatCertificate = data.vatCertificate as File | null;
    
    if (vatCertificate && vatCertificate.size > 0) {
      vatCertificatePath = await uploadFile(vatCertificate);
    }

    // Prepare the update data with proper types
    const address = {
      street: data.companyAddress.streetName,
      houseNo: data.companyAddress.streetNo,
      city: data.companyAddress.city,
      province: "",
    };

    const contacts = {
      phoneNo: data.companyAddress.telephone,
      email: data.primaryContact.email,
      mobile: data.primaryContact.mobile,
    };

    const primaryContact = {
      name: data.primaryContact.name,
    };

    const authorizedPersons = JSON.parse(data.authorizedPersons);

    // Update the company
    const company = await prisma.company.update({
      where: { id },
      data: {
        deviceId: data.deviceId,
        name: data.companyName,
        tradeName: data.companyTradeName,
        tin: data.zimraDetails.tin,
        vatNumber: data.zimraDetails.vatNumber,
        address, // Now properly typed
        contacts, // Now properly typed
        primaryContact, // Now properly typed
        station: data.station,
        accountingSystem: data.accountingSystem,
        authorizedPersons, // Now properly typed
        ...(vatCertificatePath && { vatCertificatePath }),
      },
    });

    revalidatePath(`/admin/company/${id}`);
    return { success: true, company };
  } catch (error) {
    console.error("Update error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Update failed" 
    };
  }
}