import { MOCK_RESERVATION_DETAIL } from "@/lib/mock/trips.mock";
import { TripDetailGuard } from "./_components/TripDetailGuard";
import { TripDetailContent } from "./_components/TripDetailContent";

export default function TripDetailPage() {
    return (
        <TripDetailGuard>
            <TripDetailContent reservation={MOCK_RESERVATION_DETAIL} />
        </TripDetailGuard>
    );
}
