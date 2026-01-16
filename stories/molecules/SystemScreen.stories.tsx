import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { SystemScreen } from "@/components/molecules/SystemScreen";
import { Button } from "@/components/atoms/Button";

const meta = {
  title: "Moleculas/SystemScreen",
  component: SystemScreen,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SystemScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    code: "404",
    title: "Pagina no encontrada",
    subtitle: "La pagina que buscas no existe o fue movida.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const ServerError: Story = {
  args: {
    code: "500",
    title: "Algo salio mal",
    subtitle: "Estamos trabajando en ello. Intenta de nuevo en un momento.",
    actions: (
      <>
        <Button variant="ghost">Reintentar</Button>
        <Button variant="ghost">Volver al inicio</Button>
      </>
    ),
  },
};

export const Maintenance: Story = {
  args: {
    code: "Mantenimiento",
    title: "Volvemos pronto",
    subtitle: "Estamos en mantenimiento programado para mantener todo funcionando.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const Offline: Story = {
  args: {
    code: "Sin conexion",
    title: "Estas sin conexion",
    subtitle: "Revisa tu conexion y vuelve a intentar cuando estes en linea.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const Unauthorized: Story = {
  args: {
    code: "401",
    title: "Se requiere inicio de sesion",
    subtitle: "Inicia sesion para continuar y acceder a esta area.",
    actions: (
      <>
        <Button variant="ghost">Iniciar sesion</Button>
        <Button variant="ghost">Volver al inicio</Button>
      </>
    ),
  },
};

export const Forbidden: Story = {
  args: {
    code: "403",
    title: "Acceso denegado",
    subtitle: "No tienes permisos para ver este contenido.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const RateLimited: Story = {
  args: {
    code: "429",
    title: "Demasiadas solicitudes",
    subtitle: "Estas haciendo demasiadas solicitudes. Espera un momento y vuelve a intentar.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const ServiceUnavailable: Story = {
  args: {
    code: "503",
    title: "Servicio no disponible",
    subtitle: "Estamos con alta demanda. Intenta de nuevo mas tarde.",
    actions: <Button variant="ghost">Volver al inicio</Button>,
  },
};

export const EmptyState: Story = {
  args: {
    code: "Vacio",
    title: "Aun no hay nada",
    subtitle: "Cuando agregues elementos, apareceran aqui con todo el detalle.",
    actions: <Button variant="ghost">Explorar opciones</Button>,
  },
};
