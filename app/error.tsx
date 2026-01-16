"use client";

import * as React from "react";
import Link from "next/link";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button, buttonVariants } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            Volver al inicio
          </Link>
        </>
      }
    />
  );
}
