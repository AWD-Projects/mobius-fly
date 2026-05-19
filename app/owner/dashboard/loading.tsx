import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";
import { SkeletonTable } from "@/components/molecules/SkeletonTable";

export default function DashboardLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton height={32} width={220} />
                    <Skeleton height={14} width={180} />
                </div>
                <div className="flex items-center gap-3">
                    <SkeletonButton size="md" width={130} />
                    <SkeletonButton size="md" width={140} />
                    <SkeletonButton size="md" width={140} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="px-12 pb-8 flex items-stretch gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton height={36} width={80} />
                        <Skeleton height={12} width={100} />
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="px-12 py-8 flex gap-8">
                {/* Upcoming flights */}
                <div className="flex-1 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <Skeleton height={18} width={140} />
                        <Skeleton height={14} width={70} />
                    </div>
                    <SkeletonTable rows={5} columns={6} showActions={false} />
                </div>

                {/* Attention panel */}
                <div className="w-[340px] flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={16} width={140} />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                                <Skeleton variant="circular" width={32} height={32} />
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <Skeleton height={13} width="70%" />
                                    <Skeleton height={11} width="50%" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
