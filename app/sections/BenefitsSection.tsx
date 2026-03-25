import * as React from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Pills } from "@/components/atoms/Pills";
import { Check } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitData {
  benefits: Benefit[];
  image: string;
}

interface BenefitsSectionProps {
  sectionPadding: string;
}

const benefitsData: Record<"pasajero" | "propietario", BenefitData> = {
  pasajero: {
    benefits: [
      {
        title: "Vuela en jet privado a menor costo",
        description: "Accede a vuelos empty leg y disfruta una experiencia privada real.",
      },
      {
        title: "Reserva rápida, sin intermediarios",
        description: "Encuentra, reserva y paga tu vuelo en minutos desde una sola plataforma.",
      },
      {
        title: "Seguridad validada en cada vuelo",
        description: "Aeronaves y tripulación revisadas antes de publicarse.",
      },
      {
        title: "Flexibilidad y control total",
        description: "Elige tus rutas, horarios y aeronaves. Sin membresías ni pagos escondidos.",
      },
    ],
    image: "/assets/buyer.jpg",
  },
  propietario: {
    benefits: [
      {
        title: "Monetiza tus empty legs",
        description: "Convierte vuelos vacíos en ingresos recurrentes con mínimo esfuerzo.",
      },
      {
        title: "Publicación en minutos",
        description: "Sube tu vuelo, define el precio y deja que la plataforma haga el resto.",
      },
      {
        title: "Pasajeros pre-verificados",
        description: "Todos los pasajeros pasan por un proceso de identificación seguro.",
      },
      {
        title: "Pagos garantizados y rápidos",
        description: "Recibe tus ingresos de forma automática cada semana.",
      },
    ],
    image: "/assets/owner.jpg",
  },
};

export const BenefitsSection = React.memo<BenefitsSectionProps>(({
  sectionPadding,
}) => {
  const [userType, setUserType] = React.useState<"pasajero" | "propietario">("pasajero");

  return (
    <section
      id="beneficios"
      className={`lg:snap-start min-h-screen relative flex flex-col py-12 lg:py-16 lg:justify-center ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full flex flex-col items-center gap-12">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="flex flex-col items-center gap-8"
        >
          <SectionHeader
            title="Pensado para pasajeros y propietarios"
            subtitle="Más valor, menos fricción"
            align="center"
            size="page"
          />

          {/* Pills */}
          <Pills
            pills={[
              { label: "Pasajero", value: "pasajero" },
              { label: "Propietario", value: "propietario" },
            ]}
            value={userType}
            onChange={(value) => setUserType(value as "pasajero" | "propietario")}
          />
        </m.div>

        {/* Content Grid - Bullets Left, Image Right */}
        <AnimatePresence mode="wait">
          <m.div
            key={userType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl items-center"
          >
            {/* Left Column - Benefits List */}
            <div className="flex flex-col gap-5">
              {benefitsData[userType].benefits.map((benefit, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  className="flex gap-3"
                >
                  {/* Check Icon - Minimal */}
                  <div className="flex-shrink-0 mt-0.5">
                    <Check size={18} strokeWidth={1} style={{ color: "#39424E", opacity: 0.4 }} />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col gap-1">
                    <h4
                      className="text-sm sm:text-base font-medium leading-tight"
                      style={{
                        color: "#39424E",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {benefit.title}
                    </h4>
                    <p
                      className="text-xs sm:text-sm leading-relaxed"
                      style={{
                        color: "#39424E",
                        opacity: 0.6,
                      }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </m.div>
              ))}
            </div>

            {/* Right Column - Image */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl w-full aspect-[4/3] lg:aspect-auto lg:h-[420px]"
            >
              <Image
                src={benefitsData[userType].image}
                alt={userType === "pasajero" ? "Passenger benefits" : "Owner benefits"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </m.div>
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

BenefitsSection.displayName = "BenefitsSection";
