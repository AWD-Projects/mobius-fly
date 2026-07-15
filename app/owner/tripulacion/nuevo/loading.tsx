import { Skeleton, SkeletonButton } from "@/components/atoms/Skeleton";

export default function AddCrewLoading() {
    return (
        <div className="w-full bg-[#f6f6f4] min-h-screen">
            <div className="px-12 py-8">
                <Skeleton height={14} width={120} className="mb-5" />
                <Skeleton height={32} width={240} className="mb-1" />
                <Skeleton height={14} width={280} />
            </div>

            <div className="px-12 pb-8 flex flex-col gap-7">
                <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
                    <Skeleton height={11} width={180} />
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton height={12} width={100} />
                                <Skeleton height={40} className="rounded-sm" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-8">
                    <SkeletonButton size="md" width={240} />
                    <SkeletonButton size="md" width={240} />
                </div>
            </div>
        </div>
    );
}
