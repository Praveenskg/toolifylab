import * as exifr from 'exifr';
import { Eye, ImagePlay } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function MetadataViewer({ selectedImage }: { selectedImage: File | null }) {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [exifData, setExifData] = useState<ExifData | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setImageUrl('');
      setImageDimensions(null);
      setExifData(null);
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setImageUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = url;

    exifr
      .parse(selectedImage)
      .then((data) => {
        console.table(data);
        setExifData(data as ExifData);
      })
      .catch(console.error);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

  const getAspectRatio = () => {
    if (!imageDimensions) return 'N/A';
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(imageDimensions.width, imageDimensions.height);
    return `${imageDimensions.width / divisor}:${imageDimensions.height / divisor}`;
  };

  const getMegapixels = () => {
    if (!imageDimensions) return 'N/A';
    return ((imageDimensions.width * imageDimensions.height) / 1000000).toFixed(2);
  };

  return (
    <div className='space-y-6 rounded-2xl border p-4 shadow-sm'>
      {!selectedImage ? (
        <>
          <Card className='border-none shadow-none'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Eye className='h-5 w-5' />
                Metadata Viewer
              </CardTitle>
              <CardDescription>View image metadata and EXIF information</CardDescription>
            </CardHeader>
          </Card>
          <div className='text-destructive flex items-center justify-center py-8 text-center'>
            Upload an image to view metadata
          </div>
        </>
      ) : (
        <>
          <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2'>
            <Card className='flex h-full flex-col border-none shadow-none'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Metadata Viewer
                </CardTitle>
                <CardDescription>View image metadata and EXIF information</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='mb-2 font-medium'>File Information</p>
                  <div className='text-muted-foreground space-y-1 text-sm'>
                    <p>Name: {selectedImage.name}</p>
                    <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: {selectedImage.type || 'Unknown'}</p>
                    <p>
                      Last Modified: {new Date(selectedImage.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className='mb-2 font-medium'>Image Details</p>
                  <div className='text-muted-foreground space-y-1 text-sm'>
                    <p>
                      Dimensions:{' '}
                      {imageDimensions
                        ? `${imageDimensions.width} × ${imageDimensions.height}`
                        : 'Loading...'}
                    </p>
                    <p>Aspect Ratio: {getAspectRatio()}</p>
                    <p>Megapixels: {getMegapixels()}</p>
                    <p>Color Space: sRGB</p>
                  </div>
                </div>

                {exifData && (
                  <div>
                    <p className='mb-2 font-medium'>EXIF Metadata</p>
                    <div className='text-muted-foreground space-y-1 text-sm'>
                      {exifData.Make && <p>Camera Make: {exifData.Make}</p>}
                      {exifData.Model && <p>Camera Model: {exifData.Model}</p>}
                      {exifData.FNumber && <p>F-Number: ƒ/{exifData.FNumber}</p>}
                      {exifData.ExposureTime && <p>Exposure Time: {exifData.ExposureTime}s</p>}
                      {exifData.ISO && <p>ISO: {exifData.ISO}</p>}
                      {exifData.DateTimeOriginal && (
                        <p>Date Taken: {new Date(exifData.DateTimeOriginal).toLocaleString()}</p>
                      )}
                      {exifData.LensModel && <p>Lens: {exifData.LensModel}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {imageUrl && (
              <Card className='flex h-full flex-col border-none py-2 shadow-none'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ImagePlay className='h-5 w-5' />
                    Image Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-1 items-center justify-center p-4'>
                  <div className='relative max-h-[400px] max-w-full overflow-hidden rounded border'>
                    <Image
                      src={imageUrl}
                      height={400}
                      width={400}
                      alt='Preview'
                      className='h-auto max-h-[400px] w-auto object-contain'
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
