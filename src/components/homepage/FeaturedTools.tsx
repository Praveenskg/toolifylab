"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  popular: boolean;
}

export function FeaturedTools({ tools }: { tools: Tool[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="container mx-auto mb-10 px-3 py-6 sm:px-4 sm:py-8"
    >
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Featured Tools</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link key={tool.id} href={`/${tool.id}`}>
              <Card className="hover:border-primary group h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-primary h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    <CardTitle className="group-hover:text-primary text-base transition-colors duration-300">
                      {tool.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="group-hover:text-foreground text-xs transition-colors duration-300 sm:text-sm">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
