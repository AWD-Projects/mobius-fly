import { SectionHeader } from "@/components/molecules/SectionHeader";

export default function OwnerVuelosPage() {
    return (
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl">
            <SectionHeader
                size="page"
                title="Mis Vuelos"
                subtitle="Gestiona y publica los vuelos de tu flota."
            />
        </div>
    );
}
