import { renderOg } from "@/lib/seo/og";

export const alt = "Mobius Fly — Vuelos empty leg en jet privado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Aviación privada · México",
    title: "Empty legs. Experiencia privada.",
    subtitle: "Reserva asientos en jets privados verificados a una fracción del costo.",
  });
}
