import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  return (
    <SystemScreen
      code="401"
      title="Se requiere inicio de sesion"
      subtitle="Inicia sesion para continuar y acceder a esta area."
      actions={
        <>
          <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
            Iniciar sesion
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
            Volver al inicio
          </Link>
        </>
      }
    />
  );
}
