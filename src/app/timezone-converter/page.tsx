import TimeZoneConverter from "@/components/tools/timezone-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TimeZoneConverterPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Timezone Converter
              </h1>
              <p className="text-muted-foreground text-lg">
                Convert time between different timezones and track world clocks
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
                <TimeZoneConverter />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Timezone Converter - Convert Time Across Zones | Tools by Praveen Singh",
  description:
    "Easily convert time between different timezones. Supports all major cities and countries. Great for scheduling global meetings.",
  keywords: [
    "timezone converter",
    "convert timezone",
    "world clock",
    "global time converter",
    "india to usa time",
    "meeting scheduler",
    "time difference calculator",
    "international time",
    "time zone tool",
    "timezone calculator",
  ],
  openGraph: {
    title: "Timezone Converter - Convert Time Across Zones | Tools by Praveen Singh",
    description:
      "Convert time between multiple timezones easily. Supports real-time and future time comparison with location support.",
    url: "https://tools.praveensingh.online/timezone-converter",
    siteName: "Tools by Praveen Singh",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://tools.praveensingh.online/og/timezone-converter.png",
        width: 1200,
        height: 630,
        alt: "Timezone Converter OpenGraph Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timezone Converter - Convert Time Across Zones | Tools by Praveen Singh",
    description:
      "Easily convert time between cities and countries. Perfect for remote teams, global meetings, and travelers.",
    images: ["https://tools.praveensingh.online/og/timezone-converter.png"],
  },
};
