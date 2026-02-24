import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Accordion } from "@/components/molecules/Accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  sectionPadding: string;
  faqCompradores: FAQItem[];
  faqPropietarios: FAQItem[];
}

export const FAQSection = React.memo<FAQSectionProps>(({
  sectionPadding,
  faqCompradores,
  faqPropietarios,
}) => {
  return (
    <section
      id="preguntas-frecuentes"
      className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full flex flex-col items-center gap-12">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <SectionHeader
            title="Preguntas frecuentes"
            subtitle="Nuestras preguntas frecuentes están organizadas por tipo de usuario. Encuentra las respuestas específicas para tu rol en Mobius Fly."
            align="center"
            size="page"
          />
        </m.div>

        {/* Two Column Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl">
          {/* Left Column - Para compradores */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h3
                className="text-lg sm:text-xl font-medium"
                style={{
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                }}
              >
                Para compradores
              </h3>
              <p
                className="text-xs sm:text-sm font-normal leading-relaxed"
                style={{
                  color: "#39424E",
                  opacity: 0.7,
                }}
              >
                Respuestas a preguntas sobre reservas, vuelos y documentación necesaria para pasajeros de Mobius Fly.
              </p>
            </div>

            <Accordion items={faqCompradores} />
          </m.div>

          {/* Right Column - Para propietarios */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h3
                className="text-lg sm:text-xl font-medium"
                style={{
                  color: "#39424E",
                  letterSpacing: "-0.01em",
                }}
              >
                Para propietarios
              </h3>
              <p
                className="text-xs sm:text-sm font-normal leading-relaxed"
                style={{
                  color: "#39424E",
                  opacity: 0.7,
                }}
              >
                Todo lo que necesitas saber para gestionar tus vuelos y maximizar tus ingresos en Mobius Fly.
              </p>
            </div>

            <Accordion items={faqPropietarios} />
          </m.div>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";
