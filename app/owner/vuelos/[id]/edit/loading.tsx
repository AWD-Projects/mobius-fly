import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";

export default function EditFlightLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            <div className="px-12 py-8">
                <Skeleton height={12} width={100} className="mb-5" />
                <Skeleton height={26} width={180} className="mb-1" />
                <Skeleton height={14} width={280} />
            </div>

            <div className="px-12 pb-8 flex flex-col gap-7">
                {/* Trip type toggle */}
                <div className="flex gap-0 rounded-xl overflow-hidden border border-border w-fit">
                    <Skeleton height={44} width={140} className="rounded-none" />
                    <Skeleton height={44} width={140} className="rounded-none" />
                </div>

                {/* Route + dates */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
                    <Skeleton height={14} width={180} />
                    <div className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={60} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={60} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={80} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={80} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                    </div>
                </div>

                {/* Aircraft + pricing */}
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
                    <Skeleton height={14} width={160} />
                    <div className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={70} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton height={12} width={90} />
                            <Skeleton height={40} width="100%" className="rounded-sm" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <SkeletonButton size="lg" width={120} />
                    <SkeletonButton size="lg" width={160} />
                </div>
            </div>
        </div>
    );
}
