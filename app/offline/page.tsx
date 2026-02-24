"use client";

import { useRouter } from "next/navigation";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

export default function OfflinePage() {
  const router = useRouter();

  return (
    <SystemScreen
      code="Sin conexion"
      title="Estas sin conexion"
      subtitle="Revisa tu conexion y vuelve a intentar cuando estes en linea."
      actions={
        <Button variant="ghost" size="md" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      }
    />
  );
}
