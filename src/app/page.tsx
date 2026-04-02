import HomePageClient from "@/components/homepage/HomePageClient";
import { tools } from "@/lib/tools";
import type { Metadata } from "next";

const SITE_URL = process.env.SITE_URL || "https://tools.praveensingh.online";

export const metadata: Metadata = {
  title: "Online Calculators and Utilities",
  description:
    "Use 19+ free online calculators and utility tools including EMI, GST, BMI, currency converter, invoice generator, and more.",
  keywords: [
    "online tools",
    "free calculators",
    "emi calculator",
    "gst calculator",
    "bmi calculator",
    "currency converter",
    "invoice generator",
    "productivity tools",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "ToolifyLab - Online Calculators and Utilities",
    description:
      "A fast and free collection of online calculators and utility tools for finance, health, productivity, and daily use.",
    url: SITE_URL,
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolifyLab - Online Calculators and Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolifyLab - Online Calculators and Utilities",
    description:
      "A free collection of online calculators and utility tools for finance, health, and productivity.",
    creator: "@its_praveen_s",
    images: ["/og-image.png"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ToolifyLab",
  url: SITE_URL,
  description:
    "A professional collection of calculators and utility tools for finance, health, productivity, and daily use.",
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: "ToolifyLab",
    url: SITE_URL,
  },
};

const toolsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "ToolifyLab Tools Directory",
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.name,
    url: `${SITE_URL}/${tool.id}`,
  })),
};

export default function Dashboard() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsListSchema) }}
      />
      <HomePageClient />
    </>
  );
}
