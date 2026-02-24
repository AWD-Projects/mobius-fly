"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="403"
      title="Acceso denegado"
      subtitle="No tienes permisos para ver este contenido."
      actions={
        <Button variant="ghost" size="md" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      }
    />
  );
}
