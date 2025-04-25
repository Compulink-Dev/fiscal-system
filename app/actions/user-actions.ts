// app/actions/user-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";


interface SignUpData {
  name: string;
  email: string;
  password: string;
  companyId: string;
}


export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  companyId: string;
}) {
  try {
    const hashedPassword = await hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId: data.companyId,
      },
    });
    
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: error.message };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath(`/admin/users/${id}`);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        subscriptions: true,
      },
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, users };
  } catch (error) {
    return { success: false, users: [], error };
  }
}

export async function signUpAction(data: SignUpData) {
  try {
    // Validate input
    if (!data.companyId || !data.companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return { success: false, error: "Invalid company ID" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId: data.companyId, // This should be a valid ObjectID
        role: "user", // Default role
      },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { 
      success: false, 
      error: error.message || "Registration failed" 
    };
  }
}