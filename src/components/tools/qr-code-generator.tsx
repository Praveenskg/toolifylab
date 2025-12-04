"use client";
import { Badge } from "@/components/ui/badge";
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Link,
  QrCode,
  Smartphone,
  X,
} from "lucide-react";
import NextImage from "next/image";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [size, setSize] = useState([224]);
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState([20]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errorCorrectionLevels = [
    { value: "L", label: "Low (7%)", description: "Recovers 7% of data" },
    { value: "M", label: "Medium (15%)", description: "Recovers 15% of data" },
    {
      value: "Q",
      label: "Quartile (25%)",
      description: "Recovers 25% of data",
    },
    { value: "H", label: "High (30%)", description: "Recovers 30% of data" },
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate QR code when dependencies change
  useEffect(() => {
    let isCancelled = false;

    const generateQRCode = async () => {
      if (!text.trim()) {
        if (!isCancelled) {
          setQrCodeDataUrl("");
        }
        return;
      }

      if (!isCancelled) {
        setIsGenerating(true);
      }

      try {
        const options = {
          width: size[0],
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: errorCorrection as "L" | "M" | "Q" | "H",
        };

        const dataUrl = await QRCode.toDataURL(text, options);

        if (isCancelled) return;

        // If logo is present, overlay it on the QR code
        if (logoImage) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = size[0];
            canvas.height = size[0];

            // Draw QR code
            const qrImg = new Image();
            qrImg.onload = () => {
              if (isCancelled) return;
              ctx.drawImage(qrImg, 0, 0, size[0], size[0]);

              // Draw logo in center
              const logoImg = new Image();
              logoImg.onload = () => {
                if (isCancelled) return;
                const logoWidth = (size[0] * logoSize[0]) / 100;
                const logoHeight = (size[0] * logoSize[0]) / 100;
                const logoX = (size[0] - logoWidth) / 2;
                const logoY = (size[0] - logoHeight) / 2;

                // Add white background for logo
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(logoX - 2, logoY - 2, logoWidth + 4, logoHeight + 4);

                ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
                setQrCodeDataUrl(canvas.toDataURL());
                setIsGenerating(false);
              };
              logoImg.src = logoImage;
            };
            qrImg.src = dataUrl;
          }
        } else {
          setQrCodeDataUrl(dataUrl);
          setIsGenerating(false);
        }
      } catch {
        // Error generating QR code
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generateQRCode();

    return () => {
      isCancelled = true;
    };
  }, [text, size, errorCorrection, foregroundColor, backgroundColor, logoImage, logoSize]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };
  const copyToClipboard = async () => {
    if (!qrCodeDataUrl) return;
    try {
      await navigator.clipboard.writeText(qrCodeDataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy to clipboard
    }
  };
  const getInputType = (text: string) => {
    if (text.startsWith("http://") || text.startsWith("https://")) {
      return { type: "URL", icon: Link, color: "text-blue-500" };
    }
    if (text.includes("@") && text.includes(".")) {
      return { type: "Email", icon: FileText, color: "text-green-500" };
    }
    if (text.match(/^\+?[\d\s\-()]+$/)) {
      return { type: "Phone", icon: Smartphone, color: "text-purple-500" };
    }
    return { type: "Text", icon: FileText, color: "text-gray-500" };
  };
  const inputType = getInputType(text);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Content to encode</Label>
              <Textarea
                id="text-input"
                placeholder="Enter text, URL, email, phone number, or any content..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              {text && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={inputType.color}>
                    <inputType.icon className="mr-1 h-3 w-3" />
                    {inputType.type}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{text.length} characters</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Size: {size[0]}px</Label>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  max={512}
                  min={128}
                  step={32}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {errorCorrectionLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span>{level.label}</span>
                          <span className="text-muted-foreground text-xs">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Foreground Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={e => setForegroundColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={e => setForegroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={e => setBackgroundColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={e => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo Overlay</Label>
                  <div className="space-y-2">
                    {logoImage ? (
                      <div className="flex items-center gap-2">
                        <NextImage
                          src={logoImage}
                          alt="Logo preview"
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded border"
                        />
                        <span className="text-muted-foreground flex-1 text-sm">Logo uploaded</span>
                        <Button onClick={removeLogo} variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                {logoImage && (
                  <div className="space-y-2">
                    <Label>Logo Size: {logoSize[0]}%</Label>
                    <Slider
                      value={logoSize}
                      onValueChange={setLogoSize}
                      max={30}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/20 border-muted-foreground/20 flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
              {isGenerating ? (
                <div className="space-y-2 text-center">
                  <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground text-sm">Generating QR Code...</p>
                </div>
              ) : qrCodeDataUrl ? (
                <div className="space-y-4 py-2 text-center">
                  <NextImage
                    src={qrCodeDataUrl}
                    alt="Generated QR Code"
                    width={280}
                    height={280}
                    className="mx-auto h-auto max-w-full rounded-lg shadow-lg"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={downloadQRCode}
                      size="sm"
                      className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-linear-to-r"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className={copied ? "border-green-200 bg-green-50 text-green-700" : ""}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy URL"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <QrCode className="text-muted-foreground/50 mx-auto h-12 w-12" />
                  <p className="text-muted-foreground text-sm">
                    Enter content above to generate QR code
                  </p>
                </div>
              )}
            </div>
            {qrCodeDataUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>
                    • Size: {size[0]}x{size[0]} pixels
                  </p>
                  <p>
                    • Error Correction:{" "}
                    {errorCorrectionLevels.find(l => l.value === errorCorrection)?.label}
                  </p>
                  <p>• Content Type: {inputType.type}</p>
                  <p>• Characters: {text.length}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">What you can encode:</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Website URLs</li>
                <li>• Email addresses</li>
                <li>• Phone numbers</li>
                <li>• Plain text messages</li>
                <li>• Contact information (vCard)</li>
                <li>• WiFi network details</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Best practices:</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Use higher error correction for small QR codes</li>
                <li>• Ensure good contrast between colors</li>
                <li>• Test the QR code before printing</li>
                <li>• Keep URLs short for better scanning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
