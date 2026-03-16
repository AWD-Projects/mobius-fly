import { SectionHeader } from "@/components/molecules/SectionHeader";

export default function OwnerDashboardPage() {
    return (
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl">
            <SectionHeader
                size="page"
                title="Dashboard"
                subtitle="Resumen general de tu flota y actividad reciente."
            />
        </div>
    );
}
