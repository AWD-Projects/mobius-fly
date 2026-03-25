export default function FlightsLoading() {
    const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

    return (
        <div className="min-h-screen bg-background animate-pulse">
            {/* Navbar skeleton */}
            <div className="w-full h-14 bg-background border-b border-border" />

            {/* Header skeleton */}
            <div className={`w-full ${sectionPadding} py-8`}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-border" />
                    <div className="flex flex-col gap-2">
                        <div className="h-7 w-48 rounded bg-border" />
                        <div className="h-4 w-64 rounded bg-border" />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}>
                {/* Left — flight cards */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    {/* Results bar */}
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-32 rounded bg-border" />
                        <div className="h-4 w-20 rounded bg-border" />
                    </div>

                    {/* Flight cards */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-full rounded-md border border-border bg-surface p-5 sm:p-6 flex flex-col gap-4"
                        >
                            {/* Route row */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-12 rounded bg-border" />
                                    <div className="h-3 w-16 rounded bg-border" />
                                    <div className="h-6 w-12 rounded bg-border" />
                                </div>
                                <div className="h-6 w-20 rounded bg-border" />
                            </div>
                            {/* Details row */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex gap-3">
                                    <div className="h-4 w-28 rounded bg-border" />
                                    <div className="h-4 w-20 rounded bg-border" />
                                </div>
                                <div className="h-8 w-24 rounded bg-border" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right — summary sidebar */}
                <div className="w-full lg:w-[300px] lg:flex-shrink-0">
                    <div className="rounded-md border border-border bg-surface p-5 flex flex-col gap-4">
                        <div className="h-5 w-32 rounded bg-border" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 w-20 rounded bg-border" />
                                <div className="h-4 w-24 rounded bg-border" />
                            </div>
                        ))}
                        <div className="h-9 w-full rounded bg-border mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
