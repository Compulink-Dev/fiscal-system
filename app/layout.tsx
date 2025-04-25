import type { Metadata } from "next";
import "./globals.css";
import { SessionProviderWrapper } from "@/services/sessionWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Fiscal Gem",
  description: "Fiscal Gem is a software solution for managing fiscal devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper> <Toaster />
      </body>
    </html>
  );
}
