// components/forms/CompanyRegistrationForm.tsx
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  CompanyRegistrationFormData,
  companyRegistrationSchema,
} from "@/schemas/Company";
import { useRouter } from "next/navigation";
import { registerCompanyAction } from "@/app/actions/company-actions";
import toast from "react-hot-toast";

// ... (stations and accountingSystems arrays remain the same)
const stations = [
  "Harare",
  "Beitbridge",
  "Bindura",
  "Bulawayo Mhlahlandlela",
  "Chinhoyi",
  "Chipinge",
  "Chiredzi",
  "Gwanda",
  "Gweru",
  "Hwange",
  "Kadoma",
  "Kariba",
  "Kwekwe",
  "LCO Kurima",
  "Marondera",
  "Masvingo",
  "MCO Kurima",
  "Mutare",
  "Rusape",
  "SCO Kurima",
  "Victoria Falls Town Office",
  "Zvishavane",
] as const;

const accountingSystems = [
  "Excel",
  "Palladium",
  "Quickbooks",
  "Sage Pastel",
  "Odoo",
  "Retailman",
  "SAP",
  "Zoho",
  "Propharm",
  "Tally Prime",
  "Havana",
  "Meat matrix",
  "Protal",
] as const;

// Adjust this type to match what you are passing from the page
type CompanyRegistrationFormProps = {
  createdById: string;
  defaultValues?: {
    deviceId: string;
    companyName: string;
    companyTradeName: string;
    zimraDetails: {
      vatNumber: string;
      tin: string;
    };
    companyAddress: {
      streetNo: string;
      streetName: string;
      city: string;
      telephone: string;
    };
    primaryContact: {
      name: string;
      email: string;
      mobile: string;
    };
    station: string;
    accountingSystem: string;
    authorizedPersons: Array<{
      name: string;
      designation: string;
      signature: string;
      date: string;
    }>;
  };
  onSubmit?: (data: any) => Promise<void>;
  isEditMode?: boolean;
};

export const CompanyRegistrationForm: React.FC<
  CompanyRegistrationFormProps
> = ({ createdById, defaultValues, isEditMode = false }) => {
  const router = useRouter();
  const form = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: defaultValues as Partial<CompanyRegistrationFormData>,
  });

  const { reset } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authorizedPersons",
  });

  async function handleSubmit(data: CompanyRegistrationFormData) {
    try {
      const formData = new FormData();

      // Append all form data to FormData object
      formData.append("deviceId", data.deviceId);
      formData.append("companyName", data.companyName);
      formData.append("companyTradeName", data.companyTradeName);
      formData.append("zimraDetails.vatNumber", data.zimraDetails.vatNumber);
      formData.append("zimraDetails.tin", data.zimraDetails.tin);
      formData.append("companyAddress.streetNo", data.companyAddress.streetNo);
      formData.append(
        "companyAddress.streetName",
        data.companyAddress.streetName
      );
      formData.append("companyAddress.city", data.companyAddress.city);
      formData.append(
        "companyAddress.telephone",
        data.companyAddress.telephone
      );
      formData.append("primaryContact.name", data.primaryContact.name);
      formData.append("primaryContact.email", data.primaryContact.email);
      formData.append("primaryContact.mobile", data.primaryContact.mobile);
      formData.append("station", data.station);
      // Other fields
      formData.append("station", data.station);
      formData.append("accountingSystem", data.accountingSystem);
      formData.append("createdBy", createdById);

      // JSON fields need to be stringified
      formData.append(
        "authorizedPersons",
        JSON.stringify(data.authorizedPersons)
      );

      if (data.vatCertificate) {
        formData.append("vatCertificate", data.vatCertificate);
      }

      const result = await registerCompanyAction(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Company registered successfully");
      reset();
      setTimeout(() => {
        router.push("/companies");
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
      console.error("Error during registration:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>

            <FormField
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyTradeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Trade Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="zimraDetails.vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="zimraDetails.tin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TIN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Company Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Address</h3>

            <FormField
              name="companyAddress.streetNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyAddress.streetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="companyAddress.telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Primary Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Contact</h3>

          <FormField
            name="primaryContact.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="primaryContact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="primaryContact.mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Station and Accounting System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="station"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Station</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="accountingSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accounting System</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accounting system" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountingSystems.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* VAT Certificate Upload */}
        <FormField
          name="vatCertificate"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>VAT Registration Certificate</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Authorized Persons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Authorized Persons</h3>

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Person {index + 1}</h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name={`authorizedPersons.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`authorizedPersons.${index}.designation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name={`authorizedPersons.${index}.signature`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signature</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`authorizedPersons.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ name: "", designation: "", signature: "", date: "" })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Authorized Person
          </Button>
        </div>

        <Button type="submit" className="w-full button">
          {isEditMode ? "Update Registration" : "Submit Registration"}
        </Button>
      </form>
    </Form>
  );
  // ... (rest of the form JSX remains the same)
};
