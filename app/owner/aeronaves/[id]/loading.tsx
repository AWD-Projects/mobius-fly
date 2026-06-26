import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";

export default function AircraftDetailLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8 border-b border-border bg-[#f6f6f4]">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <Skeleton height={30} width={220} />
                        <div className="flex items-center gap-4">
                            <Skeleton height={14} width={80} />
                            <Skeleton height={22} width={70} className="rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <SkeletonButton size="md" width={100} />
                        <SkeletonButton size="md" width={130} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-12 py-8 flex gap-8">
                {/* Main */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={14} width={160} />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                                <Skeleton height={12} width={100} />
                                <Skeleton height={13} width={140} />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={14} width={100} />
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} height={120} className="rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[280px] flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
                        <Skeleton height={14} width={120} />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton height={12} width={80} />
                                <Skeleton height={12} width={60} />
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
