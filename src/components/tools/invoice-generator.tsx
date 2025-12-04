"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Building2,
  Calendar as CalendarIcon,
  DollarSign,
  Download,
  FileText,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  tax: number;
};

type CompanyInfo = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  logo?: string;
};

type ClientInfo = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  taxRate: number;
  discount: number;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
};

type InvoiceTemplate = {
  id: string;
  name: string;
  data: InvoiceData & { createdAt: Date };
  createdAt: Date;
};

// Currency options
const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

// Tax rates
const TAX_RATES = [
  { label: "No Tax", value: 0 },
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "18%", value: 18 },
  { label: "20%", value: 20 },
  { label: "25%", value: 25 },
];

// Zod validation schema
const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.date({
    message: "Invoice date is required",
  }),
  dueDate: z.date({
    message: "Due date is required",
  }),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.number().min(0).max(100),
  discount: z.number().min(0).max(100),
  company: z.object({
    name: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    website: z.string().optional(),
  }),
  client: z.object({
    name: z.string().min(1, "Client name is required"),
    email: z.email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Item description is required"),
        quantity: z.number().min(0.01, "Quantity must be greater than 0"),
        rate: z.number().min(0, "Rate must be 0 or greater"),
        tax: z.number().min(0).max(100),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function InvoiceGenerator() {
  const [currentTab, setCurrentTab] = useState("create");
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      currency: "USD",
      taxRate: 18,
      discount: 0,
      company: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        website: "",
      },
      client: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      items: [{ description: "", quantity: 1, rate: 0, tax: 0 }],
      notes: "",
      terms: "Payment due within 30 days of invoice date.",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedValues = watch();

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("invoice-templates");
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(
          parsed.map((t: InvoiceTemplate) => ({
            ...t,
            data: {
              ...t.data,
              invoiceDate: new Date(t.data.invoiceDate),
              dueDate: new Date(t.data.dueDate),
            },
          }))
        );
      } catch {
        setTemplates([]);
      }
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = useCallback((newTemplates: InvoiceTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("invoice-templates", JSON.stringify(newTemplates));
  }, []);

  // Utility functions
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    return currency?.symbol || "$";
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const currentItems = watchedValues.items;
    const items = [...currentItems];
    items[index] = {
      ...items[index],
      [field]: typeof value === "string" ? value : isNaN(value) ? 0 : value,
    };
    setValue("items", items);
  };

  const addItem = () => {
    const currentItems = watchedValues.items;
    setValue("items", [...currentItems, { description: "", quantity: 1, rate: 0, tax: 0 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = watchedValues.items;
    if (currentItems.length > 1) {
      setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const saveAsTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (!templateName) return;

    const newTemplate: InvoiceTemplate = {
      id: Date.now().toString(),
      name: templateName,
      data: {
        ...watchedValues,
        createdAt: new Date(),
      },
      createdAt: new Date(),
    };

    const newTemplates = [...templates, newTemplate];
    saveTemplates(newTemplates);
    toast.success("Template saved successfully!");
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      Object.keys(template.data).forEach(key => {
        if (key !== "createdAt") {
          setValue(key as keyof InvoiceFormData, template.data[key as keyof InvoiceData]);
        }
      });
      setSelectedTemplate(templateId);
      toast.success("Template loaded successfully!");
    }
  };

  const deleteTemplate = (templateId: string) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(newTemplates);
    if (selectedTemplate === templateId) {
      setSelectedTemplate("");
    }
    toast.success("Template deleted successfully!");
  };

  const calculateTotals = () => {
    let subtotal = 0;

    watchedValues.items.forEach(item => {
      const itemTotal = item.quantity * item.rate;
      subtotal += itemTotal;
    });

    const discountAmount = (watchedValues.discount / 100) * subtotal;
    const finalTax = (watchedValues.taxRate / 100) * (subtotal - discountAmount);
    const total = subtotal - discountAmount + finalTax;

    return {
      subtotal,
      discountAmount,
      taxTotal: finalTax,
      total,
    };
  };

  const { subtotal, discountAmount, taxTotal, total } = calculateTotals();

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const currencySymbol = getCurrencySymbol(watchedValues.currency);

      // Header
      doc.setFontSize(20);
      doc.text("INVOICE", 20, 30);

      // Company info
      doc.setFontSize(12);
      doc.text(watchedValues.company.name || "Your Company", 20, 50);
      if (watchedValues.company.email) doc.text(watchedValues.company.email, 20, 60);
      if (watchedValues.company.phone) doc.text(watchedValues.company.phone, 20, 70);
      if (watchedValues.company.address) doc.text(watchedValues.company.address, 20, 80);

      // Invoice details
      doc.text(`Invoice #: ${watchedValues.invoiceNumber}`, 150, 50);
      doc.text(`Date: ${format(watchedValues.invoiceDate, "MMM dd, yyyy")}`, 150, 60);
      doc.text(`Due Date: ${format(watchedValues.dueDate, "MMM dd, yyyy")}`, 150, 70);

      // Client info
      doc.text("Bill To:", 20, 100);
      doc.text(watchedValues.client.name || "Client Name", 20, 110);
      if (watchedValues.client.email) doc.text(watchedValues.client.email, 20, 120);
      if (watchedValues.client.phone) doc.text(watchedValues.client.phone, 20, 130);

      // Items table
      const tableData = watchedValues.items.map(item => [
        item.description,
        item.quantity.toString(),
        `${currencySymbol}${item.rate.toFixed(2)}`,
        `${item.tax}%`,
        `${currencySymbol}${(item.quantity * item.rate * (1 + item.tax / 100)).toFixed(2)}`,
      ]);

      (
        doc as jsPDF & { autoTable: (options: unknown) => void; lastAutoTable: { finalY: number } }
      ).autoTable({
        head: [["Description", "Qty", "Rate", "Tax", "Total"]],
        body: tableData,
        startY: 150,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Totals
      const finalY =
        (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
      doc.text(`Subtotal: ${currencySymbol}${subtotal.toFixed(2)}`, 150, finalY);
      if (discountAmount > 0) {
        doc.text(
          `Discount (${watchedValues.discount}%): -${currencySymbol}${discountAmount.toFixed(2)}`,
          150,
          finalY + 10
        );
      }
      doc.text(
        `Tax (${watchedValues.taxRate}%): ${currencySymbol}${taxTotal.toFixed(2)}`,
        150,
        finalY + (discountAmount > 0 ? 20 : 10)
      );
      doc.setFontSize(14);
      doc.text(
        `Total: ${currencySymbol}${total.toFixed(2)}`,
        150,
        finalY + (discountAmount > 0 ? 35 : 25)
      );

      // Notes
      if (watchedValues.notes) {
        doc.setFontSize(10);
        doc.text("Notes:", 20, finalY + 50);
        doc.text(watchedValues.notes, 20, finalY + 60);
      }

      // Terms
      if (watchedValues.terms) {
        doc.text("Terms:", 20, finalY + 80);
        doc.text(watchedValues.terms, 20, finalY + 90);
      }

      // Save PDF
      doc.save(`invoice-${watchedValues.invoiceNumber}.pdf`);
      toast.success("PDF generated successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const onSubmit = () => {
    generatePDF();
  };

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Create Invoice
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Invoice Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Invoice Settings
                </CardTitle>
                <CardDescription>Configure your invoice details and currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Controller
                      name="invoiceNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="INV-001"
                          className={errors.invoiceNumber ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.invoiceNumber && (
                      <p className="text-sm text-red-500">{errors.invoiceNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map(currency => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.name} ({currency.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Controller
                      name="invoiceDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.invoiceDate && (
                      <p className="text-sm text-red-500">{errors.invoiceDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dueDate && (
                      <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Controller
                      name="taxRate"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value.toString()}
                          onValueChange={value => field.onChange(parseFloat(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax rate" />
                          </SelectTrigger>
                          <SelectContent>
                            {TAX_RATES.map(rate => (
                              <SelectItem key={rate.value} value={rate.value.toString()}>
                                {rate.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Controller
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Your business details for the invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company.name">Company Name *</Label>
                  <Controller
                    name="company.name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Your Company Name"
                        className={errors.company?.name ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.company?.name && (
                    <p className="text-sm text-red-500">{errors.company.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company.email">Email</Label>
                    <Controller
                      name="company.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="company@example.com"
                          className={errors.company?.email ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.company?.email && (
                      <p className="text-sm text-red-500">{errors.company.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company.phone">Phone</Label>
                    <Controller
                      name="company.phone"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company.address">Address</Label>
                  <Controller
                    name="company.address"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="123 Business St" />}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company.city">City</Label>
                    <Controller
                      name="company.city"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="City" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company.state">State</Label>
                    <Controller
                      name="company.state"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="State" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company.zipCode">ZIP Code</Label>
                    <Controller
                      name="company.zipCode"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="12345" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company.country">Country</Label>
                    <Controller
                      name="company.country"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Country" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company.website">Website</Label>
                    <Controller
                      name="company.website"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="www.company.com" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
              <CardDescription>Bill to client details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client.name">Client Name *</Label>
                  <Controller
                    name="client.name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Client Company Name"
                        className={errors.client?.name ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.client?.name && (
                    <p className="text-sm text-red-500">{errors.client.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client.email">Email</Label>
                  <Controller
                    name="client.email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="client@example.com"
                        className={errors.client?.email ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.client?.email && (
                    <p className="text-sm text-red-500">{errors.client.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client.phone">Phone</Label>
                  <Controller
                    name="client.phone"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="+1 (555) 123-4567" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client.address">Address</Label>
                  <Controller
                    name="client.address"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="123 Client St" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client.city">City</Label>
                  <Controller
                    name="client.city"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="City" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client.state">State</Label>
                  <Controller
                    name="client.state"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="State" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client.zipCode">ZIP Code</Label>
                  <Controller
                    name="client.zipCode"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="12345" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Items
              </CardTitle>
              <CardDescription>Add products or services to your invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {watchedValues.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-12 items-end gap-4"
                  >
                    <div className="col-span-5 space-y-2">
                      <Label className="text-sm font-medium">Description *</Label>
                      <Input
                        placeholder="Product or service description"
                        value={item.description}
                        onChange={e => handleItemChange(index, "description", e.target.value)}
                        className={errors.items?.[index]?.description ? "border-red-500" : ""}
                      />
                      {errors.items?.[index]?.description && (
                        <p className="text-xs text-red-500">
                          {errors.items[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Quantity *</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="1"
                        value={item.quantity}
                        onChange={e =>
                          handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)
                        }
                        className={errors.items?.[index]?.quantity ? "border-red-500" : ""}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-xs text-red-500">
                          {errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Rate *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={e =>
                          handleItemChange(index, "rate", parseFloat(e.target.value) || 0)
                        }
                        className={errors.items?.[index]?.rate ? "border-red-500" : ""}
                      />
                      {errors.items?.[index]?.rate && (
                        <p className="text-xs text-red-500">{errors.items[index]?.rate?.message}</p>
                      )}
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Tax %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={item.tax}
                        onChange={e =>
                          handleItemChange(index, "tax", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={watchedValues.items.length === 1}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={addItem} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Add notes and terms to your invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Additional notes or comments..." rows={3} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Payment terms and conditions..." rows={3} />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button onClick={saveAsTemplate} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save as Template
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isGeneratingPDF}
              className="min-w-[150px]"
            >
              {isGeneratingPDF ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4"
                  >
                    <Download className="h-4 w-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Saved Templates
              </CardTitle>
              <CardDescription>Manage your invoice templates for quick reuse</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">No templates saved</h3>
                  <p className="text-muted-foreground">
                    Create and save your first invoice template to get started.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map(template => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-muted-foreground text-sm">
                            Created {format(template.data.createdAt, "MMM dd, yyyy")}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {getCurrencySymbol(template.data.currency)} {template.data.currency}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Invoice #:</strong> {template.data.invoiceNumber}
                        </p>
                        <p>
                          <strong>Client:</strong> {template.data.client.name || "N/A"}
                        </p>
                        <p>
                          <strong>Items:</strong> {template.data.items.length}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => loadTemplate(template.id)}
                          className="flex-1"
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Invoice Preview
              </CardTitle>
              <CardDescription>Preview your invoice before generating the PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <div className="mt-2 space-y-1">
                    <p className="font-semibold">{watchedValues.company.name || "Your Company"}</p>
                    {watchedValues.company.email && (
                      <p className="text-sm">{watchedValues.company.email}</p>
                    )}
                    {watchedValues.company.phone && (
                      <p className="text-sm">{watchedValues.company.phone}</p>
                    )}
                    {watchedValues.company.address && (
                      <p className="text-sm">{watchedValues.company.address}</p>
                    )}
                    {(watchedValues.company.city ||
                      watchedValues.company.state ||
                      watchedValues.company.zipCode) && (
                      <p className="text-sm">
                        {[
                          watchedValues.company.city,
                          watchedValues.company.state,
                          watchedValues.company.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {watchedValues.company.country && (
                      <p className="text-sm">{watchedValues.company.country}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p>
                    <strong>Invoice #:</strong> {watchedValues.invoiceNumber}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(watchedValues.invoiceDate, "MMM dd, yyyy")}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {format(watchedValues.dueDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Bill To */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Bill To:</h3>
                  <div className="space-y-1">
                    <p className="font-medium">{watchedValues.client.name || "Client Name"}</p>
                    {watchedValues.client.email && (
                      <p className="text-sm">{watchedValues.client.email}</p>
                    )}
                    {watchedValues.client.phone && (
                      <p className="text-sm">{watchedValues.client.phone}</p>
                    )}
                    {watchedValues.client.address && (
                      <p className="text-sm">{watchedValues.client.address}</p>
                    )}
                    {(watchedValues.client.city ||
                      watchedValues.client.state ||
                      watchedValues.client.zipCode) && (
                      <p className="text-sm">
                        {[
                          watchedValues.client.city,
                          watchedValues.client.state,
                          watchedValues.client.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {watchedValues.client.country && (
                      <p className="text-sm">{watchedValues.client.country}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-semibold">Description</th>
                      <th className="py-2 text-center font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Rate</th>
                      <th className="py-2 text-center font-semibold">Tax</th>
                      <th className="py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchedValues.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.description || "Item description"}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">
                          {getCurrencySymbol(watchedValues.currency)}
                          {item.rate.toFixed(2)}
                        </td>
                        <td className="py-2 text-center">{item.tax}%</td>
                        <td className="py-2 text-right">
                          {getCurrencySymbol(watchedValues.currency)}
                          {(item.quantity * item.rate * (1 + item.tax / 100)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator />

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {getCurrencySymbol(watchedValues.currency)}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({watchedValues.discount}%):</span>
                      <span>
                        -{getCurrencySymbol(watchedValues.currency)}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({watchedValues.taxRate}%):</span>
                    <span>
                      {getCurrencySymbol(watchedValues.currency)}
                      {taxTotal.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>
                      {getCurrencySymbol(watchedValues.currency)}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              {(watchedValues.notes || watchedValues.terms) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    {watchedValues.notes && (
                      <div>
                        <h4 className="mb-2 font-semibold">Notes:</h4>
                        <p className="text-muted-foreground text-sm">{watchedValues.notes}</p>
                      </div>
                    )}
                    {watchedValues.terms && (
                      <div>
                        <h4 className="mb-2 font-semibold">Terms & Conditions:</h4>
                        <p className="text-muted-foreground text-sm">{watchedValues.terms}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
