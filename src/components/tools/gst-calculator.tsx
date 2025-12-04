"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface GSTResult {
  originalAmount: number;
  gstAmount: number;
  totalAmount: number;
  gstRate: number;
}

export default function GSTCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [gstRate, setGstRate] = useState<string>("18");
  const [calculationType, setCalculationType] = useState<string>("exclusive");
  const [result, setResult] = useState<GSTResult | null>(null);

  const calculateGST = () => {
    const baseAmount = Number.parseFloat(amount);
    const rate = Number.parseFloat(gstRate) / 100;

    if (!baseAmount || !rate) return;

    let originalAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (calculationType === "exclusive") {
      originalAmount = baseAmount;
      gstAmount = baseAmount * rate;
      totalAmount = baseAmount + gstAmount;
    } else {
      totalAmount = baseAmount;
      originalAmount = baseAmount / (1 + rate);
      gstAmount = totalAmount - originalAmount;
    }

    setResult({
      originalAmount,
      gstAmount,
      totalAmount,
      gstRate: Number.parseFloat(gstRate),
    });
  };

  const resetForm = () => {
    setAmount("");
    setGstRate("18");
    setCalculationType("exclusive");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="modern-card">
        <CardHeader>
          <CardTitle>GST Calculation</CardTitle>
          <CardDescription>Calculate GST amount and total price</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>GST Rate</Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger>
                <SelectValue placeholder="Select GST rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (Exempt)</SelectItem>
                <SelectItem value="5">5% (Essential goods)</SelectItem>
                <SelectItem value="12">12% (Standard goods)</SelectItem>
                <SelectItem value="18">18% (Most goods & services)</SelectItem>
                <SelectItem value="28">28% (Luxury goods)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Calculation Type</Label>
            <RadioGroup value={calculationType} onValueChange={setCalculationType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusive" id="exclusive" />
                <Label htmlFor="exclusive">GST Exclusive (Add GST to amount)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusive" id="inclusive" />
                <Label htmlFor="inclusive">GST Inclusive (Extract GST from amount)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateGST} className="flex-1">
              Calculate GST
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
            <CardTitle>GST Calculation Results</CardTitle>
            <CardDescription>Breakdown of GST calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted flex items-center justify-between rounded-lg p-4">
                <span>Original Amount</span>
                <span className="font-semibold">{formatCurrency(result.originalAmount)}</span>
              </div>

              <div className="bg-primary/5 flex items-center justify-between rounded-lg p-4">
                <span>GST Amount ({result.gstRate}%)</span>
                <span className="text-primary font-semibold">
                  {formatCurrency(result.gstAmount)}
                </span>
              </div>

              <div className="bg-muted flex items-center justify-between rounded-lg border-2 p-4">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <h4 className="mb-2 font-semibold">Calculation Summary:</h4>
              <p className="text-muted-foreground text-sm">
                {calculationType === "exclusive"
                  ? `GST of ${result.gstRate}% has been added to the original amount.`
                  : `GST of ${result.gstRate}% has been extracted from the total amount.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
