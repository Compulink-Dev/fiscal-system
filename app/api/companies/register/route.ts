// app/api/companies/register/route.ts
import { NextResponse } from 'next/server';
import { Company } from '@/models/Company';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/database';
import { companyRegistrationSchema } from '@/schemas/Company';



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

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Reconstruct the nested objects from FormData
    const data: Record<string, any> = {
      companyName: formData.get('companyName'),
      companyTradeName: formData.get('companyTradeName'),
      station: formData.get('station'),
      accountingSystem: formData.get('accountingSystem'),
      zimraDetails: {
        vatNumber: formData.get('zimraDetails.vatNumber'),
        tin: formData.get('zimraDetails.tin')
      },
      companyAddress: {
        streetNo: formData.get('companyAddress.streetNo'),
        streetName: formData.get('companyAddress.streetName'),
        city: formData.get('companyAddress.city'),
        telephone: formData.get('companyAddress.telephone')
      },
      primaryContact: {
        name: formData.get('primaryContact.name'),
        email: formData.get('primaryContact.email'),
        mobile: formData.get('primaryContact.mobile')
      },
      vatCertificate: formData.get('vatCertificate')
    };

    // Process authorizedPersons array
    const authorizedPersons = [];
    let index = 0;
    while (formData.has(`authorizedPersons[${index}].name`)) {
      authorizedPersons.push({
        name: formData.get(`authorizedPersons[${index}].name`),
        designation: formData.get(`authorizedPersons[${index}].designation`),
        signature: formData.get(`authorizedPersons[${index}].signature`),
        date: formData.get(`authorizedPersons[${index}].date`)
      });
      index++;
    }
    data.authorizedPersons = authorizedPersons;

    // Validate with Zod
    const validatedData = companyRegistrationSchema.parse(data);

    // Transform to database model
    const companyData = {
      name: validatedData.companyName,
      tradeName: validatedData.companyTradeName,
      tin: validatedData.zimraDetails.tin,
      vatNumber: validatedData.zimraDetails.vatNumber,
      address: {
        street: validatedData.companyAddress.streetName,
        houseNo: validatedData.companyAddress.streetNo,
        city: validatedData.companyAddress.city,
        province: validatedData.station
      },
      contacts: {
        phoneNo: validatedData.companyAddress.telephone,
        email: validatedData.primaryContact.email,
        mobile: validatedData.primaryContact.mobile
      },
      primaryContact: {
        name: validatedData.primaryContact.name
      },
      station: validatedData.station,
      accountingSystem: validatedData.accountingSystem,
      authorizedPersons: validatedData.authorizedPersons,
      operatingMode: 'Online'
    };

    // Handle file upload
    const vatCertificateFile = validatedData.vatCertificate;
    let vatCertificatePath = '';
    
    if (vatCertificateFile) {
      vatCertificatePath = `/uploads/${vatCertificateFile.name}`;
      // Implement actual file upload in production
    }

    const company = await Company.create({
      ...companyData,
      vatCertificatePath,
      createdBy: session.user.id,
    });

    return NextResponse.json({ 
      success: true,
      companyId: company._id,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : String(error),
      }, 
      { status: 400 }
    );
  }
}