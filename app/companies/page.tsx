// app/register/company/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CompanyRegistrationForm } from "@/components/forms/CoRegisration";

export default async function CompanyRegistrationPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not admin
  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Company Registration</CardTitle>
          <CardDescription>
            Fill out the form below to register your company for virtual
            fiscalisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyRegistrationForm createdById={session.user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
