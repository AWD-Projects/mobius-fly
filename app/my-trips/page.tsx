import { MOCK_UPCOMING_RESERVATIONS, MOCK_PAST_RESERVATIONS } from "@/lib/mock/trips.mock";
import { MyTripsGuard } from "./_components/MyTripsGuard";
import { MyTripsContent } from "./_components/MyTripsContent";

export default function MyTripsPage() {
    return (
        <MyTripsGuard>
            <MyTripsContent
                upcoming={MOCK_UPCOMING_RESERVATIONS}
                past={MOCK_PAST_RESERVATIONS}
            />
        </MyTripsGuard>
    );
}
