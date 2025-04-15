// app/api/companies/register/route.ts
import { NextResponse } from 'next/server';
import { Company } from '@/models/Company';
import { dbConnect } from '@/lib/database';



export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find({}, "_id name");
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
