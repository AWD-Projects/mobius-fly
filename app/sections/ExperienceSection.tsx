import * as React from "react";
import { m } from "framer-motion";
import { Play, Plane } from "lucide-react";
import { SectionHeader } from "@/components/molecules/SectionHeader";

interface ExperienceSectionProps {
  sectionPadding: string;
}

export const ExperienceSection = React.memo<ExperienceSectionProps>(({
  sectionPadding,
}) => {
  return (
    <section
      id="experiencia"
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
            title="La experiencia Mobius Fly"
            subtitle="Volar privado, como debería sentirse"
            align="center"
            size="page"
          />
        </m.div>

        {/* Bento Grid */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-7xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:auto-rows-[280px]">
            {/* Video Placeholder - Large */}
            <div
              className="relative overflow-hidden group cursor-pointer h-[200px] sm:h-[240px] lg:col-span-5 lg:row-span-1 rounded-2xl"
              style={{
                backgroundColor: "#1a1a1a",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="transition-transform group-hover:scale-110"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "3px solid #F6F6F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play
                    size={32}
                    fill="#F6F6F4"
                    strokeWidth={0}
                    style={{ marginLeft: "4px" }}
                  />
                </div>
              </div>
            </div>

            {/* Wing Photo */}
            <div
              className="relative overflow-hidden flex items-center justify-center h-[200px] sm:h-[240px] lg:col-span-4 lg:row-span-1 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <span
                style={{
                  color: "#F6F6F4",
                  fontSize: "14px",
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                Vista del ala
              </span>
            </div>

            {/* Service Photo */}
            <div
              className="relative overflow-hidden flex items-center justify-center h-[200px] sm:h-[240px] lg:col-span-3 lg:row-span-1 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <span
                className="text-xs sm:text-sm font-medium"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.8,
                }}
              >
                Servicio a bordo
              </span>
            </div>

            {/* Plane Silhouette */}
            <div
              className="relative overflow-hidden flex items-center justify-center h-[200px] sm:h-[240px] lg:col-span-3 lg:row-span-1 rounded-2xl"
              style={{
                backgroundColor: "#E8E8E6",
              }}
            >
              <Plane
                size={60}
                className="sm:w-20 sm:h-20"
                strokeWidth={1}
                style={{ color: "#39424E", opacity: 0.3 }}
              />
            </div>

            {/* Jet on Tarmac */}
            <div
              className="relative overflow-hidden flex items-center justify-center h-[200px] sm:h-[240px] lg:col-span-4 lg:row-span-1 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <span
                className="text-xs sm:text-sm font-medium"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.8,
                }}
              >
                Jet en pista
              </span>
            </div>

            {/* Cockpit View */}
            <div
              className="relative overflow-hidden flex items-center justify-center h-[200px] sm:h-[240px] lg:col-span-5 lg:row-span-1 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              }}
            >
              <span
                className="text-xs sm:text-sm font-medium"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.8,
                }}
              >
                Vista desde cabina
              </span>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
});

ExperienceSection.displayName = "ExperienceSection";
