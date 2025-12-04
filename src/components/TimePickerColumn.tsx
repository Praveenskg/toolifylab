// components/TimePickerColumn.tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface TimePickerColumnProps {
  label: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  id: string;
}

export const TimePickerColumn: React.FC<TimePickerColumnProps> = ({
  label,
  max,
  value,
  onChange,
  id,
}) => {
  const itemHeight = 32;
  const visibleItems = max;
  const repeatedItems = visibleItems * 3;
  const middleIndex = visibleItems;

  const ref = useRef<HTMLDivElement>(null);

  const fullList = Array.from({ length: repeatedItems }, (_, i) => i % visibleItems);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = middleIndex * itemHeight;
    }
  }, [middleIndex]);

  return (
    <div className="flex w-full flex-col items-center">
      <span className="text-muted-foreground mb-1 text-sm font-medium">{label}</span>

      <div
        ref={ref}
        id={id}
        className="scrollbar-hide relative h-32 w-full max-w-[80px] snap-y snap-mandatory overflow-y-scroll p-2"
      >
        {fullList.map((val, i) => (
          <div
            key={i}
            className={cn("cursor-pointer snap-center py-1 text-center transition-colors", {
              "bg-primary rounded text-white": val === value,
              "text-muted-foreground": val !== value,
            })}
            onClick={() => onChange(val)}
          >
            {String(val).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
};
