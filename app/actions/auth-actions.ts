// app/actions/auth-actions.ts
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function signInAction(email: string, password: string) {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        return { error: "Invalid credentials" };
      }
      return { error: "Something went wrong" };
    }
  
    redirect("/dashboard");
  }

export async function signUpAction(
  name: string,
  email: string,
  password: string,
  companyId: string
) {
  try {
    // Your user creation logic here
    // Example:
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        companyId,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Registration failed" 
    };
  }
}