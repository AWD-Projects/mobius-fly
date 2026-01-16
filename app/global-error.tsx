"use client";

import * as React from "react";
import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button, buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
              >
                Volver al inicio
              </Link>
            </>
          }
        />
      </body>
    </html>
  );
}
