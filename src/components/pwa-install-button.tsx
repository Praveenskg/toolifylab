"use client";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { Check, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        toast.success("App installed successfully!");
      } else {
        toast.warning("Installation dismissed");
      }
    } catch (error) {
      toast.error("Installation failed");
      console.error("Installation failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="text-green-600"
        aria-label="App already installed"
      >
        <Check className="mr-2 h-4 w-4" />
        Installed
      </Button>
    );
  }

  if (!isInstallable) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleInstall}
      disabled={isInstalling}
      className="transition-all duration-200 hover:scale-105"
      aria-label="Install Progressive Web App"
    >
      {isInstalling ? (
        <>
          <div className="border-primary mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          Installing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Install App
        </>
      )}
    </Button>
  );
}
