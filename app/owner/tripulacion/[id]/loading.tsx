import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";
import { SkeletonTable } from "@/components/molecules/SkeletonTable";

export default function CrewDetailLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton variant="circular" width={72} height={72} />
                        <div className="flex flex-col gap-2">
                            <Skeleton height={26} width={200} />
                            <div className="flex items-center gap-3">
                                <Skeleton height={13} width={130} />
                                <Skeleton height={22} width={70} className="rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <SkeletonButton size="md" width={110} />
                        <SkeletonButton size="md" width={130} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-12 pb-10 flex gap-8">
                {/* Main */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={13} width={180} />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                                <Skeleton height={12} width={110} />
                                <Skeleton height={12} width={160} />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                        <Skeleton height={13} width={140} />
                        <SkeletonTable rows={3} columns={4} showActions={false} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
                        <Skeleton height={13} width={80} />
                        <SkeletonButton size="md" width="100%" />
                        <SkeletonButton size="md" width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
}
