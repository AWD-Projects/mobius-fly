import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  return (
    <SystemScreen
      code="Sin conexion"
      title="Estas sin conexion"
      subtitle="Revisa tu conexion y vuelve a intentar cuando estes en linea."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
          Volver al inicio
        </Link>
      }
    />
  );
}
