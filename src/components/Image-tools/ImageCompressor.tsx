import imageCompression from "browser-image-compression";
import { Download, ImagePlay, Loader2, Zap } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

export default function ImageCompressor({ selectedImage }: { selectedImage: File | null }) {
  const [compressionLevel, setCompressionLevel] = useState<number>(60);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const updatePreviewImage = useCallback(
    async (image: File, quality: number) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      try {
        const compressedBlob = await imageCompression(image, options);
        setCompressedSize(compressedBlob.size);

        const newUrl = URL.createObjectURL(compressedBlob);
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setImageUrl(newUrl);
      } catch {
        // Preview compression failed
      }
    },
    [imageUrl]
  );

  useEffect(() => {
    if (selectedImage) {
      setOriginalSize(selectedImage.size);
      updatePreviewImage(selectedImage, compressionLevel);
    }
  }, [selectedImage, compressionLevel, updatePreviewImage]);

  useEffect(() => {
    if (selectedImage) {
      updatePreviewImage(selectedImage, compressionLevel);
    }
  }, [selectedImage, compressionLevel, updatePreviewImage]);

  const compressImage = async () => {
    if (!selectedImage) return;
    setIsCompressing(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: compressionLevel / 100,
    };

    try {
      const compressedBlob = await imageCompression(selectedImage, options);
      setCompressedSize(compressedBlob.size);

      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement("a");
      const nameWithoutExt = selectedImage.name.split(".").slice(0, -1).join(".");
      const ext = compressedBlob.type.split("/")[1] || "jpg";

      a.href = url;
      a.download = `${nameWithoutExt}_compressed.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const getCompressionRatio = () => {
    if (originalSize === 0) return 0;
    return (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
  };

  const getSizeReduction = () => {
    if (originalSize === 0) return 0;
    return ((originalSize - compressedSize) / 1024 / 1024).toFixed(2);
  };

  return (
    <div className="space-y-6 rounded-2xl border p-4 shadow-sm">
      {!selectedImage ? (
        <>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Image Compressor
              </CardTitle>
              <CardDescription>Compress images to reduce file size</CardDescription>
            </CardHeader>
          </Card>
          <div className="text-destructive flex items-center justify-center py-8 text-center">
            Upload an image to compress
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            <Card className="flex h-full flex-col border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Image Compressor
                </CardTitle>
                <CardDescription>Compress images to reduce file size</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <Label className="mb-1 block">Compression Quality: {compressionLevel}%</Label>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      value={[compressionLevel]}
                      onValueChange={([val]) => setCompressionLevel(val)}
                    />
                    <p className="text-muted-foreground mt-2 text-xs">
                      Lower quality = smaller file size
                    </p>
                  </div>
                  <div className="bg-muted/20 space-y-2 rounded-lg border p-4 text-sm">
                    <div className="flex justify-between">
                      <span>Original Size:</span>
                      <span>{(originalSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
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
                  <div className="text-muted-foreground space-y-1 pt-2 text-sm">
                    <p>
                      <strong>Recommended:</strong>
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>90–95%: High quality, minimal compression</li>
                      <li>70–85%: Good balance of quality and size</li>
                      <li>50–70%: Significant compression, quality loss</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            {imageUrl && (
              <Card className="flex h-full flex-col border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlay className="h-5 w-5" />
                    Image Preview
                  </CardTitle>
                  <CardDescription>Live preview based on quality</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center justify-center">
                  {imageUrl ? (
                    <div className="relative max-h-[400px] max-w-full overflow-hidden rounded border">
                      <Image
                        src={imageUrl}
                        height={400}
                        width={400}
                        alt="Preview"
                        className="h-auto max-h-[400px] w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <Button
            onClick={compressImage}
            disabled={isCompressing || !selectedImage}
            className="w-full"
          >
            {isCompressing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Compress & Download
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
