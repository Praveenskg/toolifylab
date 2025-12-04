"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crop, Download, Eye, FileImage, ImagesIcon, Palette, Settings, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ColorPicker from "../Image-tools/ColorPicker";
import ImageCompressor from "../Image-tools/ImageCompressor";
import ImageConverter from "../Image-tools/ImageConverter";
import ImageResizer from "../Image-tools/ImageResizer";
import MetadataViewer from "../Image-tools/MetadataViewer";
import { FileUpload } from "../ui/file-upload";

export default function ImageTools() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("resizer");

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
  };
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2 grid w-full grid-cols-4">
          <TabsTrigger value="resizer" className="flex items-center gap-2">
            <Crop className="h-4 w-4" />
            <span className="hidden sm:inline">Resizer</span>
          </TabsTrigger>
          <TabsTrigger value="converter" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            <span className="hidden sm:inline">Converter</span>
          </TabsTrigger>
          <TabsTrigger value="compressor" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Compressor</span>
          </TabsTrigger>
          <TabsTrigger value="color-picker" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
        </TabsList>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="background-remover" className="flex items-center gap-2">
            <ImagesIcon className="h-4 w-4" />
            <span className="hidden sm:inline">BG Remove</span>
          </TabsTrigger>
          <TabsTrigger value="cropper" className="flex items-center gap-2">
            <Crop className="h-4 w-4" />
            <span className="hidden sm:inline">Cropper</span>
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Metadata</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </TabsTrigger>
        </TabsList>

        {!selectedImage && (
          <Card className="modern-card mb-6">
            <CardContent className="pt-6">
              <FileUpload
                onChange={files => {
                  const file = files[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(file);
                  }
                }}
              />
            </CardContent>
          </Card>
        )}

        {selectedImage && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Selected Image</CardTitle>
                  <CardDescription>
                    {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                  }}
                >
                  Change Image
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        <TabsContent value="resizer" className="space-y-4">
          <ImageResizer selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="converter" className="space-y-4">
          <ImageConverter selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="compressor" className="space-y-4">
          <ImageCompressor selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="color-picker" className="space-y-4">
          <ColorPicker selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="background-remover" className="space-y-4">
          <BackgroundRemover selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="cropper" className="space-y-4">
          <ImageCropper selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="metadata" className="space-y-4">
          <MetadataViewer selectedImage={selectedImage} />
        </TabsContent>
        <TabsContent value="filters" className="space-y-4">
          <ImageFilters selectedImage={selectedImage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BackgroundRemover({ selectedImage }: { selectedImage: File | null }) {
  const [tolerance, setTolerance] = useState<number>(30);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (!selectedImage) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setImageUrl("");
          setProcessedImageUrl("");
        }, 0);
      } else {
        setTimeout(() => {
          setProcessedImageUrl("");
        }, 0);
      }
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setImageUrl(url);
      setProcessedImageUrl("");
    }, 0);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage, imageUrl]);

  const removeBackground = () => {
    setIsProcessing(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        // Parse background color
        const bgColor = backgroundColor.startsWith("#")
          ? backgroundColor.substring(1)
          : backgroundColor;
        const bgR = parseInt(bgColor.substring(0, 2), 16);
        const bgG = parseInt(bgColor.substring(2, 4), 16);
        const bgB = parseInt(bgColor.substring(4, 6), 16);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          // Calculate color difference
          const diff = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          // If color is similar to background, make it transparent
          if (diff <= tolerance) {
            imageData.data[i + 3] = 0; // Set alpha to 0
          }
        }

        ctx?.putImageData(imageData, 0, 0);

        canvas.toBlob(blob => {
          if (blob) {
            if (processedImageUrl) {
              URL.revokeObjectURL(processedImageUrl);
            }
            const url = URL.createObjectURL(blob);
            setProcessedImageUrl(url);
            setIsProcessing(false);
          }
        }, "image/png");
      }
    };

    img.src = imageUrl;
  };

  const downloadProcessedImage = () => {
    if (processedImageUrl) {
      const a = document.createElement("a");
      a.href = processedImageUrl;
      const originalName = selectedImage?.name || "image";
      const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
      a.download = `${nameWithoutExt}_no_bg.png`;
      a.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagesIcon className="h-5 w-5" />
          Background Remover
        </CardTitle>
        <CardDescription>Remove background from images automatically</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage ? (
          <div className="text-muted-foreground py-8 text-center">
            Upload an image to remove background
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={e => setBackgroundColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded border"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={e => setBackgroundColor(e.target.value)}
                      className="border-input bg-background flex-1 rounded-md border px-3 py-2"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tolerance: {tolerance}</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={tolerance}
                    onChange={e => setTolerance(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <div className="text-muted-foreground mt-1 text-xs">
                    Higher tolerance = more aggressive removal
                  </div>
                </div>

                <Button onClick={removeBackground} disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ImagesIcon className="mr-2 h-4 w-4" />
                      Remove Background
                    </>
                  )}
                </Button>

                <div className="text-muted-foreground text-sm">
                  <p>
                    <strong>Tips:</strong>
                  </p>
                  <p>• Works best with solid color backgrounds</p>
                  <p>• Adjust tolerance for better results</p>
                  <p>• Output will be PNG with transparency</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original</label>
                  <div className="bg-muted/20 rounded-lg border p-4">
                    <div className="flex justify-center">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          height={128}
                          width={128}
                          alt="Original"
                          className="rounded border object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {processedImageUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Processed</label>
                    <div className="bg-muted/20 rounded-lg border p-4">
                      <div className="flex justify-center">
                        <Image
                          src={processedImageUrl}
                          alt="Processed"
                          height={128}
                          width={128}
                          className="rounded border object-contain"
                        />
                      </div>
                    </div>
                    <Button onClick={downloadProcessedImage} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImageCropper({ selectedImage }: { selectedImage: File | null }) {
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setImageUrl("");
        }, 0);
      }
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setImageUrl(url);
    }, 0);

    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      // Set initial crop area to center
      const centerX = img.width / 2 - 100;
      const centerY = img.height / 2 - 100;
      setCropArea({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: Math.min(200, img.width),
        height: Math.min(200, img.height),
      });
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage, imageUrl]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is inside crop area
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef) return;

    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newX = Math.max(0, Math.min(imageDimensions.width - cropArea.width, x - dragStart.x));
    const newY = Math.max(0, Math.min(imageDimensions.height - cropArea.height, y - dragStart.y));

    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx?.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const originalName = selectedImage?.name || "image";
          const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
          a.download = `${nameWithoutExt}_cropped.png`;
          a.click();
          // Revoke URL after a short delay to ensure download starts
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
      }, "image/png");
    };

    img.src = imageUrl;
  };

  const resetCrop = () => {
    const centerX = imageDimensions.width / 2 - 100;
    const centerY = imageDimensions.height / 2 - 100;
    setCropArea({
      x: Math.max(0, centerX),
      y: Math.max(0, centerY),
      width: Math.min(200, imageDimensions.width),
      height: Math.min(200, imageDimensions.height),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="h-5 w-5" />
          Image Cropper
        </CardTitle>
        <CardDescription>Crop your image to specific dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage ? (
          <div className="text-muted-foreground py-8 text-center">Upload an image to crop</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Area</label>
                  <div className="text-muted-foreground text-sm">
                    <div>
                      Position: ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})
                    </div>
                    <div>
                      Size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetCrop} className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={cropImage} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Crop & Download
                  </Button>
                </div>

                <div className="text-muted-foreground text-sm">
                  <p>
                    <strong>Instructions:</strong>
                  </p>
                  <p>• Click and drag the crop area to move it</p>
                  <p>• The crop area is shown as a dashed rectangle</p>
                  <p>• Use Reset to center the crop area</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Crop Preview</label>
                <div className="bg-muted/20 rounded-lg border p-4">
                  <div className="flex justify-center">
                    <canvas
                      ref={setCanvasRef}
                      width={Math.min(300, imageDimensions.width)}
                      height={Math.min(300, imageDimensions.height)}
                      className="cursor-move rounded border"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImageFilters({ selectedImage }: { selectedImage: File | null }) {
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  });
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedImage) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setImageUrl(null);
        setProcessedImageUrl("");
      }, 0);
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setImageUrl(url);
      setProcessedImageUrl("");
      setFilters({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        grayscale: 0,
        sepia: 0,
      });
    }, 0);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage, imageUrl, processedImageUrl]);

  const applyFilters = () => {
    if (!imageUrl) return;
    setIsProcessing(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Brightness
          r = Math.min(255, Math.max(0, r * (filters.brightness / 100)));
          g = Math.min(255, Math.max(0, g * (filters.brightness / 100)));
          b = Math.min(255, Math.max(0, b * (filters.brightness / 100)));

          // Contrast
          const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
          r = Math.min(255, Math.max(0, factor * (r - 128) + 128));
          g = Math.min(255, Math.max(0, factor * (g - 128) + 128));
          b = Math.min(255, Math.max(0, factor * (b - 128) + 128));

          // Saturation
          const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
          r = gray + (filters.saturation / 100) * (r - gray);
          g = gray + (filters.saturation / 100) * (g - gray);
          b = gray + (filters.saturation / 100) * (b - gray);

          // Grayscale
          if (filters.grayscale > 0) {
            const grayValue = 0.2989 * r + 0.587 * g + 0.114 * b;
            r = r + (filters.grayscale / 100) * (grayValue - r);
            g = g + (filters.grayscale / 100) * (grayValue - g);
            b = b + (filters.grayscale / 100) * (grayValue - b);
          }

          // Sepia
          if (filters.sepia > 0) {
            const sr = r * 0.393 + g * 0.769 + b * 0.189;
            const sg = r * 0.349 + g * 0.686 + b * 0.168;
            const sb = r * 0.272 + g * 0.534 + b * 0.131;
            r = r + (filters.sepia / 100) * (sr - r);
            g = g + (filters.sepia / 100) * (sg - g);
            b = b + (filters.sepia / 100) * (sb - b);
          }

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }

        ctx?.putImageData(imageData, 0, 0);

        canvas.toBlob(
          blob => {
            if (blob) {
              if (processedImageUrl) {
                URL.revokeObjectURL(processedImageUrl);
              }
              const url = URL.createObjectURL(blob);
              setProcessedImageUrl(url);
              setIsProcessing(false);
            }
          },
          "image/jpeg",
          0.9
        );
      }
    };

    img.onerror = () => {
      toast.error("Image failed to load.");
      setIsProcessing(false);
    };

    img.src = imageUrl;
  };

  const downloadFilteredImage = () => {
    if (processedImageUrl) {
      const a = document.createElement("a");
      a.href = processedImageUrl;
      const originalName = selectedImage?.name || "image";
      const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
      a.download = `${nameWithoutExt}_filtered.jpg`;
      a.click();
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    });
    setProcessedImageUrl("");
  };

  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px) 
        grayscale(${filters.grayscale}%) 
        sepia(${filters.sepia}%)
      `,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Image Filters
        </CardTitle>
        <CardDescription>Apply filters and adjustments to your image</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedImage ? (
          <div className="text-muted-foreground py-8 text-center">
            Upload an image to apply filters
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Brightness: {filters.brightness}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        brightness: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contrast: {filters.contrast}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        contrast: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Saturation: {filters.saturation}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        saturation: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Blur: {filters.blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.blur}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        blur: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Grayscale: {filters.grayscale}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        grayscale: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sepia: {filters.sepia}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        sepia: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    Reset
                  </Button>
                  <Button onClick={applyFilters} disabled={isProcessing} className="flex-1">
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Apply Filters
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original</label>
                  <div className="bg-muted/20 rounded-lg border p-4">
                    <div className="flex justify-center">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          width={128}
                          height={128}
                          className="rounded border object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview</label>
                  <div className="bg-muted/20 rounded-lg border p-4">
                    <div className="flex justify-center">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          width={128}
                          height={128}
                          className="rounded border object-contain"
                          style={getFilterStyle()}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {processedImageUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Processed</label>
                    <div className="bg-muted/20 rounded-lg border p-4">
                      <div className="flex justify-center">
                        <Image
                          src={processedImageUrl}
                          alt="Original"
                          width={128}
                          height={128}
                          className="rounded border object-contain"
                        />
                      </div>
                    </div>
                    <Button onClick={downloadFilteredImage} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
