"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function ServiceUnavailablePage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="503"
      title="Servicio no disponible"
      subtitle="Estamos con alta demanda. Intenta de nuevo mas tarde."
      actions={
        <Button variant="ghost" size="md" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      }
    />
  );
}
