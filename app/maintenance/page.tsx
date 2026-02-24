"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function MaintenancePage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="Mantenimiento"
      title="Volvemos pronto"
      subtitle="Estamos en mantenimiento programado para mantener todo funcionando."
      actions={
        <Button variant="primary" size="md" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      }
    />
  );
}
