import { zodResolver } from "@hookform/resolvers/zod";
import { Crop, Download, ImagePlay } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const resizeSchema = z.object({
  width: z
    .number({
      error: "Width is required",
    })
    .positive("Width must be a positive number"),
  height: z
    .number({
      error: "Height is required",
    })
    .positive("Height must be a positive number"),
});

type ResizeFormData = z.infer<typeof resizeSchema>;

export default function ImageResizer({ selectedImage }: { selectedImage: File | null }) {
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(false);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResizeFormData>({
    resolver: zodResolver(resizeSchema),
    defaultValues: {
      width: 800,
      height: 600,
    },
  });

  // React Hook Form's watch() cannot be safely memoized - this is a known library limitation
  // eslint-disable-next-line react-hooks/incompatible-library
  const width = watch("width");
  const height = watch("height");

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);

      const img = new window.Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setValue("width", img.width);
        setValue("height", img.height);
      };
      img.src = url;
    }
  }, [selectedImage, setValue]);

  const handleWidthChange = (value: number) => {
    setValue("width", value);
    if (maintainAspectRatio && originalDimensions && value > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setValue("height", Math.round(value / ratio));
    }
  };

  const handleHeightChange = (value: number) => {
    setValue("height", value);
    if (maintainAspectRatio && originalDimensions && value > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setValue("width", Math.round(value * ratio));
    }
  };

  const resetToOriginal = () => {
    if (originalDimensions) {
      setValue("width", originalDimensions.width);
      setValue("height", originalDimensions.height);
    }
  };

  const onSubmit = (data: ResizeFormData) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = data.width;
      canvas.height = data.height;
      ctx?.drawImage(img, 0, 0, data.width, data.height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `resized_${selectedImage?.name || "image"}`;
            a.click();
            URL.revokeObjectURL(url);
          }
        },
        "image/jpeg",
        0.9
      );
    };

    img.src = imageUrl;
  };

  return (
    <div className="space-y-6 rounded-2xl border p-4 shadow-sm">
      {!selectedImage ? (
        <>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crop className="h-5 w-5" />
                Image Resizer
              </CardTitle>
              <CardDescription>Resize your image to specific dimensions</CardDescription>
            </CardHeader>
          </Card>
          <div className="text-destructive flex items-center justify-center py-8 text-center">
            Upload an image to start resizing
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            <Card className="flex h-full flex-col border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crop className="h-5 w-5" />
                  Image Resizer
                </CardTitle>
                <CardDescription>Resize your image to specific dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        {...register("width", { valueAsNumber: true })}
                        onChange={e => handleWidthChange(Number(e.target.value))}
                        className={errors.width ? "border-destructive ring-destructive ring-1" : ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        {...register("height", { valueAsNumber: true })}
                        onChange={e => handleHeightChange(Number(e.target.value))}
                        className={
                          errors.height ? "border-destructive ring-destructive ring-1" : ""
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        id="aspect-ratio"
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                      <Label htmlFor="aspect-ratio">Maintain Aspect Ratio</Label>
                    </div>
                  </div>
                </div>
                {originalDimensions && (
                  <Button
                    variant="outline"
                    onClick={resetToOriginal}
                    className="w-full"
                    type="button"
                  >
                    Reset to Original ({originalDimensions.width} × {originalDimensions.height})
                  </Button>
                )}
              </CardContent>
            </Card>
            {imageUrl && (
              <Card className="flex h-full flex-col border-none py-2 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlay className="h-5 w-5" />
                    Image Preview
                  </CardTitle>
                  <CardDescription>Live preview based on Dimensions</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center justify-center p-4">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      maxWidth: "100%",
                      maxHeight: "400px",
                    }}
                  >
                    <Image src={imageUrl} alt="Preview" fill className="object-contain" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <Button type="submit" disabled={!selectedImage} className="mt-4 w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Resized Image
          </Button>
        </form>
      )}
    </div>
  );
}
