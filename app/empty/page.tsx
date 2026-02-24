"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function EmptyStatePage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="Vacio"
      title="Aun no hay nada"
      subtitle="Cuando agregues elementos, apareceran aqui con todo el detalle."
      actions={
        <Button variant="primary" size="md" onClick={() => router.push("/")}>
          Explorar opciones
        </Button>
      }
    />
  );
}
