// app/(tools)/prompt-generator/page.tsx

import GeneratePrompt from "@/components/tools/prompt-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export default function PromptGeneratorPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Prompt Generator
              </h1>
              <p className="text-muted-foreground text-lg">
                Generate creative, funny, formal, or custom AI prompts instantly!
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
                <GeneratePrompt />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Prompt Generator",
  description:
    "Generate powerful and creative AI prompts for any use case — funny, formal, casual, or creative. Free and easy-to-use tool.",
  keywords: [
    "prompt generator",
    "AI prompt tool",
    "funny prompts",
    "creative prompts",
    "ChatGPT prompt ideas",
    "smart tools",
    "custom prompt generator",
  ],
  alternates: {
    canonical: "https://tools.praveensingh.online/prompt-generator",
  },
  metadataBase: new URL("https://tools.praveensingh.online"),
  applicationName: "ToolifyLab",
  category: "utilities",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Prompt Generator | ToolifyLab",
    description:
      "Generate AI prompts easily for chat, creativity, writing, and more. Select styles like funny, formal, or creative!",
    url: "https://tools.praveensingh.online/prompt-generator",
    type: "website",
    siteName: "ToolifyLab",
    locale: "en_US",
    images: [
      {
        url: "https://tools.praveensingh.online/og/prompt-generator.png",
        width: 1200,
        height: 630,
        alt: "Prompt Generator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Generator | ToolifyLab",
    description:
      "Free prompt generator tool to create ChatGPT prompts in different styles like funny, formal, or creative.",
    creator: "@its_praveen_s",
    images: ["https://tools.praveensingh.online/og/prompt-generator.png"],
  },
};
