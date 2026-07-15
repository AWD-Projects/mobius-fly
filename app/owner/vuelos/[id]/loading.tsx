import { Skeleton, SkeletonButton, SkeletonBadge } from "@/components/atoms/Skeleton";
import { SkeletonTable } from "@/components/molecules/SkeletonTable";

export default function FlightDetailLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 pt-6 pb-4">
                <Skeleton height={12} width={100} className="mb-5" />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <Skeleton height={28} width={260} />
                        <div className="flex items-center gap-3">
                            <SkeletonBadge width={90} />
                            <SkeletonBadge width={70} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <SkeletonButton size="md" width={100} />
                        <SkeletonButton size="md" width={130} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-12 py-10 flex gap-10">
                {/* Main */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-5">
                        <Skeleton height={14} width={160} />
                        <div className="grid grid-cols-2 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <Skeleton height={11} width={80} />
                                    <Skeleton height={14} width="75%" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={14} width={140} />
                        <SkeletonTable rows={3} columns={4} showActions={false} />
                    </div>
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={14} width={160} />
                        <SkeletonTable rows={4} columns={5} showActions={false} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={14} width={120} />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton height={12} width={90} />
                                <Skeleton height={12} width={70} />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
                        <Skeleton height={14} width={100} />
                        <SkeletonButton size="md" width="100%" />
                        <SkeletonButton size="md" width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
}
