"use client";

import { FeaturedTools } from "@/components/homepage/FeaturedTools";
import { HeroSection } from "@/components/homepage/HeroSection";
import { NewsletterSignup } from "@/components/homepage/NewsletterSignup";
import { ToolGrid } from "@/components/homepage/ToolGrid";
import { ToolSearch } from "@/components/homepage/ToolSearch";
import { tools } from "@/lib/tools";
import { useState } from "react";

const categories = [
  { name: "All Tools", count: tools.length },
  {
    name: "Financial",
    count: tools.filter(t => t.category === "Financial").length,
  },
  { name: "Health", count: tools.filter(t => t.category === "Health").length },
  {
    name: "Date & Time",
    count: tools.filter(t => t.category === "Date & Time").length,
  },
  { name: "Math", count: tools.filter(t => t.category === "Math").length },
  {
    name: "Conversion",
    count: tools.filter(t => t.category === "Conversion").length,
  },
  {
    name: "Planning",
    count: tools.filter(t => t.category === "Planning").length,
  },
  {
    name: "Utility",
    count: tools.filter(t => t.category === "Utility").length,
  },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All Tools");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === "All Tools" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTools = tools.filter(tool => tool.popular).slice(0, 4);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedTools tools={featuredTools} />
      <main className="flex-1">
        <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
          <ToolSearch
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ToolGrid tools={filteredTools} />
        </div>
      </main>
      <NewsletterSignup />
    </div>
  );
}
