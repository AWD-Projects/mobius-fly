import { Suspense } from "react";
import { FlightsContent } from "./_components/FlightsContent";

export default function FlightsPage() {
    return (
        <Suspense>
            <FlightsContent />
        </Suspense>
    );
}
