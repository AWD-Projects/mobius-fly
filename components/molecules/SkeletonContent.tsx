import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonText,
  SkeletonImage,
  SkeletonButton,
} from "@/components/atoms/Skeleton";

// Page Header Skeleton
export interface SkeletonPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showBreadcrumb?: boolean;
  showActions?: boolean;
  showDescription?: boolean;
}

const SkeletonPageHeader = React.forwardRef<HTMLDivElement, SkeletonPageHeaderProps>(
  (
    {
      className,
      showBreadcrumb = true,
      showActions = true,
      showDescription = true,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("mb-6", className)} {...props}>
        {showBreadcrumb && (
          <div className="flex items-center gap-2 mb-4">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={8} />
            <Skeleton height={12} width={80} />
            <Skeleton height={12} width={8} />
            <Skeleton height={12} width={100} />
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton height={28} width={250} className="mb-2" />
            {showDescription && <Skeleton height={14} width={400} />}
          </div>
          {showActions && (
            <div className="flex gap-2">
              <SkeletonButton size="md" width={100} />
              <SkeletonButton size="md" width={120} />
            </div>
          )}
        </div>
      </div>
    );
  }
);
SkeletonPageHeader.displayName = "SkeletonPageHeader";

// Section Header Skeleton
export interface SkeletonSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showAction?: boolean;
}

const SkeletonSectionHeader = React.forwardRef<HTMLDivElement, SkeletonSectionHeaderProps>(
  ({ className, showAction = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between mb-4", className)}
        {...props}
      >
        <div>
          <Skeleton height={20} width={180} className="mb-1" />
          <Skeleton height={12} width={250} />
        </div>
        {showAction && <SkeletonButton size="sm" width={80} />}
      </div>
    );
  }
);
SkeletonSectionHeader.displayName = "SkeletonSectionHeader";

// Article/Blog Content Skeleton
export interface SkeletonArticleProps extends React.HTMLAttributes<HTMLDivElement> {
  showImage?: boolean;
  showAuthor?: boolean;
  paragraphs?: number;
}

const SkeletonArticle = React.forwardRef<HTMLDivElement, SkeletonArticleProps>(
  (
    { className, showImage = true, showAuthor = true, paragraphs = 3, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("max-w-2xl", className)} {...props}>
        {/* Title */}
        <Skeleton height={32} width="90%" className="mb-2" />
        <Skeleton height={32} width="60%" className="mb-6" />

        {/* Author info */}
        {showAuthor && (
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#F0F0F0]">
            <Skeleton variant="circular" width={40} height={40} />
            <div>
              <Skeleton height={14} width={120} className="mb-1" />
              <Skeleton height={12} width={180} />
            </div>
          </div>
        )}

        {/* Featured image */}
        {showImage && (
          <SkeletonImage aspectRatio="video" className="mb-6 rounded-xl" />
        )}

        {/* Content paragraphs */}
        <div className="space-y-6">
          {Array.from({ length: paragraphs }).map((_, index) => (
            <SkeletonText
              key={index}
              lines={4}
              lastLineWidth={`${50 + ((index * 17) % 40)}%`}
              spacing="md"
            />
          ))}
        </div>
      </div>
    );
  }
);
SkeletonArticle.displayName = "SkeletonArticle";

// Form Skeleton
export interface SkeletonFormProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: number;
  showLabels?: boolean;
  columns?: 1 | 2;
}

const SkeletonForm = React.forwardRef<HTMLDivElement, SkeletonFormProps>(
  ({ className, fields = 4, showLabels = true, columns = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-5",
          columns === 2 && "grid grid-cols-2 gap-5 space-y-0",
          className
        )}
        {...props}
      >
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            {showLabels && <Skeleton height={12} width={80} />}
            <Skeleton height={44} width="100%" className="rounded-lg" />
          </div>
        ))}
        <div className={cn(columns === 2 && "col-span-2", "pt-2")}>
          <SkeletonButton size="lg" width={140} />
        </div>
      </div>
    );
  }
);
SkeletonForm.displayName = "SkeletonForm";

// Dashboard Grid Skeleton
export interface SkeletonDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  statsCount?: number;
  showChart?: boolean;
  showTable?: boolean;
}

const SkeletonDashboard = React.forwardRef<HTMLDivElement, SkeletonDashboardProps>(
  (
    { className, statsCount = 4, showChart = true, showTable = true, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: statsCount }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5"
            >
              <Skeleton height={12} width={100} className="mb-4" />
              <Skeleton height={28} width={80} className="mb-2" />
              <Skeleton height={12} width={120} />
            </div>
          ))}
        </div>

        {/* Chart and sidebar */}
        <div className="grid grid-cols-3 gap-6">
          {showChart && (
            <div className="col-span-2 rounded-2xl border border-[#E5E5E5] bg-white p-5">
              <div className="flex items-center justify-between mb-6">
                <Skeleton height={18} width={150} />
                <Skeleton height={32} width={120} className="rounded-lg" />
              </div>
              <Skeleton height={250} className="rounded-lg" />
            </div>
          )}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <Skeleton height={18} width={120} className="mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton variant="circular" width={36} height={36} />
                  <div className="flex-1">
                    <Skeleton height={14} width="70%" className="mb-1" />
                    <Skeleton height={12} width="50%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {showTable && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white">
            <div className="p-5 border-b border-[#E5E5E5]">
              <Skeleton height={18} width={180} />
            </div>
            <div className="p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center py-3",
                    index !== 4 && "border-b border-[#F0F0F0]"
                  )}
                >
                  <Skeleton height={14} width={180} className="flex-shrink-0" />
                  <Skeleton height={14} width={120} className="ml-8" />
                  <Skeleton height={14} width={100} className="ml-8" />
                  <div className="ml-auto">
                    <Skeleton height={24} width={80} className="rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
SkeletonDashboard.displayName = "SkeletonDashboard";

// Detail Page Skeleton (like flight details, user profile, etc.)
export interface SkeletonDetailPageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sidebar";
}

const SkeletonDetailPage = React.forwardRef<HTMLDivElement, SkeletonDetailPageProps>(
  ({ className, variant = "default", ...props }, ref) => {
    if (variant === "sidebar") {
      return (
        <div ref={ref} className={cn("grid grid-cols-3 gap-6", className)} {...props}>
          {/* Main content */}
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
              <Skeleton height={24} width={200} className="mb-6" />
              <div className="grid grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton height={12} width={80} className="mb-2" />
                    <Skeleton height={16} width="70%" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
              <Skeleton height={20} width={150} className="mb-4" />
              <SkeletonText lines={4} />
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
              <Skeleton height={18} width={120} className="mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton height={14} width={80} />
                    <Skeleton height={14} width={60} />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
              <Skeleton height={18} width={100} className="mb-4" />
              <SkeletonButton width="100%" size="lg" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
          <Skeleton height={24} width={250} className="mb-2" />
          <Skeleton height={14} width={180} className="mb-6" />
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <Skeleton height={12} width={80} className="mb-2" />
                <Skeleton height={16} width="80%" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
          <Skeleton height={20} width={180} className="mb-4" />
          <SkeletonText lines={5} />
        </div>
      </div>
    );
  }
);
SkeletonDetailPage.displayName = "SkeletonDetailPage";

export {
  SkeletonPageHeader,
  SkeletonSectionHeader,
  SkeletonArticle,
  SkeletonForm,
  SkeletonDashboard,
  SkeletonDetailPage,
};
