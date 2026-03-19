import * as React from "react";
import { m } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface FooterSectionProps {
  sectionPadding: string;
  onScrollToSection: (sectionId: string) => void;
}

export const FooterSection = React.memo<FooterSectionProps>(({
  sectionPadding,
  onScrollToSection,
}) => {
  return (
    <footer
      id="footer"
      className="snap-start relative min-h-screen flex items-center justify-center py-16"
      style={{ backgroundColor: "#39424E" }}
    >
      <div className={`w-full flex flex-col gap-12 sm:gap-16 md:gap-20 ${sectionPadding}`}>
        {/* Top Section - Logo + CTA */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="flex flex-col items-center gap-6 sm:gap-8 text-center"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo/mobiuswhite-logo.svg"
              alt="Mobius Fly"
              width={60}
              height={60}
              className="sm:w-20 sm:h-20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 px-4">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug"
              style={{
                color: "#F6F6F4",
                letterSpacing: "-0.02em",
              }}
            >
              La plataforma que une pasajeros y operadores
            </h2>
            <p
              className="text-sm sm:text-base font-normal"
              style={{
                color: "#F6F6F4",
                opacity: 0.7,
              }}
            >
              Más valor. Menos intermediarios. Total control
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto px-4">
            <Button
              variant="link"
              icon={<ArrowRight size={16} strokeWidth={1} />}
              iconPosition="end"
              className="!text-background"
            >
              Explorar vuelos
            </Button>

            <span style={{ color: "#F6F6F4", opacity: 0.2 }}>|</span>

            <Button
              variant="link"
              icon={<ArrowRight size={16} strokeWidth={1} />}
              iconPosition="end"
              className="!text-background"
            >
              Publicar un vuelo
            </Button>
          </div>
        </m.div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#F6F6F4", opacity: 0.1 }} />

        {/* Middle Section - Links with Background SVG */}
        <div className="relative">
          {/* Background Mobius Fly Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-5xl" style={{ opacity: 0.15 }}>
              <Image
                src="/assets/mobius-footer.svg"
                alt="Mobius Fly"
                width={1200}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Links Grid */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.8 }}
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-4xl mx-auto py-6 sm:py-8 text-center"
          >
            {/* Plataforma */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center">
              <h3
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.9,
                }}
              >
                Plataforma
              </h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
                {[
                  { label: "Vuelos", href: "/flights" },
                  { label: "Cómo funciona", href: "/how-it-works" },
                  { label: "Beneficios", href: "/benefits" },
                  { label: "Contacto", href: "/contact" },
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() => onScrollToSection(link.href)}
                    className="text-center transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
                    style={{
                      color: "#F6F6F4",
                      opacity: 0.7,
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Recursos */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center">
              <h3
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.9,
                }}
              >
                Recursos
              </h3>
              <nav className="flex flex-col gap-3">
                {[
                  { label: "Preguntas frecuentes", href: "/faq" },
                  { label: "Comparación", href: "/comparison" },
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() => onScrollToSection(link.href)}
                    className="text-center transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
                    style={{
                      color: "#F6F6F4",
                      opacity: 0.7,
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center">
              <h3
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.9,
                }}
              >
                Legal
              </h3>
              <nav className="flex flex-col gap-2 sm:gap-3 items-center">
                <a
                  href="/privacidad"
                  className="text-center transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
                  style={{
                    color: "#F6F6F4",
                    opacity: 0.7,
                  }}
                >
                  Privacidad
                </a>
                <a
                  href="/terminos"
                  className="text-center transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
                  style={{
                    color: "#F6F6F4",
                    opacity: 0.7,
                  }}
                >
                  Términos
                </a>
              </nav>
            </div>
          </m.div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#F6F6F4", opacity: 0.1 }} />

        {/* Bottom Section - Copyright */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center"
        >
          <p
            className="text-xs sm:text-sm font-normal"
            style={{
              color: "#F6F6F4",
              opacity: 0.6,
            }}
          >
            © 2025 Mobius Fly. Todos los derechos reservados.
          </p>
          <a
            href="https://www.amoxtli.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
            style={{
              color: "#F6F6F4",
              opacity: 0.6,
            }}
          >
            Powered by Amoxtli®
          </a>
        </m.div>
      </div>
    </footer>
  );
});

FooterSection.displayName = "FooterSection";
