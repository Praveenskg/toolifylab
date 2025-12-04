import CurrencyConverter from "@/components/tools/currency-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function CurrencyConverterPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Currency Converter
              </h1>
              <p className="text-muted-foreground text-lg">
                Convert between different currencies with real-time exchange rates
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
                <CurrencyConverter />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Currency Converter",
  description:
    "Convert between currencies instantly using real-time exchange rates. Simple, accurate, and completely free currency converter tool.",
  keywords: [
    "currency converter",
    "exchange rate calculator",
    "real-time currency exchange",
    "convert USD to INR",
    "currency conversion tool",
    "online currency calculator",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/currency-converter",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "utilities",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Currency Converter | ToolifyLab",
    description:
      "Convert currencies instantly with up-to-date exchange rates. Fast, free, and accurate currency calculator by ToolifyLab.",
    url: "https://tools.praveensingh.online/currency-converter",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/currency-converter.png",
        width: 1200,
        height: 630,
        alt: "Currency Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Converter | ToolifyLab",
    description:
      "Easily convert between currencies using live exchange rates. A fast and accurate tool by ToolifyLab.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/currency-converter.png"],
  },
};
