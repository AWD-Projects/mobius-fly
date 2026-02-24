import * as React from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/Navbar";

interface HeroSectionProps {
  sectionPadding: string;
  currentWordIndex: number;
  rotatingWords: string[];
  activeSection: string;
  onLogoClick: () => void;
  onNavLinkClick: (href: string) => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection = React.memo<HeroSectionProps>(({
  sectionPadding,
  currentWordIndex,
  rotatingWords,
  activeSection,
  onLogoClick,
  onNavLinkClick,
  onLoginClick,
  onSignUpClick,
  onExploreClick,
}) => {
  return (
    <section
      id="hero"
      className="lg:snap-start min-h-screen lg:h-screen relative flex flex-col"
      style={{ backgroundColor: "#090E11" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end pr-0 md:pr-12 lg:pr-16 xl:pr-24 2xl:pr-48">
        <div className="relative w-[400px] h-[400px] sm:w-[450px] sm:h-[450px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] xl:w-[600px] xl:h-[600px] opacity-40 sm:opacity-60 md:opacity-100">
          <Image
            src="/assets/window.jpg"
            alt="Airplane window view"
            fill
            sizes="(max-width: 640px) 400px, (max-width: 768px) 450px, (max-width: 1024px) 550px, 600px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar
          variant="hero"
          backgroundColor="transparent"
          logo={
            <Image
              src="/logo/mobiuswhite-logo.svg"
              alt="Mobius Fly"
              width={32}
              height={32}
            />
          }
          logoText="Mobius Fly"
          contentPadding={sectionPadding}
          navLinks={[
            { label: "Vuelos", href: "/flights" },
            { label: "Cómo funciona", href: "/how-it-works" },
            { label: "Comparación", href: "/comparison" },
            { label: "Beneficios", href: "/benefits" },
            { label: "Preguntas frecuentes", href: "/faq" },
            { label: "Contacto", href: "/contact" },
          ]}
          loginButtonText="Iniciar Sesión"
          signUpButtonText="Crear cuenta"
          activeHref={activeSection}
          onLogoClick={onLogoClick}
          onNavLinkClick={onNavLinkClick}
          onLoginClick={onLoginClick}
          onSignUpClick={onSignUpClick}
        />
      </div>

      {/* Hero Content */}
      <div className={`flex-1 relative z-[1] flex items-center ${sectionPadding}`}>
        <div className="w-full max-w-2xl">
          {/* Main Heading */}
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-3 sm:mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-bold leading-tight"
            style={{
              color: "#F6F6F4",
              letterSpacing: "-0.02em",
            }}
          >
            Empty legs.
            <br />
            Experiencia
            <br />
            <span className="inline-block relative" style={{ minWidth: "1em" }}>
              <AnimatePresence mode="wait">
                <m.span
                  key={currentWordIndex}
                  initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                  style={{
                    color: "#F6F6F4",
                  }}
                >
                  {rotatingWords[currentWordIndex]}
                </m.span>
              </AnimatePresence>
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mb-8 sm:mb-10 text-base sm:text-lg font-light leading-relaxed"
            style={{
              color: "#F6F6F4",
              opacity: 0.7,
            }}
          >
            Compra o publica vuelos empty leg en minutos.
          </m.p>

          {/* CTA Buttons */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start gap-3"
          >
            <button
              onClick={onExploreClick}
              className="transition-all hover:bg-white/10 rounded-md w-full sm:w-auto text-sm sm:text-base px-6 py-3 sm:px-7 sm:py-3.5 font-medium"
              style={{
                color: "#F6F6F4",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              Buscar vuelos
            </button>

            <div
              className="flex items-center gap-1 text-xs sm:text-sm font-light"
              style={{
                color: "#F6F6F4",
                opacity: 0.6,
              }}
            >
              ¿Eres propietario?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm font-medium"
                style={{
                  color: "#F6F6F4",
                  opacity: 1,
                }}
              >
                Publica tu vuelo
              </Button>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
