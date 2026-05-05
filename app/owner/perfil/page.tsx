import { SectionHeader } from "@/components/molecules/SectionHeader";

export default function OwnerPerfilPage() {
    return (
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl">
            <SectionHeader
                size="page"
                title="Mi Perfil"
                subtitle="Gestiona tu información personal y configuración de cuenta."
            />
        </div>
    );
}
