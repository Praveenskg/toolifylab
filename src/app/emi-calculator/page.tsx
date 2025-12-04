import { Metadata } from "next";
import EMICalculatorPageClient from "./client";

export default function EMICalculatorPage() {
  return <EMICalculatorPageClient />;
}

export const metadata: Metadata = {
  title: "EMI Calculator",
  description:
    "Calculate EMI for home loans, personal loans, car loans, and credit card payments instantly using our free EMI calculator tool.",
  keywords: [
    "emi calculator",
    "loan calculator",
    "home loan emi calculator",
    "car loan emi calculator",
    "personal loan emi calculator",
    "credit card emi calculator",
    "monthly payment calculator",
    "loan repayment tool",
    "smart tools",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/emi-calculator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "financial",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EMI Calculator | ToolifyLab",
    description:
      "Easily calculate monthly EMIs for home loans, car loans, personal loans, and credit card payments with our accurate online EMI calculator.",
    url: "https://tools.praveensingh.online/emi-calculator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/emi-calculator.png",
        width: 1200,
        height: 630,
        alt: "EMI Calculator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator | ToolifyLab",
    description:
      "Free EMI Calculator for home, car, personal loans, and credit card payments. Plan your finances with ease.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/emi-calculator.png"],
  },
};
