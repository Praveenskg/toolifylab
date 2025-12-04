"use client";

import { Badge } from "@/components/ui/badge";
import { usePWA } from "@/hooks/use-pwa";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 text-yellow-800">
      <WifiOff className="mr-1 h-3 w-3" />
      Offline Mode
    </Badge>
  );
}
