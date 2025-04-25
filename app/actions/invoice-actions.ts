// app/actions/invoice-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: any) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        companyId: data.company,
      },
    });
    revalidatePath("/invoices");
    return { success: true, invoice };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function updateInvoice(id: string, data: any) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data,
    });
    revalidatePath(`/invoices/${id}`);
    return { success: true, invoice };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/invoices");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
    return { success: true, invoice };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getInvoicesByCompany(companyId: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { companyId },
      orderBy: { receiptDate: "desc" },
    });
    return { success: true, invoices };
  } catch (error) {
    return { success: false, error: error };
  }
}