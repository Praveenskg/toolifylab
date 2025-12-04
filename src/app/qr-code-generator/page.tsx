import QRCodeGenerator from "@/components/tools/qr-code-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function QRCodeGeneratorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                QR Code Generator
              </h1>
              <p className="text-muted-foreground text-lg">
                Create custom QR codes for URLs, text, emails, and more
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
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "QR Code Generator",
  description:
    "Generate high-quality QR codes instantly for URLs, text, emails, phone numbers, and more. Free and easy-to-use QR code generator.",
  keywords: [
    "qr code generator",
    "free qr generator",
    "online qr code",
    "generate qr code",
    "custom qr code",
    "qr tool",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/qr-code-generator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "utilities",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "QR Code Generator | ToolifyLab",
    description:
      "Create QR codes for websites, text, email, contact info, and more. Quick, customizable, and completely free.",
    url: "https://tools.praveensingh.online/qr-code-generator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/qr-code-generator.png",
        width: 1200,
        height: 630,
        alt: "QR Code Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator | ToolifyLab",
    description:
      "Generate custom QR codes online for free — perfect for links, WiFi, contact cards, and more.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/qr-code-generator.png"],
  },
};
