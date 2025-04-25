// app/api/test-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { password } = await request.json();
  const storedHash = '$2b$12$/AyKm60dMiiZcuuWByt/DueOqJpkG4YxjftyIjkdY4VrDuKFESaJO';
  
  const isMatch = await bcrypt.compare(password, storedHash);
  return NextResponse.json({ isMatch });
}