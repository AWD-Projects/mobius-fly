import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mobius Fly - Vuelos Empty Leg | Experiencia privada en minutos",
  description: "Compra o publica vuelos empty leg en minutos. Experiencia de aviación privada accesible y exclusiva.",
  keywords: "vuelos empty leg, aviación privada, jets privados, vuelos charter",
  icons: {
    icon: "/logo/main-logo.svg",
  },
  openGraph: {
    title: "Mobius Fly - Vuelos Empty Leg",
    description: "Compra o publica vuelos empty leg en minutos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
