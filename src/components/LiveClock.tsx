"use client";

import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  if (!time) return null;
  const hours = time.format("hh");
  const minutes = time.format("mm");
  const seconds = time.format("ss");
  const ampm = time.format("A");

  return (
    <div className="bg-background/50 border-border/50 hover:bg-muted/30 flex items-center gap-1.5 rounded-lg border px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
      <Clock className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
      <div className="flex items-center gap-0.5 font-mono sm:gap-1">
        <span className="text-muted-foreground text-xs font-semibold tabular-nums sm:text-sm">
          {hours}
        </span>
        <span className="text-muted-foreground text-xs sm:text-sm">:</span>
        <span className="text-muted-foreground text-xs font-semibold tabular-nums sm:text-sm">
          {minutes}
        </span>
        <span className="text-muted-foreground text-xs sm:text-sm">:</span>
        <span className="text-muted-foreground text-xs font-semibold tabular-nums sm:text-sm">
          {seconds}
        </span>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 ml-1 px-1 py-0.5 text-[10px] font-medium sm:ml-1.5 sm:px-1.5 sm:text-xs"
        >
          {ampm}
        </Badge>
      </div>
    </div>
  );
}
