import * as React from "react";
import { m } from "framer-motion";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ComparisonTable } from "@/components/organisms/ComparisonTable";

interface ComparisonFeature {
  feature: string;
  mobius: string;
  traditional: string;
  jetCard: string;
  fullCharter: string;
}

interface ComparisonSectionProps {
  sectionPadding: string;
  comparisonFeatures: ComparisonFeature[];
}

export const ComparisonSection = React.memo<ComparisonSectionProps>(({
  sectionPadding,
  comparisonFeatures,
}) => {
  return (
    <section
      id="comparacion"
      className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
      style={{ backgroundColor: "#F6F6F4" }}
    >
      <div className="w-full flex flex-col items-center gap-8">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
          className="max-w-4xl"
        >
          <SectionHeader
            title="Comparación con otras plataformas"
            subtitle="Mobius Fly simplifica el acceso a vuelos privados con transparencia total, flexibilidad sin compromisos y el control que mereces."
            align="center"
            size="page"
          />
        </m.div>

        {/* Comparison Table */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full overflow-x-auto"
        >
          <div className="min-w-[700px]">
            <ComparisonTable features={comparisonFeatures} />
          </div>
        </m.div>
      </div>
    </section>
  );
});

ComparisonSection.displayName = "ComparisonSection";
