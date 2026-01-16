import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Debug/Prueba de color",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorTest: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div className="!bg-primary p-4 rounded">
        <p className="!text-white">Fondo primario con texto blanco</p>
        <p className="text-xs opacity-70">Debe ser dorado #C4A77D</p>
      </div>

      <div className="!bg-secondary p-4 rounded">
        <p className="!text-white">Fondo secundario con texto blanco</p>
        <p className="text-xs opacity-70">Debe ser azul gris #39424E</p>
      </div>

      <div className="border-2 !border-primary p-4 rounded">
        <p className="!text-primary">Borde y texto primario</p>
        <p className="text-xs opacity-70">Debe ser dorado #C4A77D</p>
      </div>

      <div style={{ backgroundColor: "var(--color-primary)", padding: "16px", borderRadius: "8px" }}>
        <p style={{ color: "var(--color-white)" }}>Prueba directa de variable CSS</p>
        <p style={{ fontSize: "12px", opacity: 0.7, color: "var(--color-white)" }}>
          Usando var(--color-primary)
        </p>
      </div>

      <div style={{ backgroundColor: "#C4A77D", padding: "16px", borderRadius: "8px" }}>
        <p style={{ color: "#FFFFFF" }}>Prueba directa de hex</p>
        <p style={{ fontSize: "12px", opacity: 0.7, color: "#FFFFFF" }}>
          Usando #C4A77D directamente
        </p>
      </div>
    </div>
  ),
};
