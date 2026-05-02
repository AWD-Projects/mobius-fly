"use client";

import * as React from "react";
import { FilePlus, FileCheck, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";

export interface UploadedDocument {
  name: string;
  size: string;
  url?: string;
}

export interface DocumentUploadProps {
  label?: string;
  document?: UploadedDocument;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  pendingTitle?: string;
  pendingDescription?: string;
  className?: string;
  variant?: "default" | "compact";
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentUpload = React.forwardRef<HTMLDivElement, DocumentUploadProps>(
  (
    {
      label,
      document,
      onUpload,
      onRemove,
      accept = ".pdf,.doc,.docx",
      pendingTitle = "Upload PDF document",
      pendingDescription = "Drag & drop or click to select",
      className,
      variant = "default",
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
      e.target.value = "";
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

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

        {!document ? (
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
              variant === "default" ? "p-6" : "p-4"
            )}
          >
            <FilePlus
              className={cn(
                "text-muted",
                variant === "default" ? "h-8 w-8" : "h-6 w-6"
              )}
            />
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
          // Loaded state
          <div
            className={cn(
              "flex items-center gap-3 rounded-md p-3",
              "bg-[#E8F5E9] border border-success"
            )}
          >
            <FileCheck className="h-6 w-6 text-success flex-shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-caption font-semibold text-text truncate">
                {document.name}
              </span>
              <span className="text-caption text-muted">{document.size}</span>
            </div>
            {onRemove && (
              <IconButton
                icon={<X className="h-5 w-5" />}
                onClick={onRemove}
                variant="ghost"
                size="sm"
                aria-label="Remove document"
                className="text-success hover:text-success/70"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

DocumentUpload.displayName = "DocumentUpload";

// Compact variant for forms
const DocumentUploadCompact = React.forwardRef<
  HTMLDivElement,
  Omit<DocumentUploadProps, "variant">
>((props, ref) => <DocumentUpload ref={ref} {...props} variant="compact" />);

DocumentUploadCompact.displayName = "DocumentUploadCompact";

export { DocumentUpload, DocumentUploadCompact, formatFileSize };
