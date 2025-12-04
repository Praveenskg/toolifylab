"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Users } from "lucide-react";
import { useState } from "react";

interface TipResult {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  perPersonAmount: number;
  perPersonTip: number;
}

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<number[]>([15]);
  const [numberOfPeople, setNumberOfPeople] = useState<string>("1");
  const [result, setResult] = useState<TipResult | null>(null);

  const calculateTip = () => {
    const bill = Number.parseFloat(billAmount);
    const tip = tipPercentage[0];
    const people = Number.parseInt(numberOfPeople);

    if (!bill || !people) return;

    const tipAmount = (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonAmount = totalAmount / people;
    const perPersonTip = tipAmount / people;

    setResult({
      billAmount: bill,
      tipPercentage: tip,
      tipAmount,
      totalAmount,
      perPersonAmount,
      perPersonTip,
    });
  };

  const resetForm = () => {
    setBillAmount("");
    setTipPercentage([15]);
    setNumberOfPeople("1");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const quickTipButtons = [10, 15, 18, 20, 25];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="modern-card">
        <CardHeader>
          <CardTitle>Bill Information</CardTitle>
          <CardDescription>Enter bill details to calculate tip and split</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="billAmount">Bill Amount ($)</Label>
            <Input
              id="billAmount"
              type="number"
              placeholder="Enter bill amount"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tip Percentage</Label>
              <span className="gradient-text text-2xl font-bold">{tipPercentage[0]}%</span>
            </div>
            <Slider
              value={tipPercentage}
              onValueChange={setTipPercentage}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex flex-wrap gap-2">
              {quickTipButtons.map(tip => (
                <Button
                  key={tip}
                  variant={tipPercentage[0] === tip ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipPercentage([tip])}
                  className={tipPercentage[0] === tip ? "modern-button" : ""}
                >
                  {tip}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPeople">Number of People</Label>
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <Input
                id="numberOfPeople"
                type="number"
                min="1"
                placeholder="Enter number of people"
                value={numberOfPeople}
                onChange={e => setNumberOfPeople(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateTip} className="flex-1">
              Calculate Tip
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
            <CardTitle className="flex items-center gap-2">
              <div className="success-gradient h-2 w-2 rounded-full"></div>
              Tip Calculation Results
            </CardTitle>
            <CardDescription>Bill breakdown and per-person amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="from-muted to-muted/50 rounded-xl bg-linear-to-r p-4">
                <div className="flex items-center justify-between">
                  <span>Bill Amount</span>
                  <span className="font-semibold">{formatCurrency(result.billAmount)}</span>
                </div>
              </div>

              <div className="from-primary/5 to-primary/10 border-primary/20 rounded-xl border bg-linear-to-r p-4">
                <div className="flex items-center justify-between">
                  <span>Tip ({result.tipPercentage}%)</span>
                  <span className="text-primary font-semibold">
                    {formatCurrency(result.tipAmount)}
                  </span>
                </div>
              </div>

              <div className="from-muted to-muted/50 border-primary/20 rounded-xl border-2 bg-linear-to-r p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="gradient-text text-xl font-bold">
                    {formatCurrency(result.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {Number.parseInt(numberOfPeople) > 1 && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Users className="h-4 w-4" />
                  Per Person ({numberOfPeople} people)
                </h4>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span>Amount per person</span>
                    <span className="font-semibold">{formatCurrency(result.perPersonAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip per person</span>
                    <span className="font-semibold">{formatCurrency(result.perPersonTip)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <h4 className="mb-2 font-semibold">Quick Summary</h4>
              <p className="text-muted-foreground text-sm">
                {Number.parseInt(numberOfPeople) > 1
                  ? `Each person should pay ${formatCurrency(
                      result.perPersonAmount
                    )} (including ${formatCurrency(result.perPersonTip)} tip).`
                  : `Total amount to pay: ${formatCurrency(
                      result.totalAmount
                    )} (including ${formatCurrency(result.tipAmount)} tip).`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
