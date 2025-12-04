"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { useState } from "react";
interface BMIResult {
  bmi: number;
  category: string;
  status: "underweight" | "normal" | "overweight" | "obese";
  idealWeightRange: { min: number; max: number };
}

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const weightKg = Number.parseFloat(weight);
    const heightM = Number.parseFloat(height) / 100;

    if (!weightKg || !heightM) return;

    const bmi = weightKg / (heightM * heightM);
    let category: string;
    let status: "underweight" | "normal" | "overweight" | "obese";

    if (bmi < 18.5) {
      category = "Underweight";
      status = "underweight";
    } else if (bmi < 25) {
      category = "Normal Weight";
      status = "normal";
    } else if (bmi < 30) {
      category = "Overweight";
      status = "overweight";
    } else {
      category = "Obese";
      status = "obese";
    }

    const idealWeightRange = {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM,
    };

    setResult({
      bmi,
      category,
      status,
      idealWeightRange,
    });
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setResult(null);
  };

  const getBMIProgress = (bmi: number) => {
    if (bmi < 18.5) return (bmi / 18.5) * 25;
    if (bmi < 25) return 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    if (bmi < 30) return 50 + ((bmi - 25) / (30 - 25)) * 25;
    return Math.min(100, 75 + ((bmi - 30) / 10) * 25);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="from-card to-card/50 border-0 bg-linear-to-br shadow-xl backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg">
                  <span className="text-xl font-bold text-white">⚖️</span>
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Body Measurements</CardTitle>
                  <CardDescription className="mt-1 text-sm sm:text-base">
                    Enter your height and weight to calculate BMI
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="weight"
                  className="text-foreground text-sm font-medium sm:text-base"
                >
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="focus:ring-primary/20 focus:border-primary h-12 text-base transition-all duration-200 focus:ring-2"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="height"
                  className="text-foreground text-sm font-medium sm:text-base"
                >
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height in cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="focus:ring-primary/20 focus:border-primary h-12 text-base transition-all duration-200 focus:ring-2"
                />
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={calculateBMI}
                    className="from-primary to-primary/80 h-12 w-full bg-linear-to-r text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Calculate BMI
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="hover:bg-muted/50 h-12 w-full border-2 text-base font-medium transition-all duration-300"
                  >
                    Reset
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="from-card to-card/50 border-0 bg-linear-to-br shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-green-600 shadow-lg">
                    <span className="text-xl font-bold text-white">📊</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">BMI Results</CardTitle>
                    <CardDescription className="mt-1 text-sm sm:text-base">
                      Your body mass index and health status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Main BMI Display */}
                <div className="relative">
                  <div className="from-primary/10 via-primary/5 to-primary/10 border-primary/20 rounded-2xl border bg-linear-to-br p-6 text-center shadow-inner">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="text-primary mb-3 text-4xl font-bold sm:text-5xl lg:text-6xl">
                        {result.bmi.toFixed(1)}
                      </div>
                      <Badge
                        className={`px-4 py-2 text-sm font-semibold ${
                          result.status === "underweight"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : result.status === "normal"
                              ? "bg-green-500 hover:bg-green-600"
                              : result.status === "overweight"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {result.category}
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                {/* BMI Scale Visualization */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-sm font-semibold">BMI Scale</h4>
                    <span className="text-muted-foreground text-sm">
                      Current: {result.bmi.toFixed(1)}
                    </span>
                  </div>

                  <div className="relative">
                    <Progress value={getBMIProgress(result.bmi)} className="bg-muted h-3" />
                    <div className="text-muted-foreground absolute right-0 -bottom-6 left-0 flex justify-between text-xs">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="rounded-xl border bg-linear-to-r from-blue-50/50 to-indigo-50/50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <span className="text-sm text-white">⚖️</span>
                      </div>
                      <h4 className="text-sm font-semibold sm:text-base">Ideal Weight Range</h4>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="text-foreground font-medium">
                        {result.idealWeightRange.min.toFixed(1)} kg -{" "}
                        {result.idealWeightRange.max.toFixed(1)} kg
                      </span>
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className={`rounded-xl border p-4 ${
                      result.status === "normal"
                        ? "border-green-200 bg-linear-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
                        : "border-amber-200 bg-linear-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          result.status === "normal" ? "bg-green-500" : "bg-amber-500"
                        }`}
                      >
                        <span className="text-sm text-white">
                          {result.status === "normal" ? "✅" : "💡"}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold sm:text-base">Health Recommendation</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {result.status === "normal"
                        ? "Great! You have a healthy BMI. Maintain your current lifestyle with balanced nutrition and regular exercise."
                        : result.status === "underweight"
                          ? "Consider consulting a healthcare provider about healthy weight gain strategies. Focus on nutrient-rich foods and strength training."
                          : "Consider consulting a healthcare provider about healthy weight management strategies. A combination of diet and exercise works best."}
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card className="from-card to-card/50 border-0 bg-linear-to-br shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg">
                <span className="text-xl font-bold text-white">📋</span>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">BMI Categories</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Understanding BMI ranges and their meanings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  category: "Underweight",
                  range: "Below 18.5",
                  color: "from-blue-500 to-blue-600",
                  bgColor:
                    "from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20",
                  icon: "⚖️",
                  description: "May indicate malnutrition or other health concerns",
                },
                {
                  category: "Normal Weight",
                  range: "18.5 - 24.9",
                  color: "from-green-500 to-green-600",
                  bgColor:
                    "from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20",
                  icon: "✅",
                  description: "Generally considered healthy weight range",
                },
                {
                  category: "Overweight",
                  range: "25.0 - 29.9",
                  color: "from-yellow-500 to-yellow-600",
                  bgColor:
                    "from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/20",
                  icon: "⚠️",
                  description: "May increase risk of certain health conditions",
                },
                {
                  category: "Obese",
                  range: "30.0 and above",
                  color: "from-red-500 to-red-600",
                  bgColor: "from-red-50/50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20",
                  icon: "🚨",
                  description: "Higher risk of serious health complications",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`group relative overflow-hidden rounded-xl border bg-linear-to-br p-4 text-center transition-all duration-300 hover:shadow-lg ${item.bgColor}`}
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${item.color}`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br shadow-lg ${item.color}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                    </div>

                    <h4
                      className={`mb-2 text-lg font-bold ${item.color.split(" ")[0].replace("from-", "text-")}`}
                    >
                      {item.category}
                    </h4>

                    <div className="text-foreground mb-2 text-sm font-semibold">{item.range}</div>

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover effect line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r transition-all duration-500 group-hover:w-full ${item.color}`}
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
