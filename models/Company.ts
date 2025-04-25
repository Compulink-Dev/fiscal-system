// models/Company.ts
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  name: { type: String, required: true },
  tradeName: { type: String, required: true },
  tin: { type: String, unique: true, required: true },
  vatNumber: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    houseNo: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true }
  },
  contacts: {
    phoneNo: { type: String, required: true },
    email: { 
      type: String, 
      required: true, // Make email required
      unique: true 
    },
    mobile: { type: String, required: true }
  },
  primaryContact: {
    name: { type: String, required: true }
  },
  station: { type: String, required: true },
  accountingSystem: { type: String, required: true },
  authorizedPersons: [{
    name: { type: String, required: true },
    designation: { type: String, required: true },
    signature: { type: String, required: true },
    date: { type: String, required: true }
  }],
  operatingMode: { type: String, enum: ['Online', 'Offline'], default: 'Online', required: true },
  vatCertificatePath: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.models?.Company || mongoose.model('Company', companySchema);
