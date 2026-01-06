"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  popular: boolean;
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <AnimatePresence mode="popLayout">
        {tools
          .sort((a, b) => (a.popular === b.popular ? 0 : a.popular ? -1 : 1))
          .map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                  layout: { duration: 0.3 },
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                <Link href={`/${tool.id}`}>
                  <Card className="group from-card to-card/50 hover:shadow-primary/10 perspective-1000 relative h-full cursor-pointer overflow-hidden border-0 bg-linear-to-br shadow-lg transition-all duration-500 transform-3d hover:shadow-2xl">
                    {/* 3D hover effect */}
                    <div className="from-primary/5 to-primary/5 absolute inset-0 bg-linear-to-br via-transparent opacity-0 transition-all duration-500 group-hover:rotate-x-2 group-hover:opacity-100" />

                    {/* Animated background gradient */}
                    <div className="from-primary/5 to-primary/5 absolute inset-0 bg-linear-to-br via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Glass morphism overlay */}
                    <div className="glass absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <CardHeader className="relative pb-4">
                      <div className="flex items-start justify-between">
                        <motion.div
                          className="flex items-center gap-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="bg-primary/10 absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <motion.div
                              whileHover={{
                                scale: 1.2,
                                rotate: [0, 10, -10, 0],
                                y: [0, -5, 0],
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon className="text-primary relative z-10 h-6 w-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 sm:h-7 sm:w-7" />
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="group-hover:text-primary text-lg font-semibold transition-colors duration-300 sm:text-xl">
                              {tool.name}
                            </CardTitle>
                            {tool.popular && (
                              <div className="mt-1">
                                <Badge variant="secondary" className="text-xs font-medium">
                                  ⭐ Popular
                                </Badge>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      <CardDescription className="group-hover:text-foreground/90 mb-4 text-sm leading-relaxed transition-colors duration-300">
                        {tool.description}
                      </CardDescription>

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:text-primary border-primary/30 text-xs font-medium transition-all duration-300"
                        >
                          {tool.category}
                        </Badge>

                        <motion.div
                          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          initial={{ x: -10, scale: 0.8 }}
                          whileHover={{ x: 0, scale: 1.1 }}
                          animate={{
                            x: [0, 2, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <motion.svg
                            className="text-primary h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 15 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </motion.svg>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}
