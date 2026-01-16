import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function ServiceUnavailablePage() {
  return (
    <SystemScreen
      code="503"
      title="Servicio no disponible"
      subtitle="Estamos con alta demanda. Intenta de nuevo mas tarde."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
          Volver al inicio
        </Link>
      }
    />
  );
}
