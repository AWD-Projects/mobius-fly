import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";
import { SkeletonTable } from "@/components/molecules/SkeletonTable";

export default function AircraftLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Skeleton height={28} width={120} className="mb-2" />
                <Skeleton height={14} width={160} />
            </div>

            {/* Filter bar */}
            <div className="px-12 py-4 flex items-center gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={40} width={160} className="rounded-sm" />
                ))}
                <Skeleton height={40} width={80} className="rounded-sm ml-auto" />
            </div>

            {/* Content */}
            <div className="px-12 py-0 flex flex-col gap-[18px]">
                <div className="flex items-center justify-between">
                    <Skeleton height={16} width={100} />
                    <SkeletonButton size="md" width={140} />
                </div>
                <SkeletonTable rows={5} columns={7} />
            </div>
        </div>
    );
}
