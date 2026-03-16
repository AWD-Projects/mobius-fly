import { SectionHeader } from "@/components/molecules/SectionHeader";

export default function OwnerTripulacionPage() {
    return (
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl">
            <SectionHeader
                size="page"
                title="Tripulación"
                subtitle="Administra los pilotos y tripulantes de tu flota."
            />
        </div>
    );
}
