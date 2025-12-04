"use client";

import CreditCardEMICalculator from "@/components/tools/credit-card-emi-calculator";
import EMICalculator from "@/components/tools/emi-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EMICalculatorPageClient() {
  const [activeTab, setActiveTab] = useState("loan-emi");

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                EMI Calculator
              </h1>
              <p className="text-muted-foreground text-lg">
                Calculate EMIs for loans and credit cards with detailed breakdown
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6 grid w-full grid-cols-2">
                    <TabsTrigger value="loan-emi">Loan EMI</TabsTrigger>
                    <TabsTrigger value="credit-card-emi">Credit Card EMI</TabsTrigger>
                  </TabsList>
                  <TabsContent value="loan-emi" className="space-y-4">
                    <EMICalculator />
                  </TabsContent>
                  <TabsContent value="credit-card-emi" className="space-y-4">
                    <CreditCardEMICalculator />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
