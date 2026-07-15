export default function FlightDetailLoading() {
    const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

    return (
        <div className="min-h-screen bg-background animate-pulse">
            {/* Navbar */}
            <div className="w-full h-14 bg-background border-b border-border" />

            {/* Header */}
            <div className={`w-full ${sectionPadding} py-8`}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-border" />
                    <div className="flex flex-col gap-2">
                        <div className="h-7 w-56 rounded bg-border" />
                        <div className="h-4 w-40 rounded bg-border" />
                    </div>
                </div>
            </div>

            {/* Main — 2 columns */}
            <div className={`w-full ${sectionPadding} pb-12 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start`}>
                {/* Left column */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                    {/* Route card */}
                    <div className="bg-surface rounded-md border border-border p-5 sm:p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-10 w-20 rounded bg-border" />
                            <div className="h-3 w-12 rounded bg-border" />
                            <div className="h-10 w-20 rounded bg-border" />
                        </div>
                        <div className="flex gap-8">
                            <div className="h-5 w-36 rounded bg-border" />
                            <div className="h-5 w-28 rounded bg-border" />
                            <div className="h-5 w-24 rounded bg-border" />
                        </div>
                    </div>

                    {/* Aircraft + Crew row */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 bg-surface rounded-md border border-border overflow-hidden">
                            <div className="h-40 bg-border" />
                            <div className="p-5 flex flex-col gap-3">
                                <div className="h-5 w-40 rounded bg-border" />
                                <div className="h-4 w-28 rounded bg-border" />
                                <div className="h-4 w-32 rounded bg-border" />
                            </div>
                        </div>
                        <div className="flex-1 bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
                            <div className="h-5 w-24 rounded bg-border" />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                                    <div className="w-9 h-9 rounded-full bg-border" />
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-4 w-32 rounded bg-border" />
                                        <div className="h-3 w-24 rounded bg-border" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — sidebar */}
                <div className="w-full lg:w-[360px] lg:flex-shrink-0">
                    <div className="bg-surface rounded-md border border-border p-5 flex flex-col gap-4">
                        <div className="h-5 w-36 rounded bg-border" />
                        <div className="h-16 w-full rounded bg-border" />
                        <div className="h-16 w-full rounded bg-border" />
                        <div className="h-px w-full bg-border" />
                        <div className="h-4 w-28 rounded bg-border" />
                        <div className="h-4 w-28 rounded bg-border" />
                        <div className="h-px w-full bg-border" />
                        <div className="h-8 w-32 rounded bg-border" />
                        <div className="h-12 w-full rounded bg-border" />
                    </div>
                </div>
            </div>
        </div>
    );
}
