import { Suspense } from "react";
import { PassengersContent } from "./_components/PassengersContent";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PassengersPage({ params }: Props) {
    const { id } = await params;
    return (
        <Suspense>
            <PassengersContent flightId={id} />
        </Suspense>
    );
}
