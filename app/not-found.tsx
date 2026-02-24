"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <SystemScreen
      code="404"
      title="Pagina no encontrada"
      subtitle="La pagina que buscas no existe o fue movida."
      actions={
        <>
          <Button variant="primary" size="md" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
          <Button variant="ghost" size="md" onClick={() => router.push("/")}>
            Explorar el sitio
          </Button>
        </>
      }
    />
  );
}
