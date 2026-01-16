import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function EmptyStatePage() {
  return (
    <SystemScreen
      code="Vacio"
      title="Aun no hay nada"
      subtitle="Cuando agregues elementos, apareceran aqui con todo el detalle."
      actions={
        <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
          Explorar opciones
        </Link>
      }
    />
  );
}
