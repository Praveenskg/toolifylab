"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Flag, Pause, Play, RotateCcw, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TimePickerColumn } from "../TimePickerColumn";
import { ScrollArea } from "../ui/scroll-area";

export default function TimerTools() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="countdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="countdown">Countdown</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
        </TabsList>
        <TabsContent value="countdown">
          <CountdownTimer />
        </TabsContent>
        <TabsContent value="stopwatch">
          <Stopwatch />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CountdownTimer() {
  const [hoursInput, setHoursInput] = useState(0);
  const [minutesInput, setMinutesInput] = useState(0);
  const [secondsInput, setSecondsInput] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const remainingHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const totalInitialSeconds = hoursInput * 3600 + minutesInput * 60 + secondsInput || 1;

  const circumference = 2 * Math.PI * 45;
  const offset =
    running || paused
      ? circumference - (totalSeconds / totalInitialSeconds) * circumference
      : circumference;

  useEffect(() => {
    if (running && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    if (totalSeconds === 0 && running) {
      clearInterval(intervalRef.current!);
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setRunning(false);
        const alarm = new Audio("/alarm.mp3");
        alarm.play();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        toast("\u23F0 Time's Up!", {
          description: "Your countdown has completed.",
        });
      }, 0);
    }

    return () => clearInterval(intervalRef.current!);
  }, [running, totalSeconds]);

  const start = () => {
    const total = hoursInput * 3600 + minutesInput * 60 + secondsInput;
    if (total > 0) {
      setTotalSeconds(total);
      setRunning(true);
      setPaused(false);
    }
  };

  const pause = () => {
    setRunning(false);
    setPaused(true);
  };

  const resume = () => {
    setRunning(true);
    setPaused(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setPaused(false);
    setTotalSeconds(0);
    setMinutesInput(0);
    setSecondsInput(0);
    setHoursInput(0);
  };

  return (
    <div className="flex justify-center px-4 transition-all duration-500">
      <Card className={`w-full max-w-xl ${running ? "max-w-4xl" : ""} transition-all duration-500`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Countdown Timer</CardTitle>
          <CardDescription>Select hours, minutes, and seconds by scrolling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {!running && !paused ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="mx-auto flex w-full justify-center gap-4">
                    <TimePickerColumn
                      label="Hours"
                      max={24}
                      value={hoursInput}
                      onChange={setHoursInput}
                      id="hours-scroll"
                    />
                    <TimePickerColumn
                      label="Minutes"
                      max={60}
                      value={minutesInput}
                      onChange={setMinutesInput}
                      id="minutes-scroll"
                    />
                    <TimePickerColumn
                      label="Seconds"
                      max={60}
                      value={secondsInput}
                      onChange={setSecondsInput}
                      id="seconds-scroll"
                    />
                  </div>

                  <Button
                    onClick={start}
                    disabled={hoursInput === 0 && minutesInput === 0 && secondsInput === 0}
                    className="w-full sm:w-1/2"
                  >
                    Start
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`relative mx-auto h-56 w-56 ${running && !paused ? "animate-pulse" : ""}`}
                >
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#4caf50"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.5s linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-5">
                    <div className="text-muted-foreground text-sm">
                      {Math.floor(totalInitialSeconds / 3600) > 0 &&
                        `${Math.floor(totalInitialSeconds / 3600)}h `}
                      {Math.floor((totalInitialSeconds % 3600) / 60) > 0 &&
                        `${Math.floor((totalInitialSeconds % 3600) / 60)}m `}
                      {totalInitialSeconds % 60 > 0 && `${totalInitialSeconds % 60}s`}
                    </div>
                    <span className="font-mono text-3xl font-bold">
                      {remainingHours > 0 && `${String(remainingHours).padStart(2, "0")}:`}
                      {String(remainingMinutes).padStart(2, "0")}:
                      {String(remainingSeconds).padStart(2, "0")}
                    </span>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Bell className="h-4 w-4" />
                      {(() => {
                        const targetTime = new Date();
                        targetTime.setSeconds(targetTime.getSeconds() + totalSeconds);
                        return targetTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      })()}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  {running ? (
                    <Button
                      onClick={pause}
                      className="w-1/2 bg-red-500 text-white transition-all hover:bg-red-600 active:scale-95"
                    >
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={resume}
                      className="w-1/2 bg-green-600 text-white transition-all hover:bg-green-700 active:scale-95"
                    >
                      <Play className="mr-2 h-4 w-4" /> Resume
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="w-1/2 transition-all active:scale-95"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const handleStart = () => {
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleLap = () => {
    if (running) {
      setLaps(prev => [time, ...prev]);
    }
  };

  const handleReset = () => {
    setTime(0);
    setLaps([]);
  };

  function formatTime(ms: number) {
    const milliseconds = Math.floor((ms % 1000) / 10);
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return `${hours > 0 ? String(hours).padStart(2, "0") + ":" : ""}${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stopwatch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key="display"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-center font-mono text-5xl font-bold"
          >
            {formatTime(time)}
          </motion.div>
        </AnimatePresence>

        <div className="mx-auto w-full max-w-sm">
          <AnimatePresence mode="wait">
            {running ? (
              <motion.div
                key="running"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <Button
                  onClick={handleStop}
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </Button>
                <Button variant="outline" onClick={handleLap} className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Lap
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="stopped"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <Button
                  onClick={handleStart}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {time === 0 ? "Start" : "Resume"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={time === 0}
                  className={`w-full ${time === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {laps.length > 0 && (
          <div className="pt-4">
            <div className="rounded-lg border">
              <div className="text-muted-foreground bg-muted flex justify-between rounded-t-lg py-2 text-sm font-semibold">
                <span className="w-1/3 text-center">Lap</span>
                <span className="w-1/3 text-center">Lap Time</span>
                <span className="w-1/3 text-center">Overall Time</span>
              </div>

              <ScrollArea className="scrollbar-hide max-h-100 overflow-auto">
                <ul className="divide-y text-sm">
                  <AnimatePresence>
                    {laps.map((lap, idx) => {
                      const currentLapTime = lap;
                      const previousLapTime = laps[idx + 1] ?? 0;
                      const lapDiff = currentLapTime - previousLapTime;
                      return (
                        <motion.li
                          key={lap}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between py-2"
                        >
                          <span className="w-1/3 text-center">{laps.length - idx}</span>
                          <span className="w-1/3 text-center font-mono text-blue-600">
                            {formatTime(lapDiff)}
                          </span>
                          <span className="text-muted-foreground w-1/3 text-center font-mono">
                            {formatTime(currentLapTime)}
                          </span>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
