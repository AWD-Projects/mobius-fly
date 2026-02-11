import React from 'react';
import { ChevronDown } from 'lucide-react';

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
  const defaultButtonText = `Ver ${additionalImagesCount} imágenes más`;
  const displayImages = images.slice(0, 6);
  const firstRow = displayImages.slice(0, 3);
  const secondRow = displayImages.slice(3, 6);

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-3">
      {/* First Row - 3 images */}
      <div className="flex gap-3 w-full">
        {firstRow.map((imageUrl, index) => (
          <div
            key={`row1-${index}`}
            className="flex-1 h-[150px] rounded-xl overflow-hidden"
          >
            {imageUrl ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
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
              className="flex-1 h-[150px] rounded-xl overflow-hidden"
            >
              {imageUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* View More Button */}
      {additionalImagesCount > 0 && (
        <button
          onClick={onViewMore}
          className="w-full h-10 border border-[#E5E5E5] rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-[#666666]" strokeWidth={2} />
          <span className="text-[#666666] text-[13px] font-medium">
            {buttonText || defaultButtonText}
          </span>
        </button>
      )}
    </div>
  );
};
