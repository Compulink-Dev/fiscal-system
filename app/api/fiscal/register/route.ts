import { NextResponse } from 'next/server';
import  Company  from '@/models/Company';

import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/database';
import { authOptions } from '@/lib/auth';


export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { deviceId, activationKey, certificateRequest } = await request.json();

  try {
    // Verify taxpayer information first (call ZIMRA API)
    const verifyResponse = await fetch('https://fdmsapi.zimra.co.zw/verifyTaxpayerInformation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceModelName': 'YourDeviceModel',
        'DeviceModelVersionNo': '1.0'
      },
      body: JSON.stringify({
        deviceID: deviceId,
        activationKey,
        deviceSerialNo: 'YOUR_SERIAL_NO'
      })
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json();
      return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 400 });
    }

    const verifyData = await verifyResponse.json();

    // Register device with ZIMRA
    const registerResponse = await fetch('https://fdmsapi.zimra.co.zw/registerDevice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceModelName': 'YourDeviceModel',
        'DeviceModelVersionNo': '1.0'
      },
      body: JSON.stringify({
        deviceID: deviceId,
        activationKey,
        certificateRequest
      })
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
    }

    const registerData = await registerResponse.json();

    // Update company with device registration details
    //@ts-expect-error comapany is not defined
    const company = await Company.findByIdAndUpdate(session.user.company, {
      deviceId,
      activationKey,
      certificate: registerData.certificate,
      deviceSerialNo: verifyData.deviceSerialNo,
      operatingMode: verifyData.deviceOperatingMode
    }, { new: true });

    return NextResponse.json({ 
      message: 'Device registered successfully',
      company,
      certificate: registerData.certificate
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}