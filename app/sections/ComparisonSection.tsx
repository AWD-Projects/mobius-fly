"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Check } from "lucide-react";
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

type Competitor = "traditional" | "jetCard" | "fullCharter";

const competitors: { key: Competitor; label: string }[] = [
  { key: "traditional", label: "Charter on-demand" },
  { key: "jetCard", label: "Jet Card" },
  { key: "fullCharter", label: "Prop. fraccionada" },
];

export const ComparisonSection = React.memo<ComparisonSectionProps>(({
  sectionPadding,
  comparisonFeatures,
}) => {
  const [activeCompetitor, setActiveCompetitor] = React.useState<Competitor>("traditional");

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

        {/* Desktop: full table */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="hidden lg:block w-full"
        >
          <ComparisonTable features={comparisonFeatures} />
        </m.div>

        {/* Mobile: Mobius vs one competitor */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="lg:hidden w-full flex flex-col gap-5"
        >
          {/* Competitor tabs */}
          <div className="flex gap-2">
            {competitors.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCompetitor(key)}
                className="flex-1 py-2 px-1 rounded-sm text-xs font-medium transition-colors"
                style={{
                  backgroundColor: activeCompetitor === key ? "#39424E" : "transparent",
                  color: activeCompetitor === key ? "#F6F6F4" : "#39424E",
                  border: `1px solid ${activeCompetitor === key ? "#39424E" : "#D0CCC5"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Two-column rows */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FBFAF9", boxShadow: "0px 4px 16px rgba(0,0,0,0.06)" }}
          >
            {/* Column headers */}
            <div
              className="grid grid-cols-2 px-4 py-3 border-b"
              style={{ borderColor: "#EEEBE6" }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Mobius Fly
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: "#39424E", opacity: 0.45 }}
              >
                {competitors.find(c => c.key === activeCompetitor)?.label}
              </span>
            </div>

            {comparisonFeatures.map((row, index) => (
              <div
                key={index}
                className="px-4 py-3"
                style={{
                  borderBottom: index !== comparisonFeatures.length - 1 ? "1px solid #EEEBE6" : undefined,
                }}
              >
                {/* Feature label */}
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: "#39424E", opacity: 0.55 }}
                >
                  {row.feature}
                </p>

                {/* Values */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-1.5">
                    <Check
                      size={13}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span
                      className="text-xs font-medium leading-snug"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {row.mobius}
                    </span>
                  </div>
                  <span
                    className="text-xs font-normal leading-snug"
                    style={{ color: "#39424E", opacity: 0.5 }}
                  >
                    {row[activeCompetitor]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
});

ComparisonSection.displayName = "ComparisonSection";
