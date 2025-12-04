"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface DOBResult {
  dateOfBirth: string;
  formattedDOB: string;
  dayOfWeek: string;
  zodiacSign: string;
  birthstone: string;
}

export default function DOBCalculator() {
  const [currentAge, setCurrentAge] = useState<string>("");
  const [ageUnit, setAgeUnit] = useState<string>("years");
  const [referenceDate, setReferenceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [result, setResult] = useState<DOBResult | null>(null);

  const zodiacSigns = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  ];

  const birthstones = [
    "Garnet",
    "Amethyst",
    "Aquamarine",
    "Diamond",
    "Emerald",
    "Pearl",
    "Ruby",
    "Peridot",
    "Sapphire",
    "Opal",
    "Topaz",
    "Turquoise",
  ];

  const getZodiacSign = (month: number, day: number) => {
    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && (month === startMonth || month === endMonth))
      ) {
        return sign.name;
      }
    }
    return "Unknown";
  };

  const calculateDOB = () => {
    const age = Number.parseFloat(currentAge);
    const refDate = new Date(referenceDate);

    if (!age || isNaN(refDate.getTime())) return;

    const dob = new Date(refDate);

    switch (ageUnit) {
      case "years":
        dob.setFullYear(dob.getFullYear() - age);
        break;
      case "months":
        dob.setMonth(dob.getMonth() - age);
        break;
      case "days":
        dob.setDate(dob.getDate() - age);
        break;
      case "weeks":
        dob.setDate(dob.getDate() - age * 7);
        break;
    }

    const dayOfWeek = dob.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDOB = dob.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const zodiacSign = getZodiacSign(dob.getMonth() + 1, dob.getDate());
    const birthstone = birthstones[dob.getMonth()];

    setResult({
      dateOfBirth: dob.toISOString().split("T")[0],
      formattedDOB,
      dayOfWeek,
      zodiacSign,
      birthstone,
    });
  };

  const resetForm = () => {
    setCurrentAge("");
    setAgeUnit("years");
    setReferenceDate(new Date().toISOString().split("T")[0]);
    setResult(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="modern-card">
        <CardHeader>
          <CardTitle>Age Information</CardTitle>
          <CardDescription>Enter current age to find date of birth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentAge">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                placeholder="Enter current age"
                value={currentAge}
                onChange={e => setCurrentAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Age Unit</Label>
              <Select value={ageUnit} onValueChange={setAgeUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceDate">Reference Date</Label>
            <Input
              id="referenceDate"
              type="date"
              value={referenceDate}
              onChange={e => setReferenceDate(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              The date from which to calculate backwards
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateDOB} className="flex-1">
              Calculate DOB
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Date of Birth Results</CardTitle>
            <CardDescription>Calculated birth information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <div className="text-muted-foreground mb-2 text-sm">Date of Birth:</div>
              <div className="text-primary mb-1 text-2xl font-bold">{result.formattedDOB}</div>
              <div className="text-muted-foreground text-sm">({result.dayOfWeek})</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="modern-card rounded-lg border p-4 text-center">
                <div className="font-semibold">Zodiac Sign</div>
                <div className="text-primary text-lg">{result.zodiacSign}</div>
              </div>
              <div className="modern-card rounded-lg border p-4 text-center">
                <div className="font-semibold">Birthstone</div>
                <div className="text-primary text-lg">{result.birthstone}</div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <h4 className="mb-2 font-semibold">Calculation Summary:</h4>
              <p className="text-muted-foreground text-sm">
                Based on being {currentAge} {ageUnit} old on{" "}
                {new Date(referenceDate).toLocaleDateString()}, the calculated date of birth is{" "}
                {result.formattedDOB}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
