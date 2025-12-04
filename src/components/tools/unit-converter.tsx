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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";

interface UnitData {
  name: string;
  factor: number;
}

interface CategoryData {
  name: string;
  units: Record<string, UnitData>;
}

const conversions: Record<string, CategoryData> = {
  length: {
    name: "Length",
    units: {
      mm: { name: "Millimeter", factor: 1 },
      cm: { name: "Centimeter", factor: 10 },
      m: { name: "Meter", factor: 1000 },
      km: { name: "Kilometer", factor: 1000000 },
      in: { name: "Inch", factor: 25.4 },
      ft: { name: "Foot", factor: 304.8 },
      yd: { name: "Yard", factor: 914.4 },
      mi: { name: "Mile", factor: 1609344 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      mg: { name: "Milligram", factor: 1 },
      g: { name: "Gram", factor: 1000 },
      kg: { name: "Kilogram", factor: 1000000 },
      oz: { name: "Ounce", factor: 28349.5 },
      lb: { name: "Pound", factor: 453592 },
      ton: { name: "Ton", factor: 1000000000 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      c: { name: "Celsius", factor: 1 },
      f: { name: "Fahrenheit", factor: 1 },
      k: { name: "Kelvin", factor: 1 },
    },
  },
  area: {
    name: "Area",
    units: {
      sqmm: { name: "Square Millimeter", factor: 1 },
      sqcm: { name: "Square Centimeter", factor: 100 },
      sqm: { name: "Square Meter", factor: 1000000 },
      sqkm: { name: "Square Kilometer", factor: 1000000000000 },
      sqin: { name: "Square Inch", factor: 645.16 },
      sqft: { name: "Square Foot", factor: 92903 },
      sqyd: { name: "Square Yard", factor: 836127 },
      acre: { name: "Acre", factor: 4046856422.4 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<string>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const convertUnits = () => {
    const value = Number.parseFloat(inputValue);
    if (!value || !fromUnit || !toUnit || !category) return;

    const categoryData = conversions[category as keyof typeof conversions];

    if (category === "temperature") {
      let celsius: number;

      if (fromUnit === "c") celsius = value;
      else if (fromUnit === "f") celsius = ((value - 32) * 5) / 9;
      else if (fromUnit === "k") celsius = value - 273.15;
      else return;

      let convertedValue: number;
      if (toUnit === "c") convertedValue = celsius;
      else if (toUnit === "f") convertedValue = (celsius * 9) / 5 + 32;
      else if (toUnit === "k") convertedValue = celsius + 273.15;
      else return;

      setResult(convertedValue);
    } else {
      const fromFactor = categoryData.units[fromUnit]?.factor;
      const toFactor = categoryData.units[toUnit]?.factor;

      if (!fromFactor || !toFactor) return;

      const baseValue = value * fromFactor;
      const convertedValue = baseValue / toFactor;
      setResult(convertedValue);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result !== null) {
      setInputValue(result.toString());
      setResult(Number.parseFloat(inputValue));
    }
  };

  const resetForm = () => {
    setInputValue("");
    setFromUnit("");
    setToUnit("");
    setResult(null);
  };

  const currentCategory = conversions[category as keyof typeof conversions];

  return (
    <div className="space-y-6">
      <Tabs value={category} onValueChange={setCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="area">Area</TabsTrigger>
        </TabsList>

        {Object.entries(conversions).map(([key, categoryData]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{categoryData.name} Converter</CardTitle>
                <CardDescription>
                  Convert between different {categoryData.name.toLowerCase()} units
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryData.units).map(([unitKey, unitData]) => (
                          <SelectItem key={unitKey} value={unitKey}>
                            {unitData.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryData.units).map(([unitKey, unitData]) => (
                          <SelectItem key={unitKey} value={unitKey}>
                            {unitData.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inputValue">Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="inputValue"
                      type="number"
                      placeholder="Enter value to convert"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={swapUnits}
                      disabled={!fromUnit || !toUnit}
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={convertUnits} className="flex-1">
                    Convert
                  </Button>
                  <Button onClick={resetForm} variant="outline" className="flex-1">
                    Reset
                  </Button>
                </div>

                {result !== null && fromUnit && toUnit && (
                  <div className="bg-primary/5 rounded-lg p-6">
                    <div className="space-y-2 text-center">
                      <div className="text-muted-foreground text-sm">
                        {inputValue} {currentCategory.units[fromUnit]?.name} =
                      </div>
                      <div className="text-primary text-3xl font-bold">
                        {result.toFixed(6).replace(/\.?0+$/, "")}{" "}
                        {currentCategory.units[toUnit]?.name}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
