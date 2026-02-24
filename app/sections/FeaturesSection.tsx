import * as React from "react";
import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Pills } from "@/components/atoms/Pills";
import { FeatureCard } from "@/components/molecules/FeatureCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  sectionPadding: string;
  userType: "pasajero" | "propietario";
  featuresData: {
    pasajero: Feature[];
    propietario: Feature[];
  };
  onUserTypeChange: (type: "pasajero" | "propietario") => void;
}

export const FeaturesSection = React.memo<FeaturesSectionProps>(({
  sectionPadding,
  userType,
  featuresData,
  onUserTypeChange,
}) => {
  return (
    <section
      id="como-funciona"
      className={`lg:snap-start min-h-screen lg:h-screen relative flex flex-col py-12 lg:py-0 lg:justify-center ${sectionPadding}`}
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
            title="Así funciona Mobius Fly"
            subtitle="Una plataforma. Dos formas de volar"
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
            onChange={(value) => onUserTypeChange(value as "pasajero" | "propietario")}
          />
        </m.div>

        {/* Features Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuresData[userType].map((feature, index) => (
            <m.div
              key={`${userType}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";
