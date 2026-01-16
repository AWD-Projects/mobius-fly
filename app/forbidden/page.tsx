import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function ForbiddenPage() {
  return (
    <SystemScreen
      code="403"
      title="Acceso denegado"
      subtitle="No tienes permisos para ver este contenido."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
          Volver al inicio
        </Link>
      }
    />
  );
}
