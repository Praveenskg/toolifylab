"use client";

import { MobilePWAMenu } from "@/components/mobile-pwa-menu";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
const LiveClock = dynamic(() => import("./LiveClock"), {
  ssr: false,
});

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl"
    >
      {/* Animated gradient border */}
      <div className="via-primary/50 absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent to-transparent" />
      <div className="via-primary/30 absolute bottom-0 left-0 h-px w-full animate-pulse bg-linear-to-r from-transparent to-transparent opacity-60" />

      {/* Subtle background pattern */}
      <div className="from-primary/5 to-primary/5 absolute inset-0 bg-linear-to-r via-transparent opacity-50" />

      <div className="relative container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            className="group focus-visible:ring-primary/50 flex items-center space-x-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <motion.div
              className="shadow-primary/25 relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-75" />

              <Sparkles className="relative z-10 h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />

              {/* Sparkle animation */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(139, 92, 246, 0.4)",
                    "0 0 0 10px rgba(139, 92, 246, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>

            <div className="flex flex-col leading-tight">
              <motion.span
                className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold tracking-tight text-transparent transition-all duration-300 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 sm:text-2xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                ToolifyLab
              </motion.span>
              <motion.span
                className="text-muted-foreground group-hover:text-primary/70 text-xs font-medium transition-colors duration-300 sm:text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                Professional Calculator Suite
              </motion.span>
            </div>
          </Link>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop offline indicator */}
          <motion.div
            className="hidden sm:flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <OfflineIndicator />
          </motion.div>

          {/* Live Clock */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <LiveClock />
          </motion.div>

          {/* Desktop Theme Toggle */}
          <motion.div
            className="hidden sm:flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* Mobile Menu */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <MobilePWAMenu />
          </motion.div>
        </div>
      </div>

      {/* Bottom border animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      />
    </motion.header>
  );
}
