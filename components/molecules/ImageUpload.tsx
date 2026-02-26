"use client";

import * as React from "react";
import { ImagePlus, X, Edit2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";

export interface UploadedImage {
  name: string;
  size: string;
  url: string;
}

export interface ImageUploadProps {
  label?: string;
  image?: UploadedImage;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  accept?: string;
  pendingTitle?: string;
  pendingDescription?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  previewHeight?: number;
}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  (
    {
      label,
      image,
      onUpload,
      onRemove,
      onEdit,
      onDownload,
      accept = "image/*",
      pendingTitle = "Upload image",
      pendingDescription = "Drag & drop or click to select",
      className,
      aspectRatio = "auto",
      previewHeight = 180,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && onUpload) {
        onUpload(file);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const aspectRatioClass = {
      square: "aspect-square",
      video: "aspect-video",
      auto: "",
    }[aspectRatio];

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)}>
        {label && (
          <span className="text-caption font-medium text-muted">{label}</span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {!image ? (
          // Pending state
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-md cursor-pointer transition-all",
              "bg-neutral/20 border-2 border-dashed border-border",
              "hover:border-muted hover:bg-neutral/30",
              isDragging && "border-primary bg-primary/5",
              aspectRatioClass,
              !aspectRatio || aspectRatio === "auto" ? "p-6" : ""
            )}
            style={
              aspectRatio === "auto" ? { minHeight: previewHeight } : undefined
            }
          >
            <ImagePlus className="h-8 w-8 text-muted" />
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-small font-semibold text-text">
                {pendingTitle}
              </span>
              <span className="text-caption text-muted">
                {pendingDescription}
              </span>
            </div>
          </div>
        ) : (
          // Loaded state with preview
          <div className="flex flex-col rounded-md border border-border bg-surface overflow-hidden">
            {/* Image preview */}
            <div
              className={cn(
                "relative bg-neutral/30 rounded-t-md overflow-hidden",
                aspectRatioClass
              )}
              style={
                aspectRatio === "auto" ? { height: previewHeight } : undefined
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Footer with info and actions */}
            <div className="flex items-center justify-between gap-3 p-3">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-caption font-semibold text-text truncate">
                  {image.name}
                </span>
                <span className="text-caption text-muted">{image.size}</span>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <IconButton
                    icon={<Edit2 className="h-4 w-4" />}
                    onClick={onEdit}
                    variant="ghost"
                    size="sm"
                    aria-label="Edit image"
                    className="text-muted hover:text-text"
                  />
                )}
                {onDownload && (
                  <IconButton
                    icon={<Download className="h-4 w-4" />}
                    onClick={onDownload}
                    variant="ghost"
                    size="sm"
                    aria-label="Download image"
                    className="text-muted hover:text-text"
                  />
                )}
                {onRemove && (
                  <IconButton
                    icon={<X className="h-4 w-4" />}
                    onClick={onRemove}
                    variant="ghost"
                    size="sm"
                    aria-label="Remove image"
                    className="text-muted hover:text-error"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export { ImageUpload };
