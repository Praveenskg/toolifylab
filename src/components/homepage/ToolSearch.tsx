"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { motion, useInView } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

interface ToolSearchProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: { name: string; count: number }[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function ToolSearch({
  selectedCategory,
  setSelectedCategory,
  categories,
  searchTerm,
  setSearchTerm,
}: ToolSearchProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [isFocused, setIsFocused] = useState(false);

  // Generate stable random values for particles
  const particleConfigs = useMemo(() => {
    const generateRandom = () => {
      const values: number[] = [];
      for (let i = 0; i < 32; i++) {
        values.push(Math.random());
      }
      return values;
    };
    const randoms = generateRandom();
    let idx = 0;
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: randoms[idx++] * 100 - 50,
      y: randoms[idx++] * 100 - 50,
      duration: randoms[idx++] * 2 + 2,
      delay: randoms[idx++] * 2,
      left: randoms[idx++] * 100,
      top: randoms[idx++] * 100,
    }));
  }, []);

  return (
    <motion.div
      ref={ref}
      id="tools"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8 sm:py-12"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Discover Your{" "}
            <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Perfect Tool
            </span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Search through our comprehensive collection of professional tools and calculators
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative mx-auto mb-8 max-w-lg"
        >
          {/* Floating particles around search */}
          {isFocused && (
            <div className="pointer-events-none absolute -inset-4">
              {particleConfigs.map(particle => (
                <motion.div
                  key={particle.id}
                  className="bg-primary/40 absolute h-1 w-1 rounded-full"
                  animate={{
                    x: [0, particle.x],
                    y: [0, particle.y],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                />
              ))}
            </div>
          )}

          <InputGroup
            className={`bg-background/50 hover:bg-background/80 backdrop-blur-sm transition-all duration-300 ${
              isFocused
                ? "border-primary shadow-primary/20 scale-105 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
          >
            <InputGroupAddon align="inline-start">
              <motion.div
                animate={
                  isFocused
                    ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Search
                  className={`h-5 w-5 transition-colors ${
                    isFocused ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </motion.div>
            </InputGroupAddon>

            <InputGroupInput
              type="text"
              placeholder="Search tools, calculators, converters..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="text-base"
            />

            {searchTerm && (
              <InputGroupAddon align="inline-end">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm("")}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </InputGroupAddon>
            )}
          </InputGroup>

          {/* Search suggestions */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card absolute top-full right-0 left-0 z-10 mt-2 rounded-lg border p-2 shadow-lg"
            >
              <div className="text-muted-foreground text-xs">
                {categories.find(cat =>
                  cat.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) ? (
                  <span>Try filtering by category below</span>
                ) : (
                  <span>Search across all tools</span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "from-primary to-primary/80 shadow-primary/25 bg-gradient-to-r shadow-lg"
                      : "hover:bg-primary/10 hover:border-primary/50"
                  }`}
                >
                  {selectedCategory === category.name && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  <span className="relative z-10">{category.name}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10"
                  >
                    <Badge
                      variant={selectedCategory === category.name ? "default" : "secondary"}
                      className="ml-2 text-xs"
                    >
                      {category.count}
                    </Badge>
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results count */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-muted-foreground mt-6 text-sm"
          >
            {categories.some(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
              ? "Filtering by search and category..."
              : "Searching across all tools..."}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
