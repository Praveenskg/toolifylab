"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ScrollProgressCircle() {
  const [scroll, setScroll] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScroll(scrolled);
      setVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getColor = () => {
    if (scroll < 25) return "#3b82f6";
    if (scroll < 50) return "#10b981";
    if (scroll < 75) return "#facc15";
    return "#ef4444";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            scale: 1.05,
            y: [-2, 0, -2],
            transition: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 0.6,
              ease: "easeInOut",
            },
          }}
          className="bg-background border-border fixed right-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-xl sm:right-8 sm:bottom-8 sm:h-14 sm:w-14"
          aria-label="Scroll to top"
        >
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              stroke={getColor()}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - scroll}
              d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
              animate={{ strokeDashoffset: 100 - scroll }}
              transition={{ duration: 0.2 }}
            />
          </svg>

          <ArrowUp className="text-primary relative z-10 h-4 w-4 sm:h-5 sm:w-5 dark:text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
