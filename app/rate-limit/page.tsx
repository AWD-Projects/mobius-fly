"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function RateLimitPage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="429"
      title="Demasiadas solicitudes"
      subtitle="Estas haciendo demasiadas solicitudes. Espera un momento y vuelve a intentar."
      actions={
        <Button variant="ghost" size="md" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      }
    />
  );
}
