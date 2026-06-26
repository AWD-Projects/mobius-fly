import { Skeleton, SkeletonButton, SkeletonBadge } from "@/components/atoms/Skeleton";

export default function CrewLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Skeleton height={28} width={130} className="mb-2" />
                <Skeleton height={14} width={180} />
            </div>

            {/* Filter bar */}
            <div className="px-12 py-4 flex items-center gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} height={40} width={160} className="rounded-sm" />
                ))}
                <Skeleton height={40} width={80} className="rounded-sm ml-auto" />
            </div>

            {/* Content */}
            <div className="px-12 py-0 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Skeleton height={16} width={180} />
                    <SkeletonButton size="md" width={160} />
                </div>

                {/* 4-column card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                            {/* Avatar + name */}
                            <div className="flex items-center gap-4">
                                <Skeleton variant="circular" width={56} height={56} />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <Skeleton height={14} width="75%" />
                                    <Skeleton height={12} width="55%" />
                                </div>
                            </div>
                            <div className="w-full h-px bg-border" />
                            {/* Fields */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton height={12} width={40} />
                                    <Skeleton height={12} width={60} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Skeleton height={12} width={60} />
                                    <Skeleton height={12} width={80} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Skeleton height={12} width={50} />
                                    <SkeletonBadge width={80} />
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="circular" width={32} height={32} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
