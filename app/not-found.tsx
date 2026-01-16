import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <SystemScreen
      code="404"
      title="Pagina no encontrada"
      subtitle="La pagina que buscas no existe o fue movida."
      actions={
        <>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            Volver al inicio
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            Explorar el sitio
          </Link>
        </>
      }
    />
  );
}
