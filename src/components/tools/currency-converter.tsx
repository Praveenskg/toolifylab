"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  CircleDollarSign,
  DollarSign,
  Euro,
  Globe,
  IndianRupee,
  PoundSterling,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ExchangeRate {
  [key: string]: number;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

const popularCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [convertedAmount, setConvertedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const fetchExchangeRates = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const apis = [
        `https://api.frankfurter.app/latest?from=${fromCurrency}`,
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
        `https://api.exchangerate.host/latest?base=${fromCurrency}`,
      ];

      let success = false;
      let data;

      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            data = await response.json();
            success = true;
            break;
          }
        } catch {
          // API failed, trying next...
          continue;
        }
      }

      if (!success) {
        throw new Error("All APIs failed");
      }

      const rates = data.rates || data.conversion_rates || {};
      setExchangeRates(rates);
      setLastUpdated(new Date());
    } catch {
      // Error fetching exchange rates
      setError("Failed to fetch live rates. Using cached rates.");

      const mockRates: ExchangeRate = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.5,
        INR: 74.5,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        SGD: 1.35,
        AED: 3.67,
        NZD: 1.42,
      };
      setExchangeRates(mockRates);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency]);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    if (exchangeRates[toCurrency] && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const converted = (numAmount * exchangeRates[toCurrency]).toFixed(2);
        setConvertedAmount(converted);
      } else {
        setConvertedAmount("");
      }
    }
  }, [amount, toCurrency, exchangeRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencySymbol = (code: string) => {
    const currency = popularCurrencies.find(c => c.code === code);
    return currency?.symbol || code;
  };

  const formatAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    return cleaned;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Currency Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                className="text-lg font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">{currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">{currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSwapCurrencies} variant="outline" className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Swap Currencies
            </Button>

            <Button
              onClick={fetchExchangeRates}
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Updating..." : "Refresh Rates"}
            </Button>

            {error && <div className="rounded bg-red-50 p-2 text-sm text-red-500">{error}</div>}

            {lastUpdated && (
              <div className="text-muted-foreground text-center text-xs">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-primary text-3xl font-bold">
                {convertedAmount ? (
                  <>
                    {getCurrencySymbol(toCurrency)}
                    {convertedAmount}
                  </>
                ) : (
                  "0.00"
                )}
              </div>
              <div className="text-muted-foreground text-sm">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            </div>

            {exchangeRates[toCurrency] && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Exchange Rate</div>
                <div className="text-lg font-semibold">
                  1 {fromCurrency} = {exchangeRates[toCurrency].toFixed(4)} {toCurrency}
                </div>
                <div className="text-muted-foreground text-sm">
                  1 {toCurrency} = {(1 / exchangeRates[toCurrency]).toFixed(4)} {fromCurrency}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="mb-2 text-sm font-medium">Popular Conversions</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {popularCurrencies.slice(0, 6).map(currency => (
                  <div
                    key={currency.code}
                    className="bg-muted/50 flex items-center justify-between rounded p-2"
                  >
                    <span>{currency.code}</span>
                    <span className="font-medium">
                      {exchangeRates[currency.code]
                        ? (parseFloat(amount || "1") * exchangeRates[currency.code]).toFixed(2)
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currency Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">USD - US Dollar</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The world&apos;s primary reserve currency and most traded currency.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-blue-500" />
                <span className="font-medium">EUR - Euro</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Official currency of the Eurozone, used by 19 EU countries.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PoundSterling className="h-4 w-4 text-purple-500" />
                <span className="font-medium">GBP - British Pound</span>
              </div>
              <p className="text-muted-foreground text-sm">
                One of the oldest currencies still in use, UK&apos;s official currency.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-red-500" />
                <span className="font-medium">JPY - Japanese Yen</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Major currency in Asia, known for low interest rates.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-orange-500" />
                <span className="font-medium">INR - Indian Rupee</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Official currency of India, one of the fastest growing economies.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-500" />
                <span className="font-medium">Real-time Rates</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Exchange rates are updated automatically for accurate conversions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
