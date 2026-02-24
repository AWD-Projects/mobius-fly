"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <SystemScreen
      code="500"
      title="Algo salio mal"
      subtitle="Estamos trabajando en ello. Intenta de nuevo en un momento o vuelve al inicio."
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
  );
}
