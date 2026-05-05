import * as React from "react";
import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Pills } from "@/components/atoms/Pills";
import { FeatureCard } from "@/components/molecules/FeatureCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description: string;
}

interface FeaturesSectionProps {
  sectionPadding: string;
  userType: "buyer" | "owner";
  featuresData: {
    buyer: Feature[];
    owner: Feature[];
  };
  onUserTypeChange: (type: "buyer" | "owner") => void;
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
            title="Así funciona MobiusFly"
            subtitle="Donde cada vuelo encuentra a quien lo necesita."
            align="center"
            size="page"
          />

          {/* Pills */}
          <Pills
            pills={[
              { label: "Pasajero", value: "buyer" },
              { label: "Propietario", value: "owner" },
            ]}
            value={userType}
            onChange={(value) => onUserTypeChange(value as "buyer" | "owner")}
          />
        </m.div>

        {/* Features Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuresData[userType].map((feature, index) => (
            <m.div
              key={`${userType}-${index}`}
              className="h-full"
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
                subtitle={feature.subtitle}
                description={feature.description}
                className="h-full"
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";
