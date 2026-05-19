import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";
import { SkeletonTable } from "@/components/molecules/SkeletonTable";

export default function FlightsLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="px-12 py-8">
                <Skeleton height={28} width={140} className="mb-2" />
                <Skeleton height={14} width={200} />
            </div>

            {/* Filter bar */}
            <div className="px-12 py-4 flex items-center gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={40} width={140} className="rounded-sm" />
                ))}
                <Skeleton height={40} width={80} className="rounded-sm ml-auto" />
            </div>

            {/* Content */}
            <div className="px-12 py-0 flex flex-col gap-[18px]">
                <div className="flex items-center justify-between">
                    <Skeleton height={16} width={130} />
                    <SkeletonButton size="md" width={130} />
                </div>
                <SkeletonTable rows={5} columns={6} />
            </div>
        </div>
    );
}
