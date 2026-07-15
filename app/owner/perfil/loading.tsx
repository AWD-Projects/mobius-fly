import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";

export default function PerfilLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-12 py-8">
                <div className="flex flex-col gap-2">
                    <Skeleton height={28} width={80} />
                    <Skeleton height={14} width={240} />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <Skeleton height={12} width={100} />
                    <Skeleton height={28} width={120} className="rounded-md" />
                </div>
            </div>

            {/* Content */}
            <div className="px-12 pb-8 flex flex-col gap-6">
                {/* Fleet name card */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                    <Skeleton height={14} width={160} />
                    <Skeleton height={12} width={220} />
                    <Skeleton height={40} width="100%" className="rounded-sm" />
                    <SkeletonButton size="md" width={160} />
                </div>

                {/* Personal data card */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-0">
                    <Skeleton height={14} width={140} className="mb-4" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-[#F0F0F0] last:border-0">
                            <Skeleton height={12} width={120} />
                            <Skeleton height={13} width={160} />
                        </div>
                    ))}
                </div>

                {/* Document card */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Skeleton height={14} width={180} />
                        <Skeleton height={24} width={100} className="rounded-full" />
                    </div>
                    <div className="border border-border rounded-xl p-4 flex flex-col gap-3">
                        <Skeleton height={13} width={140} />
                        <Skeleton height={40} width="100%" className="rounded-sm" />
                        <SkeletonButton size="md" width={140} />
                    </div>
                </div>
            </div>
        </div>
    );
}
