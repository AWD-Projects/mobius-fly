import { SectionHeader } from "@/components/molecules/SectionHeader";

export default function OwnerManifiestosPage() {
    return (
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl">
            <SectionHeader
                size="page"
                title="Manifiestos"
                subtitle="Consulta los manifiestos de pasajeros por vuelo."
            />
        </div>
    );
}
