import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  sectionPadding: string;
}

const passengerBenefits: Benefit[] = [
  {
    title: "1. Vuela en jet privado a menor costo",
    description: "Accede a vuelos empty leg y disfruta una experiencia privada real.",
  },
  {
    title: "2. Reserva rápida, sin intermediarios",
    description: "Encuentra, reserva y paga tu vuelo en minutos desde una sola plataforma.",
  },
  {
    title: "3. Seguridad validada en cada vuelo",
    description: "Aeronaves y tripulación revisadas antes de publicarse.",
  },
  {
    title: "4. Flexibilidad y control total",
    description: "Elige tus rutas, horarios y aeronaves. Sin membresías ni pagos escondidos.",
  },
];

const ownerBenefits: Benefit[] = [
  {
    title: "1. Monetiza tus empty legs",
    description: "Convierte vuelos vacíos en ingresos recurrentes con mínimo esfuerzo.",
  },
  {
    title: "2. Publicación en minutos",
    description: "Sube tu vuelo, define el precio y deja que la plataforma haga el resto.",
  },
  {
    title: "3. Pasajeros pre-verificados",
    description: "Todos los pasajeros pasan por un proceso de identificación seguro.",
  },
  {
    title: "4. Pagos garantizados y rápidos",
    description: "Recibe tus ingresos de forma automática cada semana.",
  },
];

export const BenefitsSection = React.memo<BenefitsSectionProps>(({
  sectionPadding,
}) => {
  return (
    <section
      id="beneficios"
      className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full flex flex-col items-center gap-16">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <SectionHeader
            title="Pensado para pasajeros y propietarios"
            subtitle="Más valor, menos fricción"
            align="center"
            size="page"
          />
        </m.div>

        {/* Two Column Benefits */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl">
          {/* Left Column - Para quienes vuelan */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-8"
          >
            <h3
              className="text-lg sm:text-xl font-medium"
              style={{
                color: "#39424E",
                letterSpacing: "-0.01em",
              }}
            >
              Para quienes vuelan
            </h3>

            <div className="flex flex-col gap-4 sm:gap-6">
              {passengerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex flex-col gap-2">
                  <p
                    className="font-medium text-sm sm:text-base"
                    style={{
                      color: "#39424E",
                    }}
                  >
                    {benefit.title}
                  </p>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{
                      color: "#39424E",
                      opacity: 0.7,
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </m.div>

          {/* Right Column - Para propietarios */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-8"
          >
            <h3
              className="text-lg sm:text-xl font-medium"
              style={{
                color: "#39424E",
                letterSpacing: "-0.01em",
              }}
            >
              Para propietarios
            </h3>

            <div className="flex flex-col gap-4 sm:gap-6">
              {ownerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex flex-col gap-2">
                  <p
                    className="font-medium text-sm sm:text-base"
                    style={{
                      color: "#39424E",
                    }}
                  >
                    {benefit.title}
                  </p>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{
                      color: "#39424E",
                      opacity: 0.7,
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
});

BenefitsSection.displayName = "BenefitsSection";
