import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, toast } from "@/components/atoms/Toast";
import { Button } from "@/components/atoms/Button";

// ============================================================================
// WRAPPER — each story needs its own Toaster in Storybook isolation
// ============================================================================

function ToastStoryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <ToastProvider position="top-right" />
      {children}
    </div>
  );
}

// ============================================================================
// META
// ============================================================================

const meta = {
  title: "Atomos/Toast",
  component: ToastProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastStoryWrapper>
        <Story />
      </ToastStoryWrapper>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Success: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() => toast.success("Cambios guardados", "Los datos se actualizaron correctamente.")}
    >
      Mostrar Toast de Éxito
    </Button>
  ),
};

export const DeError: Story = {
  name: "Error",
  render: () => (
    <Button
      variant="primary"
      onClick={() => toast.error("Algo salió mal", "Por favor intenta de nuevo más tarde.")}
    >
      Mostrar Toast de Error
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() => toast.warning("Almacenamiento casi lleno", "Considera eliminar archivos.")}
    >
      Mostrar Toast de Advertencia
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() => toast.info("Nueva actualización disponible")}
    >
      Mostrar Toast Informativo
    </Button>
  ),
};

export const Action: Story = {
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        toast.action("Archivo subido", {
          description: "¿Compartir con tu equipo?",
          buttonLabel: "Compartir",
          onClick: () => toast.success("Compartido exitosamente"),
        })
      }
    >
      Mostrar Toast con Acción
    </Button>
  ),
};

export const ConPromise: Story = {
  name: "Promise",
  render: () => (
    <Button
      variant="primary"
      onClick={() => {
        const fakeRequest = new window.Promise<string>((resolve) =>
          setTimeout(() => resolve("done"), 2000)
        );

        toast.promise(fakeRequest, {
          loading: { title: "Cargando...", description: "Procesando tu solicitud." },
          success: { title: "Listo", description: "Operación completada exitosamente." },
          error: { title: "Error", description: "No se pudo completar la operación." },
        });
      }}
    >
      Mostrar Toast con Promise
    </Button>
  ),
};

export const PromiseConError: Story = {
  name: "Promise con Error",
  render: () => (
    <Button
      variant="primary"
      onClick={() => {
        const failingRequest = new window.Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("Network error")), 2000)
        );

        toast.promise(failingRequest, {
          loading: { title: "Cargando...", description: "Conectando con el servidor." },
          success: { title: "Listo" },
          error: { title: "Error de conexión", description: "No se pudo conectar al servidor." },
        });
      }}
    >
      Mostrar Toast Promise (Falla)
    </Button>
  ),
};

export const Multiple: Story = {
  name: "Múltiples Toasts",
  render: () => (
    <div className="flex flex-col gap-3">
      <Button variant="primary" onClick={() => toast.success("Vuelo reservado")}>
        Éxito
      </Button>
      <Button variant="secondary" onClick={() => toast.error("Error al procesar pago")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Documento por vencer")}>
        Advertencia
      </Button>
      <Button variant="ghost" onClick={() => toast.info("3 vuelos disponibles")}>
        Info
      </Button>
    </div>
  ),
};
