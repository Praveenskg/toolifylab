import InvoiceGenerator from "@/components/tools/invoice-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function InvoiceGeneratorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Invoice Generator
              </h1>
              <p className="text-muted-foreground text-lg">
                Create professional invoices with multiple currencies, templates, and PDF export
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-6">
                <InvoiceGenerator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Invoice Generator",
  description:
    "Create professional invoices with multiple currencies, tax rates, templates, and PDF export. Perfect for freelancers, small businesses, and developers.",
  keywords: [
    "invoice generator",
    "create invoice",
    "free invoice template",
    "online billing tool",
    "PDF invoice generator",
    "invoice maker",
    "multiple currencies",
    "tax calculator",
    "freelancer invoice",
    "business invoice tool",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/invoice-generator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "business",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Invoice Generator | ToolifyLab",
    description:
      "Create professional invoices with multiple currencies, templates, and PDF export. Perfect for freelancers and small businesses.",
    url: "https://tools.praveensingh.online/invoice-generator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/invoice-generator.png",
        width: 1200,
        height: 630,
        alt: "Invoice Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Generator | ToolifyLab",
    description:
      "Create and download professional invoices online with multiple currencies and templates. Perfect for freelancers and businesses.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/invoice-generator.png"],
  },
};
