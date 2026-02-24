"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html lang="es">
      <body>
        <SystemScreen
          code="500"
          title="Error del sistema"
          subtitle="La aplicacion tuvo un problema. Puedes reintentar o volver al inicio."
          actions={
            <>
              <Button variant="primary" size="md" type="button" onClick={() => reset()}>
                Reintentar
              </Button>
              <Button variant="ghost" size="md" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
            </>
          }
        />
      </body>
    </html>
  );
}
