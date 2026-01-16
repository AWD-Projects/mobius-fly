import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function RateLimitPage() {
  return (
    <SystemScreen
      code="429"
      title="Demasiadas solicitudes"
      subtitle="Estas haciendo demasiadas solicitudes. Espera un momento y vuelve a intentar."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
          Volver al inicio
        </Link>
      }
    />
  );
}
