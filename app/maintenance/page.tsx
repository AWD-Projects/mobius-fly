import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  return (
    <SystemScreen
      code="Mantenimiento"
      title="Volvemos pronto"
      subtitle="Estamos en mantenimiento programado para mantener todo funcionando."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
          Volver al inicio
        </Link>
      }
    />
  );
}
