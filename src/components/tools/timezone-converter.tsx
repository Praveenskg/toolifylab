"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Copy,
  Globe,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TimeZone {
  name: string;
  offset: string;
  abbreviation: string;
  region: string;
}

interface WorldClock {
  id: string;
  timezone: string;
  name: string;
  time: Date;
}

const popularTimeZones: TimeZone[] = [
  {
    name: "UTC",
    offset: "+00:00",
    abbreviation: "UTC",
    region: "Coordinated Universal Time",
  },
  {
    name: "America/New_York",
    offset: "-05:00",
    abbreviation: "EST",
    region: "Eastern Time",
  },
  {
    name: "America/Chicago",
    offset: "-06:00",
    abbreviation: "CST",
    region: "Central Time",
  },
  {
    name: "America/Denver",
    offset: "-07:00",
    abbreviation: "MST",
    region: "Mountain Time",
  },
  {
    name: "America/Los_Angeles",
    offset: "-08:00",
    abbreviation: "PST",
    region: "Pacific Time",
  },
  {
    name: "Europe/London",
    offset: "+00:00",
    abbreviation: "GMT",
    region: "Greenwich Mean Time",
  },
  {
    name: "Europe/Paris",
    offset: "+01:00",
    abbreviation: "CET",
    region: "Central European Time",
  },
  {
    name: "Europe/Berlin",
    offset: "+01:00",
    abbreviation: "CET",
    region: "Central European Time",
  },
  {
    name: "Asia/Tokyo",
    offset: "+09:00",
    abbreviation: "JST",
    region: "Japan Standard Time",
  },
  {
    name: "Asia/Shanghai",
    offset: "+08:00",
    abbreviation: "CST",
    region: "China Standard Time",
  },
  {
    name: "Asia/Kolkata",
    offset: "+05:30",
    abbreviation: "IST",
    region: "India Standard Time",
  },
  {
    name: "Australia/Sydney",
    offset: "+10:00",
    abbreviation: "AEST",
    region: "Australian Eastern Time",
  },
  {
    name: "Pacific/Auckland",
    offset: "+12:00",
    abbreviation: "NZST",
    region: "New Zealand Standard Time",
  },
  {
    name: "Asia/Dubai",
    offset: "+04:00",
    abbreviation: "GST",
    region: "Gulf Standard Time",
  },
  {
    name: "Asia/Singapore",
    offset: "+08:00",
    abbreviation: "SGT",
    region: "Singapore Time",
  },
];

export default function TimeZoneConverter() {
  const [fromTimeZone, setFromTimeZone] = useState("UTC");
  const [toTimeZone, setToTimeZone] = useState("America/New_York");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });
  const [convertedTime, setConvertedTime] = useState("");
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClock, setShowAddClock] = useState(false);
  const [newClockTimezone, setNewClockTimezone] = useState("");

  useEffect(() => {
    const defaultClocks: WorldClock[] = [
      {
        id: "1",
        timezone: "UTC",
        name: "UTC",
        time: new Date(),
      },
      {
        id: "2",
        timezone: "America/New_York",
        name: "New York",
        time: new Date(),
      },
      {
        id: "3",
        timezone: "Asia/Tokyo",
        name: "Tokyo",
        time: new Date(),
      },
    ];
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setWorldClocks(defaultClocks);
    }, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorldClocks(prev =>
        prev.map(clock => ({
          ...clock,
          time: new Date(),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const convertTime = useCallback(() => {
    try {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const toDate = new Date(dateTime.toLocaleString("en-US", { timeZone: toTimeZone }));

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      };

      setConvertedTime(toDate.toLocaleString("en-US", options));
    } catch (error) {
      console.error("Error converting time:", error);
      setConvertedTime("Error converting time");
    }
  }, [toTimeZone, selectedDate, selectedTime]);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      convertTime();
    }, 0);
  }, [convertTime]);

  const addWorldClock = () => {
    if (newClockTimezone && !worldClocks.find(clock => clock.timezone === newClockTimezone)) {
      const timezone = popularTimeZones.find(tz => tz.name === newClockTimezone);
      const newClock: WorldClock = {
        id: Date.now().toString(),
        timezone: newClockTimezone,
        name: timezone?.region || newClockTimezone,
        time: new Date(),
      };
      setWorldClocks(prev => [...prev, newClock]);
      setNewClockTimezone("");
      setShowAddClock(false);
    }
  };

  const removeWorldClock = (id: string) => {
    setWorldClocks(prev => prev.filter(clock => clock.id !== id));
  };

  const copyTime = (time: string) => {
    navigator.clipboard.writeText(time);
  };

  const formatTimeInTimezone = (date: Date, timezone: string) => {
    try {
      return date.toLocaleString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "Invalid timezone";
    }
  };

  const formatDateInTimezone = (date: Date, timezone: string) => {
    try {
      return date.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid timezone";
    }
  };

  const getTimezoneOffset = (timezone: string) => {
    try {
      const date = new Date();
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      const targetTime = new Date(utc + 0 * 60000);
      const offset = targetTime.toLocaleString("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
      });
      return offset.split(" ").pop() || "";
    } catch {
      return "";
    }
  };

  const filteredTimeZones = popularTimeZones.filter(
    tz =>
      tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Zone Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full space-y-2">
                <Label>From Time Zone</Label>
                <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularTimeZones.map(tz => (
                      <SelectItem key={tz.name} value={tz.name}>
                        <div className="flex flex-col">
                          <span className="font-medium">{tz.region}</span>
                          <span className="text-muted-foreground text-xs">
                            {tz.name} ({tz.abbreviation})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full space-y-2">
                <Label>To Time Zone</Label>
                <Select value={toTimeZone} onValueChange={setToTimeZone}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularTimeZones.map(tz => (
                      <SelectItem key={tz.name} value={tz.name}>
                        <div className="flex flex-col">
                          <span className="font-medium">{tz.region}</span>
                          <span className="text-muted-foreground text-xs">
                            {tz.name} ({tz.abbreviation})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={date => date && setSelectedDate(date)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="mb-2 text-sm font-medium">Current Time Zones</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>From ({fromTimeZone}):</span>
                  <span className="font-mono">
                    {formatTimeInTimezone(new Date(), fromTimeZone)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>To ({toTimeZone}):</span>
                  <span className="font-mono">{formatTimeInTimezone(new Date(), toTimeZone)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Converted Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-primary text-2xl font-bold">
                {convertedTime || "Select time to convert"}
              </div>
              <div className="text-muted-foreground text-sm">
                {format(selectedDate, "PPP")} at {selectedTime}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Time Difference</div>
              <div className="text-muted-foreground text-sm">
                {(() => {
                  try {
                    const fromOffset = new Date().toLocaleString("en-US", {
                      timeZone: fromTimeZone,
                      timeZoneName: "short",
                    });
                    const toOffset = new Date().toLocaleString("en-US", {
                      timeZone: toTimeZone,
                      timeZoneName: "short",
                    });
                    return `${fromOffset} → ${toOffset}`;
                  } catch {
                    return "Calculating time difference...";
                  }
                })()}
              </div>
            </div>

            <Button onClick={() => copyTime(convertedTime)} variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Converted Time
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              World Clock
            </div>
            <Button onClick={() => setShowAddClock(!showAddClock)} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Clock
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddClock && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label>Search Time Zones</Label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search time zones..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-40 space-y-2 overflow-y-auto">
                {filteredTimeZones.map(tz => (
                  <div
                    key={tz.name}
                    className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded p-2"
                    onClick={() => setNewClockTimezone(tz.name)}
                  >
                    <div>
                      <div className="font-medium">{tz.region}</div>
                      <div className="text-muted-foreground text-sm">
                        {tz.name} ({tz.abbreviation})
                      </div>
                    </div>
                    <Badge variant="outline">{tz.offset}</Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={addWorldClock} disabled={!newClockTimezone}>
                  Add Clock
                </Button>
                <Button variant="outline" onClick={() => setShowAddClock(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {worldClocks.map(clock => (
              <div key={clock.id} className="modern-card relative space-y-2 rounded-lg border p-4">
                <Button
                  onClick={() => removeWorldClock(clock.id)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="space-y-1">
                  <div className="text-lg font-medium">
                    {formatTimeInTimezone(clock.time, clock.timezone)}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {formatDateInTimezone(clock.time, clock.timezone)}
                  </div>
                  <div className="text-muted-foreground text-xs">{clock.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {getTimezoneOffset(clock.timezone)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Time Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularTimeZones.slice(0, 9).map(tz => (
              <div key={tz.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{tz.region}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tz.name} ({tz.abbreviation}) {tz.offset}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
