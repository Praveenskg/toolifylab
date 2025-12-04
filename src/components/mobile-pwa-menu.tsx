"use client";

import { Button } from "@/components/ui/button";
import { Bell, Download, Moon, Settings, Sun, Trash, WifiOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePWA } from "@/hooks/use-pwa";
import { toast } from "sonner";

export function MobilePWAMenu() {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    requestNotificationPermission,
    showNotification,
  } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { theme, setTheme } = useTheme();
  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      await installApp();
    } catch (error) {
      console.error("Installation failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };
  const handleToggleNotification = async () => {
    if (notificationsEnabled) {
      localStorage.setItem("notifications", "disabled");
      setNotificationsEnabled(false);
      toast.info("Notifications disabled");
    } else {
      const granted = await requestNotificationPermission();
      if (granted) {
        localStorage.setItem("notifications", "enabled");
        setNotificationsEnabled(true);
        toast.success("Notifications enabled");
        showNotification("Notifications Enabled", {
          body: "You’ll now receive important updates.",
          icon: "/favicon.svg",
        });
      } else {
        toast.error("Permission denied");
      }
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("notifications");
      const isGranted = Notification.permission === "granted";
      if (stored === "enabled" && isGranted) {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
      if (
        typeof window !== "undefined" &&
        isInstallable &&
        /iPhone|iPad|iPod/.test(navigator.userAgent) &&
        !navigator.standalone
      ) {
        toast.info('To install this app on iOS, tap "Share" and then "Add to Home Screen".');
      }
    } catch {
      setNotificationsEnabled(false);
    }
  }, [isInstallable]);

  const handleClearCache = async () => {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }

    location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="sm:hidden">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-in fade-in slide-in-from-top-2 w-56">
        <p className="text-muted-foreground px-3 py-1.5 text-xs font-semibold tracking-wide uppercase">
          App Settings
        </p>

        <DropdownMenuSeparator />
        {!isOnline && (
          <DropdownMenuItem disabled>
            <WifiOff className="mr-2 h-4 w-4 text-yellow-600" />
            Offline Mode
          </DropdownMenuItem>
        )}

        {isInstallable && !isInstalled && (
          <DropdownMenuItem onClick={handleInstall} disabled={isInstalling}>
            <Download className="mr-2 h-4 w-4" />
            {isInstalling ? "Installing..." : "Install App"}
          </DropdownMenuItem>
        )}

        {isInstalled ? (
          <DropdownMenuItem disabled>
            <Download className="mr-2 h-4 w-4 text-green-600" />
            App Installed
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem onClick={handleToggleNotification}>
          <Bell className="mr-2 h-4 w-4" />
          {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        </DropdownMenuItem>
        {isInstalled && (
          <DropdownMenuItem onClick={handleClearCache}>
            <Trash className="mr-2 h-4 w-4" />
            Clear App Cache
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
