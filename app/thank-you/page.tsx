import { Suspense } from "react";
import { ThankYouContent } from "./_components/ThankYouContent";

export default function ThankYouPage() {
    return (
        <Suspense>
            <ThankYouContent />
        </Suspense>
    );
}
