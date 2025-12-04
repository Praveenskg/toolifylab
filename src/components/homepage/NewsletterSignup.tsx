"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function NewsletterSignup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Subscribed Successfully", {
      description: "You’ll now receive new tool updates & tips in your inbox!",
    });
    setEmail("");
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-muted/50 dark:bg-background px-4 py-12 text-center sm:px-6 lg:px-8"
    >
      <h3 className="mb-2 text-2xl font-bold">Stay Updated</h3>
      <p className="text-muted-foreground mx-auto mb-6 max-w-xl text-sm sm:text-base">
        Get the latest updates, new tools, and productivity tips straight to your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row"
      >
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-4 py-2 shadow-sm focus:ring-2"
          required
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 rounded-md px-5 py-2 font-medium text-white transition"
        >
          Subscribe
        </button>
      </form>
    </motion.section>
  );
}
