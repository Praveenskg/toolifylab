"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CalendarIcon, Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  gstAmount: number;
}

interface AmortizationRow {
  month: number | string;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  gst: number;
  balance: number;
  nextEMIDate?: Date | null;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function CreditCardEMICalculator() {
  const [principal, setPrincipal] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [processingFee, setProcessingFee] = useState<string>("");
  const [includeGST, setIncludeGST] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<EMIResult | null>(null);
  const [amortization, setAmortization] = useState<AmortizationRow[]>([]);

  const calculateEMI = useCallback((): void => {
    const P = parseFloat(principal);
    const R = parseFloat(interestRate) / 100 / 12;
    const N = parseFloat(tenure);
    const fee = parseFloat(processingFee) || 0;

    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || N <= 0) return;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    const gstRate = includeGST ? 0.18 : 0;
    const gstAmount = totalInterest * gstRate;
    const gstOnFee = fee * gstRate;
    const totalPaymentWithExtras = totalPayment + gstAmount + fee + gstOnFee;

    setResult({
      emi: parseFloat(emi.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalPayment: parseFloat(totalPaymentWithExtras.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
    });

    const schedule: AmortizationRow[] = [];
    let balance = P;
    let currentDate = startDate ? new Date(startDate) : null;

    const getNextEMIDate = (current: Date): Date => {
      const desiredDay = current.getDate();
      const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
      const safeDay = Math.min(desiredDay, lastDay);
      return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), safeDay);
    };

    for (let month = 1; month <= N; month++) {
      const openingBalance = balance;
      const interestPayment = balance * R;
      const principalPayment = emi - interestPayment;
      const gstPayment = includeGST ? interestPayment * 0.18 : 0;
      balance -= principalPayment;
      const closingBalance = Math.max(0, balance);
      const nextEMIDate = currentDate ? getNextEMIDate(currentDate) : null;

      schedule.push({
        month,
        openingBalance: parseFloat(openingBalance.toFixed(2)),
        emi: parseFloat(emi.toFixed(2)),
        principal: parseFloat(principalPayment.toFixed(2)),
        interest: parseFloat(interestPayment.toFixed(2)),
        gst: parseFloat(gstPayment.toFixed(2)),
        balance: parseFloat(closingBalance.toFixed(2)),
        nextEMIDate,
      });

      if (currentDate) currentDate = new Date(nextEMIDate!);
    }

    setAmortization(schedule);
  }, [principal, interestRate, tenure, processingFee, includeGST, startDate]);

  const resetForm = (): void => {
    setPrincipal("");
    setInterestRate("");
    setTenure("");
    setProcessingFee("");
    setIncludeGST(false);
    setStartDate(undefined);
    setResult(null);
    setAmortization([]);
  };

  const downloadPDF = (): void => {
    if (!result || amortization.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    const totalPrincipal = Number(principal);
    const tenureMonths = Number(tenure);
    const annualInterestRate = Number(interestRate) / 100;
    const totalInterestPayable = result.totalInterest;
    const gstAmount = result.gstAmount;
    const showGst = includeGST;
    const fee = parseFloat(processingFee) || 0;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Credit Card EMI Summary", pageWidth / 2, 20, { align: "center" });

    const lineY = 25;
    doc.setLineWidth(0.8);
    doc.line(15, lineY, pageWidth - 15, lineY);

    doc.setFontSize(12);
    doc.setFont("Helvetica-Oblique", "normal");
    const principalAmountText = `Principal Amount: ${totalPrincipal.toFixed(2)}`;
    const interestRateText = `Interest Rate: ${(annualInterestRate * 100).toFixed(2)}%`;

    doc.text(principalAmountText, 15, 35);
    doc.text(interestRateText, pageWidth - 15 - doc.getTextWidth(interestRateText), 35);
    const loanTenureText = `Loan Tenure: ${tenureMonths} months`;
    doc.text(loanTenureText, 15, 40);
    if (showGst) {
      const gstRateText = `GST Rate: ${((gstAmount / totalInterestPayable) * 100).toFixed(2)}%`;
      doc.text(gstRateText, pageWidth - 15 - doc.getTextWidth(gstRateText), 40);
    }

    const emiAmountText = `EMI Amount: ${result.emi.toFixed(2)}`;
    doc.text(emiAmountText, 15, 45);
    if (fee > 0) {
      const ProcessingFeeText = `Processing Fee Including GST: ${(fee + fee * 0.18).toFixed(2)}`;
      doc.text(ProcessingFeeText, pageWidth - 15 - doc.getTextWidth(ProcessingFeeText), 45);
    }

    const columns = [
      { header: "Sr. No", dataKey: "month" },
      ...(startDate ? [{ header: "EMI Date", dataKey: "date" }] : []),
      { header: "Opening Balance", dataKey: "openingBalance" },
      { header: "EMI", dataKey: "emi" },
      { header: "Principal", dataKey: "principal" },
      { header: "Interest", dataKey: "interest" },
      ...(showGst ? [{ header: "GST", dataKey: "gst" }] : []),
      { header: "Balance", dataKey: "balance" },
      {
        header: `Total (Principal + Interest${showGst ? " + GST" : ""}${fee > 0 ? " + Fee" : ""})`,
        dataKey: "total",
      },
    ];

    const rows = amortization.map(item => ({
      month: item.month,
      date: startDate && item.nextEMIDate ? format(item.nextEMIDate, "dd/MM/yyyy") : "",
      openingBalance: item.openingBalance.toFixed(2),
      emi: item.emi.toFixed(2),
      principal: item.principal.toFixed(2),
      interest: item.interest.toFixed(2),
      gst: showGst ? item.gst.toFixed(2) : "",
      balance: item.balance.toFixed(2),
      total: (item.principal + item.interest + (showGst ? item.gst : 0)).toFixed(2),
    }));

    const totalRow = {
      month: "Total",
      date: startDate ? "" : "",
      openingBalance: fee > 0 ? `Processing Fee - ${(fee + fee * 0.18).toFixed(2)}` : "",
      emi: "",
      principal: totalPrincipal.toFixed(2),
      interest: totalInterestPayable.toFixed(2),
      gst: showGst ? gstAmount.toFixed(2) : "",
      balance: "",
      total: (
        totalPrincipal +
        totalInterestPayable +
        (showGst ? gstAmount : 0) +
        (fee > 0 ? fee + fee * 0.18 : 0)
      ).toFixed(2),
    };

    if (startDate) totalRow.date = "";
    rows.push(totalRow);

    autoTable(doc, {
      startY: 55,
      columns,
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 1,
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        halign: "center",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        font: "Helvetica-Oblique",
      },
      bodyStyles: {
        textColor: [33, 37, 41],
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        font: "Helvetica-Oblique",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      columnStyles: {
        month: { halign: "center" },
        date: { halign: "center" },
        openingBalance: { halign: "center" },
        emi: { halign: "center" },
        principal: { halign: "center" },
        interest: { halign: "center" },
        gst: { halign: "center" },
        processingFee: { halign: "center" },
        balance: { halign: "center" },
        total: { halign: "center" },
      },
      didDrawPage: function (data) {
        const finalY = (data.cursor?.y ?? 0) + 10;
        doc.setFontSize(10);
        doc.text(
          "This schedule includes principal, interest, GST, processing fee and EMI breakup for each month.",
          15,
          finalY
        );
      },
    });

    doc.setFontSize(9);
    doc.text(
      "Generated by ToolifyLab - Professional Tool Laboratory",
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    const filename = showGst ? "amortization-schedule-gst.pdf" : "amortization-schedule.pdf";
    doc.save(filename);
  };

  useEffect(() => {
    if (principal && interestRate && tenure && processingFee) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        calculateEMI();
      }, 0);
    }
  }, [principal, interestRate, tenure, processingFee, includeGST, startDate, calculateEMI]);

  const chartData = useMemo(() => {
    const base = [
      { name: "Principal", value: parseFloat(principal) || 0 },
      { name: "Interest", value: result?.totalInterest || 0 },
    ];
    const gstInterest = includeGST
      ? [{ name: "GST on Interest", value: result?.gstAmount || 0 }]
      : [];
    const fee = parseFloat(processingFee) || 0;
    const feeComponents =
      fee > 0
        ? [
            { name: "Processing Fee", value: fee },
            { name: "GST on Fee", value: fee * 0.18 },
          ]
        : [];

    return [...base, ...gstInterest, ...feeComponents];
  }, [principal, result, includeGST, processingFee]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="from-primary to-primary/80 h-2 w-2 rounded-full bg-linear-to-r"></div>
              Loan Details
            </CardTitle>
            <CardDescription>Enter your loan information to calculate EMI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="Enter loan amount"
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">Interest Rate (%)</Label>
                <Input
                  id="interest"
                  type="number"
                  step="0.1"
                  placeholder="Enter annual interest rate"
                  value={interestRate}
                  onChange={e => setInterestRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (Months)</Label>
                <Input
                  id="tenure"
                  type="number"
                  placeholder="Enter loan tenure"
                  value={tenure}
                  onChange={e => setTenure(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (₹)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  placeholder="Optional fee charged by bank"
                  value={processingFee}
                  onChange={e => setProcessingFee(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Start Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={date => date < new Date()}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="gst"
                checked={includeGST}
                onCheckedChange={checked => setIncludeGST(checked as boolean)}
              />
              <Label htmlFor="gst">Include GST (18%)</Label>
            </div>

            <div className="flex gap-4">
              <Button
                disabled={!principal || !interestRate || !tenure || parseFloat(principal) <= 0}
                onClick={calculateEMI}
                className="modern-button flex-1"
              >
                Calculate EMI
              </Button>

              <Button onClick={resetForm} variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="modern-card animate-in fade-in slide-in-from-bottom-2 shadow-md duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="success-gradient h-2 w-2 rounded-full"></div>
                EMI Calculation Results
              </CardTitle>
              <CardDescription>Your loan payment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="lg:flex lg:gap-6">
                <div className="flex-1 space-y-4">
                  <div className="from-primary/5 to-primary/10 border-primary/20 flex items-center justify-between rounded-xl border bg-linear-to-r p-4">
                    <span className="font-medium">Monthly EMI</span>
                    <span className="text-primary text-2xl font-bold">
                      {formatCurrency(result.emi)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Interest</span>
                      <span className="font-semibold">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    {includeGST && (
                      <div className="flex justify-between">
                        <span>GST on Interest Amount</span>
                        <span className="font-semibold">{formatCurrency(result.gstAmount)}</span>
                      </div>
                    )}
                    {parseFloat(processingFee) > 0 && (
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(processingFee))}
                        </span>
                      </div>
                    )}
                    {parseFloat(processingFee) > 0 && (
                      <div className="flex justify-between">
                        <span>GST on Processing Fee</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(processingFee) * 0.18)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Payment</span>
                      <span className="font-bold">{formatCurrency(result.totalPayment)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 hidden flex-1 rounded-md border md:block lg:mt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={50}
                        outerRadius={80}
                      >
                        {chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ["#1abc9c", "#3498db", "#e67e22", "#9b59b6", "#e74c3c", "#f1c40f"][
                                index % 6
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number | undefined) =>
                          value !== undefined ? `₹${value.toFixed(2)}` : ""
                        }
                      />
                      <Legend
                        content={({ payload }) => (
                          <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                            {payload?.map((entry, i) => {
                              const dataItem = chartData[i];
                              return (
                                <li key={`item-${i}`} className="flex items-center gap-2">
                                  <div
                                    style={{
                                      width: 12,
                                      height: 12,
                                      backgroundColor: entry.color,
                                    }}
                                  />
                                  <span>
                                    {dataItem?.name}: ₹{dataItem?.value?.toFixed(2) ?? "0.00"}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Button onClick={downloadPDF} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {amortization.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amortization Schedule</CardTitle>
            <CardDescription>Monthly payment breakdown over the loan tenure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted text-muted-foreground text-center text-sm uppercase">
                    <TableHead className="text-center">Sr. No</TableHead>
                    {startDate && <TableHead className="text-center">EMI Date</TableHead>}
                    <TableHead className="text-center">Opening Balance</TableHead>
                    <TableHead className="text-center">EMI</TableHead>
                    <TableHead className="text-center">Principal</TableHead>
                    <TableHead className="text-center">Interest</TableHead>
                    {includeGST && <TableHead className="text-center">GST</TableHead>}
                    <TableHead className="text-center">Balance</TableHead>
                    <TableHead className="text-center">
                      Total (Principal + Interest{includeGST ? " + GST" : ""})
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {amortization.map(row => (
                    <TableRow
                      key={row.month}
                      className="even:bg-muted/40 hover:bg-muted/60 text-center transition-colors"
                    >
                      <TableCell>{row.month}</TableCell>
                      {startDate && (
                        <TableCell>
                          {row.nextEMIDate ? format(row.nextEMIDate, "dd/MM/yyyy") : "-"}
                        </TableCell>
                      )}
                      <TableCell>{formatCurrency(row.openingBalance)}</TableCell>
                      <TableCell>{formatCurrency(row.emi)}</TableCell>
                      <TableCell>{formatCurrency(row.principal)}</TableCell>
                      <TableCell>{formatCurrency(row.interest)}</TableCell>
                      {includeGST && <TableCell>{formatCurrency(row.gst)}</TableCell>}
                      <TableCell>{formatCurrency(row.balance)}</TableCell>
                      <TableCell>
                        {formatCurrency(row.principal + row.interest + (includeGST ? row.gst : 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-primary/5 text-center font-semibold">
                    <TableCell colSpan={startDate ? 4 : 3}>Total</TableCell>
                    <TableCell>{formatCurrency(Number(principal))}</TableCell>
                    <TableCell>{formatCurrency(result?.totalInterest ?? 0)}</TableCell>
                    {includeGST && <TableCell>{formatCurrency(result?.gstAmount ?? 0)}</TableCell>}
                    <TableCell />
                    <TableCell>
                      {formatCurrency(
                        Number(principal) +
                          (result?.totalInterest ?? 0) +
                          (includeGST ? (result?.gstAmount ?? 0) : 0)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
