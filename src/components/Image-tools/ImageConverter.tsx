import imageCompression from "browser-image-compression";
import { Download, FileImage, ImagePlay, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

export default function ImageConverter({ selectedImage }: { selectedImage: File | null }) {
  const [targetFormat, setTargetFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState<number>(90);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalFormat, setOriginalFormat] = useState<string>("");
  const [convertedFormat, setConvertedFormat] = useState<string>("");

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);
      setOriginalSize(selectedImage.size);
      setOriginalFormat(selectedImage.type.split("/")[1]);
      setCompressedSize(0); // reset on new image
      setConvertedFormat(""); // reset on new image
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  const getSizeReduction = () => {
    const diff = originalSize - compressedSize;
    return (diff / 1024 / 1024).toFixed(2);
  };

  const getCompressionRatio = () => {
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;
    return reduction.toFixed(2);
  };

  const convertImage = async () => {
    if (!selectedImage) return;
    setIsConverting(true);

    const mimeMap: Record<string, string> = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    const options = {
      fileType: mimeMap[targetFormat],
      initialQuality: targetFormat === "jpeg" ? quality / 100 : 1,
      useWebWorker: true,
    };

    try {
      const convertedBlob = await imageCompression(selectedImage, options);
      setCompressedSize(convertedBlob.size);
      setConvertedFormat(targetFormat);

      const url = URL.createObjectURL(convertedBlob);
      const a = document.createElement("a");
      a.href = url;

      const originalName = selectedImage.name || "image";
      const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
      const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;

      a.download = `${nameWithoutExt}_converted.${ext}`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border p-4 shadow-sm">
      {!selectedImage ? (
        <>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Format Converter
              </CardTitle>
              <CardDescription>
                Convert your image to different formats (JPEG, PNG, WebP)
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="text-destructive flex items-center justify-center py-8 text-center">
            Upload an image to convert
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            <Card className="flex h-full flex-col border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Format Converter
                </CardTitle>
                <CardDescription>
                  Convert your image to different formats (JPEG, PNG, WebP)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Target Format</Label>
                  <Select
                    value={targetFormat}
                    onValueChange={val => setTargetFormat(val as "jpeg" | "png" | "webp")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {targetFormat === "jpeg" && (
                  <div className="space-y-2">
                    <Label>Quality: {quality}%</Label>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      value={[quality]}
                      onValueChange={([val]) => setQuality(val)}
                    />
                  </div>
                )}

                <div className="text-muted-foreground space-y-1 pt-2 text-sm">
                  <p>
                    <strong>JPEG:</strong> Best for photos, smaller file size
                  </p>
                  <p>
                    <strong>PNG:</strong> Lossless, supports transparency
                  </p>
                  <p>
                    <strong>WebP:</strong> Modern and highly compressed
                  </p>
                </div>

                <div className="bg-muted/20 space-y-2 rounded-lg border p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Original Size:</span>
                    <span>{(originalSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Original Format:</span>
                    <span className="uppercase">{originalFormat}</span>
                  </div>
                  {convertedFormat && originalFormat && convertedFormat !== originalFormat && (
                    <div className="flex justify-between">
                      <span>Converted Format:</span>
                      <span className="uppercase">
                        {originalFormat} → {convertedFormat}
                      </span>
                    </div>
                  )}
                  {compressedSize > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Compressed Size:</span>
                        <span>{(compressedSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="flex justify-between font-medium text-green-600">
                        <span>Size Reduction:</span>
                        <span>
                          {getSizeReduction()} MB ({getCompressionRatio()}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {imageUrl && (
              <Card className="flex h-full flex-col border-none py-2 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlay className="h-5 w-5" />
                    Original Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-center justify-center p-4">
                  <div className="relative max-h-[400px] max-w-full overflow-hidden rounded border">
                    <Image
                      src={imageUrl}
                      height={400}
                      width={400}
                      alt="Preview"
                      className="h-auto max-h-[400px] w-auto object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Button onClick={convertImage} disabled={isConverting} className="mt-4 w-full">
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Convert to {targetFormat.toUpperCase()}
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
