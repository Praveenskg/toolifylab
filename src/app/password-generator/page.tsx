import PasswordGenerator from "@/components/tools/password-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function PasswordGeneratorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Password Generator
              </h1>
              <p className="text-muted-foreground text-lg">
                Generate secure, customizable passwords with strength analysis
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
                <PasswordGenerator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Password Generator",
  description:
    "Generate secure, customizable passwords with strength analysis. Create strong passwords for all your accounts with our advanced password generator.",
  keywords: [
    "password generator",
    "secure password",
    "password strength",
    "random password",
    "password security",
    "strong password",
    "password tool",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/password-generator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "security",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Password Generator | ToolifyLab",
    description:
      "Generate secure, customizable passwords with strength analysis. Create strong passwords for all your accounts.",
    url: "https://tools.praveensingh.online/password-generator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/password-generator.png",
        width: 1200,
        height: 630,
        alt: "Password Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator | ToolifyLab",
    description:
      "Generate secure passwords with customizable options and strength analysis. Perfect for creating strong passwords for all your accounts.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/password-generator.png"],
  },
};
