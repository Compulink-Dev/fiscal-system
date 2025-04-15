// schemas/company.ts
import { z } from 'zod';

const stations = [
  'Beitbridge',
  'Bindura',
  'Bulawayo Mhlahlandlela',
  'Chinhoyi',
  'Chipinge',
  'Chiredzi',
  'Gwanda',
  'Gweru',
  'Hwange',
  'Kadoma',
  'Kariba',
  'Kwekwe',
  'LCO Kurima',
  'Marondera',
  'Masvingo',
  'MCO Kurima',
  'Mutare',
  'Rusape',
  'SCO Kurima',
  'Victoria Falls Town Office',
  'Zvishavane'
] as const;

const accountingSystems = [
  'Excel',
  'Quickbooks',
  'Sage Pastel',
  'Odoo',
  'SAP',
  'Palladium',
] as const;

export const companyRegistrationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyTradeName: z.string().min(1, "Trade name is required"),
  zimraDetails: z.object({
    vatNumber: z.string().min(1, "VAT number is required"),
    tin: z.string().min(1, "TIN is required")
  }),
  companyAddress: z.object({
    streetNo: z.string().min(1, "Street number is required"),
    streetName: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City is required"),
    telephone: z.string().min(1, "Telephone is required")
  }),
  primaryContact: z.object({
    name: z.string().min(1, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(1, "Mobile number is required")
  }),
  station: z.enum(stations),
  accountingSystem: z.enum(accountingSystems),
  vatCertificate: z.any().optional(),
  authorizedPersons: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      designation: z.string().min(1, "Designation is required"),
      signature: z.string().min(1, "Signature is required"),
      date: z.string().min(1, "Date is required")
    })
  ).min(1, "At least one authorized person is required")
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;