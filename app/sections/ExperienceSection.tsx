import * as React from "react";
import Image from "next/image";
import { m } from "framer-motion";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:auto-rows-[200px] xl:auto-rows-[240px] 2xl:auto-rows-[300px]">
            {/* Video */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-5 lg:row-span-1 rounded-2xl bg-black">
              <video
                src={process.env.NEXT_PUBLIC_EXPERIENCE_VIDEO_URL ?? "/assets/experience/Video.mp4"}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            {/* Window View */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-4 lg:row-span-1 rounded-2xl bg-neutral-200">
              <Image
                src="/assets/experience/01-hero-window.webp"
                alt="Vista del ala"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Dining / Service */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-3 lg:row-span-1 rounded-2xl bg-neutral-200">
              <Image
                src="/assets/experience/03-private-jet-dining.webp"
                alt="Servicio a bordo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* FBO Lounge */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-3 lg:row-span-1 rounded-2xl bg-neutral-200">
              <Image
                src="/assets/experience/02-fbo-lounge.webp"
                alt="Lounge privado"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Jet on Tarmac */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-4 lg:row-span-1 rounded-2xl bg-neutral-200">
              <Image
                src="/assets/experience/05-jet-tarmac.webp"
                alt="Jet en pista"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Cabin Detail */}
            <div className="relative overflow-hidden h-[240px] sm:h-[260px] lg:h-auto lg:col-span-5 lg:row-span-1 rounded-2xl bg-neutral-200">
              <Image
                src="/assets/experience/06-cabin-detail.webp"
                alt="Detalle de cabina"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
});

ExperienceSection.displayName = "ExperienceSection";
