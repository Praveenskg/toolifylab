"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function PercentageCalculator() {
  const [basicValue, setBasicValue] = useState<string>("");
  const [basicPercentage, setBasicPercentage] = useState<string>("");
  const [basicResult, setBasicResult] = useState<number | null>(null);

  const [increaseValue, setIncreaseValue] = useState<string>("");
  const [increasePercent, setIncreasePercent] = useState<string>("");
  const [increaseResult, setIncreaseResult] = useState<{
    newValue: number;
    increase: number;
  } | null>(null);

  const [changeOld, setChangeOld] = useState<string>("");
  const [changeNew, setChangeNew] = useState<string>("");
  const [changeResult, setChangeResult] = useState<{
    percentage: number;
    change: number;
  } | null>(null);

  const calculateBasic = () => {
    const value = Number.parseFloat(basicValue);
    const percentage = Number.parseFloat(basicPercentage);
    if (!isNaN(value) && !isNaN(percentage)) {
      setBasicResult((value * percentage) / 100);
    }
  };

  const calculateIncrease = () => {
    const value = Number.parseFloat(increaseValue);
    const percent = Number.parseFloat(increasePercent);
    if (!isNaN(value) && !isNaN(percent)) {
      const increase = (value * percent) / 100;
      setIncreaseResult({
        newValue: value + increase,
        increase: increase,
      });
    }
  };

  const calculateChange = () => {
    const oldValue = Number.parseFloat(changeOld);
    const newValue = Number.parseFloat(changeNew);
    if (!isNaN(oldValue) && !isNaN(newValue) && oldValue !== 0) {
      const change = newValue - oldValue;
      const percentage = (change / oldValue) * 100;
      setChangeResult({
        percentage: percentage,
        change: change,
      });
    }
  };

  const resetAll = () => {
    setBasicValue("");
    setBasicPercentage("");
    setBasicResult(null);
    setIncreaseValue("");
    setIncreasePercent("");
    setIncreaseResult(null);
    setChangeOld("");
    setChangeNew("");
    setChangeResult(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Percentage</TabsTrigger>
          <TabsTrigger value="increase">Percentage Increase</TabsTrigger>
          <TabsTrigger value="change">Percentage Change</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Percentage Calculation</CardTitle>
              <CardDescription>Calculate what is X% of Y</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basicPercentage">Percentage (%)</Label>
                  <Input
                    id="basicPercentage"
                    type="number"
                    placeholder="Enter percentage"
                    value={basicPercentage}
                    onChange={e => setBasicPercentage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basicValue">Of Value</Label>
                  <Input
                    id="basicValue"
                    type="number"
                    placeholder="Enter value"
                    value={basicValue}
                    onChange={e => setBasicValue(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={calculateBasic} className="w-full">
                Calculate
              </Button>

              {basicResult !== null && (
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <div className="text-muted-foreground mb-2 text-sm">
                    {basicPercentage}% of {basicValue} is:
                  </div>
                  <div className="text-primary text-3xl font-bold">{basicResult.toFixed(2)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="increase">
          <Card>
            <CardHeader>
              <CardTitle>Percentage Increase/Decrease</CardTitle>
              <CardDescription>
                Calculate value after percentage increase or decrease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="increaseValue">Original Value</Label>
                  <Input
                    id="increaseValue"
                    type="number"
                    placeholder="Enter original value"
                    value={increaseValue}
                    onChange={e => setIncreaseValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="increasePercent">Percentage Change (%)</Label>
                  <Input
                    id="increasePercent"
                    type="number"
                    placeholder="Enter percentage (+ or -)"
                    value={increasePercent}
                    onChange={e => setIncreasePercent(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={calculateIncrease} className="w-full">
                Calculate
              </Button>

              {increaseResult && (
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <div className="text-muted-foreground mb-2 text-sm">New Value:</div>
                    <div className="text-primary text-3xl font-bold">
                      {increaseResult.newValue.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span>Original Value:</span>
                      <span className="font-semibold">{increaseValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change Amount:</span>
                      <span className="font-semibold">{increaseResult.increase.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2">
                      <span>Final Value:</span>
                      <span className="font-bold">{increaseResult.newValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change">
          <Card>
            <CardHeader>
              <CardTitle>Percentage Change</CardTitle>
              <CardDescription>Calculate percentage change between two values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="changeOld">Old Value</Label>
                  <Input
                    id="changeOld"
                    type="number"
                    placeholder="Enter old value"
                    value={changeOld}
                    onChange={e => setChangeOld(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changeNew">New Value</Label>
                  <Input
                    id="changeNew"
                    type="number"
                    placeholder="Enter new value"
                    value={changeNew}
                    onChange={e => setChangeNew(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={calculateChange} className="w-full">
                Calculate
              </Button>

              {changeResult && (
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <div className="text-muted-foreground mb-2 text-sm">Percentage Change:</div>
                    <div
                      className={`text-3xl font-bold ${changeResult.percentage >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {changeResult.percentage >= 0 ? "+" : ""}
                      {changeResult.percentage.toFixed(2)}%
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span>Old Value:</span>
                      <span className="font-semibold">{changeOld}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Value:</span>
                      <span className="font-semibold">{changeNew}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absolute Change:</span>
                      <span className="font-semibold">{changeResult.change.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2">
                      <span>Percentage Change:</span>
                      <span
                        className={`font-bold ${changeResult.percentage >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {changeResult.percentage >= 0 ? "+" : ""}
                        {changeResult.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button onClick={resetAll} variant="outline">
          Reset All Calculations
        </Button>
      </div>
    </div>
  );
}
