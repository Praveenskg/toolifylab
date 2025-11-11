import { Copy, Image as ImageIcon, Loader2, Palette } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function ColorPicker({ selectedImage }: { selectedImage: File | null }) {
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isExtracted, setIsExtracted] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedImage) {
      setImageUrl('');
      setColors([]);
      setSelectedColor('');
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setImageUrl(url);
    setColors([]);
    setSelectedColor('');

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

  const extractColors = () => {
    setIsExtracting(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      const scale = Math.min(1, 200 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const colorMap = new Map<string, number>();

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          if (imageData.data[i + 3] < 128) continue;

          const quantizedR = Math.round(r / 20) * 20;
          const quantizedG = Math.round(g / 20) * 20;
          const quantizedB = Math.round(b / 20) * 20;

          const color = `rgb(${quantizedR}, ${quantizedG}, ${quantizedB})`;
          colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([color]) => color);

        setColors(sortedColors);
        if (sortedColors.length > 0) {
          setSelectedColor(sortedColors[0]);
        }
      }
      setIsExtracting(false);
      setIsExtracted(true);
    };

    img.src = imageUrl;
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const getHexColor = (rgbColor: string) => {
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return rgbColor;
  };

  return (
    <div className='space-y-6 rounded-2xl border p-4 shadow-sm'>
      {!selectedImage ? (
        <>
          <Card className='border-none shadow-none'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Palette className='h-5 w-5' />
                Color Picker
              </CardTitle>
              <CardDescription>Extract colors from your image</CardDescription>
            </CardHeader>
          </Card>
          <div className='text-destructive flex items-center justify-center py-8 text-center'>
            Upload an image to extract colors
          </div>
        </>
      ) : (
        <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2'>
          <Card className='flex flex-col border-none shadow-none'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Palette className='h-5 w-5' />
                Color Picker
              </CardTitle>
              <CardDescription>Extract colors from your image</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button onClick={extractColors} disabled={isExtracting} className='w-full'>
                {isExtracting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Extracting Colors...
                  </>
                ) : (
                  <>
                    <Palette className='mr-2 h-4 w-4' />
                    Extract Colors
                  </>
                )}
              </Button>
              {colors.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='font-medium'>Color Palette</h4>
                  <div className='grid grid-cols-3 gap-2'>
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className='group relative cursor-pointer'
                        onClick={() => setSelectedColor(color)}
                      >
                        <div
                          className='border-muted-foreground/20 hover:border-muted-foreground/50 h-16 w-full rounded-lg border-2 transition-colors'
                          style={{ backgroundColor: color }}
                        />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                          <Button
                            size='sm'
                            variant='secondary'
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(getHexColor(color));
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isExtracted && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Selected Color</label>
                  {selectedColor ? (
                    <div className='space-y-2'>
                      <div
                        className='h-20 w-full rounded-lg border'
                        style={{ backgroundColor: selectedColor }}
                      />
                      <div className='space-y-1 text-sm'>
                        <div className='flex justify-between'>
                          <span>RGB:</span>
                          <span>{selectedColor}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>HEX:</span>
                          <span>{getHexColor(selectedColor)}</span>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => copyToClipboard(getHexColor(selectedColor))}
                        className='w-full'
                      >
                        <Copy /> Copy HEX
                      </Button>
                    </div>
                  ) : (
                    <div className='bg-muted/20 text-muted-foreground flex h-20 w-full items-center justify-center rounded-lg border'>
                      No color selected
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className='flex h-full flex-col border-none shadow-none'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5' />
                Image Preview
              </CardTitle>
              <CardDescription>Preview image used for color extraction</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-1 items-center justify-center'>
              {imageUrl ? (
                <div className='relative max-h-[400px] max-w-full overflow-hidden rounded border'>
                  <Image
                    src={imageUrl}
                    height={400}
                    width={400}
                    alt='Preview'
                    className='h-auto max-h-[400px] w-auto object-contain'
                  />
                </div>
              ) : (
                <Loader2 className='h-6 w-6 animate-spin' />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
