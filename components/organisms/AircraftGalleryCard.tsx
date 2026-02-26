import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface AircraftGalleryCardProps {
  /** Array of image URLs (should have 6 images) */
  images: string[];
  /** Number of additional images */
  additionalImagesCount?: number;
  /** View more button click handler */
  onViewMore?: () => void;
  /** Custom button text */
  buttonText?: string;
}

export const AircraftGalleryCard: React.FC<AircraftGalleryCardProps> = ({
  images,
  additionalImagesCount = 4,
  onViewMore,
  buttonText,
}) => {
  const defaultButtonText = `Ver ${additionalImagesCount} imagenes mas`;
  const displayImages = images.slice(0, 6);
  const firstRow = displayImages.slice(0, 3);
  const secondRow = displayImages.slice(3, 6);

  return (
    <div className="w-full bg-surface rounded-md border border-border p-6 flex flex-col gap-3">
      {/* First Row - 3 images */}
      <div className="flex gap-3 w-full">
        {firstRow.map((imageUrl, index) => (
          <div
            key={`row1-${index}`}
            className="flex-1 h-[150px] rounded-sm overflow-hidden"
          >
            {imageUrl ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral to-muted/30" />
            )}
          </div>
        ))}
      </div>

      {/* Second Row - 3 images */}
      {secondRow.length > 0 && (
        <div className="flex gap-3 w-full">
          {secondRow.map((imageUrl, index) => (
            <div
              key={`row2-${index}`}
              className="flex-1 h-[150px] rounded-sm overflow-hidden"
            >
              {imageUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral to-muted/30" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* View More Button */}
      {additionalImagesCount > 0 && (
        <Button
          variant="outline"
          size="md"
          onClick={onViewMore}
          icon={<ChevronDown className="w-4 h-4" strokeWidth={1} />}
          className="w-full"
        >
          {buttonText || defaultButtonText}
        </Button>
      )}
    </div>
  );
};
