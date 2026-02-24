"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="401"
      title="Se requiere inicio de sesion"
      subtitle="Inicia sesion para continuar y acceder a esta area."
      actions={
        <>
          <Button variant="primary" size="md" onClick={() => router.push("/login")}>
            Iniciar sesion
          </Button>
          <Button variant="ghost" size="md" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
        </>
      }
    />
  );
}
