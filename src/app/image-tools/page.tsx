import ImageTools from "@/components/tools/image-tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ImageToolsPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Image Processing Tools
              </h1>
              <p className="text-muted-foreground mt-2 text-base sm:text-lg">
                Professional image editing and processing tools in one place
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:my-6 sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <ImageTools />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Image Tools - Convert, Resize, Compress, and More",
  description:
    "Explore a range of free online image tools to convert, resize, compress, crop, and optimize images easily on tools.praveensingh.online.",
  keywords: [
    "image tools",
    "image converter",
    "resize image",
    "compress image",
    "crop image",
    "optimize image",
    "free online tools",
    "tools.praveensingh.online",
    "image editing online",
    "image format converter",
  ],
  openGraph: {
    title: "Image Tools - Convert, Resize, Compress, and More",
    description:
      "A suite of powerful and free image tools to help you convert, resize, compress, crop, and optimize images quickly and efficiently.",
    url: "https://tools.praveensingh.online/image-tools",
    siteName: "Tools by Praveen Singh",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://tools.praveensingh.online/og-image-tools.png",
        width: 1200,
        height: 630,
        alt: "Image Tools - tools.praveensingh.online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Tools - Convert, Resize, Compress, and More",
    description:
      "Convert, resize, compress, crop, and optimize your images easily using the free Image Tools at tools.praveensingh.online.",
    images: ["https://tools.praveensingh.online/og-image-tools.png"],
  },
};
