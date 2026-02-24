"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Button } from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightSearchCard } from "@/components/organisms/FlightSearchCard";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { Pills } from "@/components/atoms/Pills";
import { ComparisonTable } from "@/components/organisms/ComparisonTable";
import { Accordion } from "@/components/molecules/Accordion";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Textarea } from "@/components/atoms/Textarea";
import { Search, Compass, Calendar, Lock, Star, TrendingUp, Users, LayoutDashboard, Wallet, ArrowRight, Play, Plane, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  // Padding consistente para toda la landing
  const sectionPadding = "px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-48";

  // Estado para trackear si hemos scrolleado más allá del hero
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [userType, setUserType] = useState<"pasajero" | "propietario">("pasajero");
  const [isInFooter, setIsInFooter] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hero rotating words
  const rotatingWords = ["privada.", "personalizada.", "única.", "exclusiva.", "a medida.", "premium.", "excepcional."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Flight search state
  const [flightTripType, setFlightTripType] = useState<"roundtrip" | "oneway">("roundtrip");

  // Contact form state
  const [contactStep, setContactStep] = useState(1);
  const [contactData, setContactData] = useState({
    userType: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Features data por tipo de usuario
  const featuresData = {
    pasajero: [
      {
        icon: Compass,
        title: "Descubre oportunidades únicas",
        description: "Accede a jets privados disponibles a precios exclusivos. Tu próxima aventura está a un clic.",
      },
      {
        icon: Calendar,
        title: "Reserva en segundos",
        description: "Sin complicaciones ni esperas. Completa tu reserva de forma simple y segura.",
      },
      {
        icon: Lock,
        title: "Pago protegido al instante",
        description: "Checkout encriptado con confirmación inmediata. Tu tranquilidad es nuestra prioridad.",
      },
      {
        icon: Star,
        title: "Experimenta lujo real",
        description: "Salta las filas y vive la aviación privada. Tu vuelo, tus reglas.",
      },
    ],
    propietario: [
      {
        icon: TrendingUp,
        title: "Monetiza cada vuelo vacío",
        description: "Convierte tus empty legs en ingresos. Publica en minutos y maximiza tu rentabilidad.",
      },
      {
        icon: Users,
        title: "Conexión automática",
        description: "Pasajeros verificados encuentran tu vuelo. Llena asientos sin esfuerzo adicional.",
      },
      {
        icon: LayoutDashboard,
        title: "Control total en tiempo real",
        description: "Gestiona reservas, documentos y pasajeros desde un solo dashboard intuitivo.",
      },
      {
        icon: Wallet,
        title: "Pagos semanales garantizados",
        description: "Mobius procesa y distribuye tus ingresos cada semana de forma confiable y transparente.",
      },
    ],
  };

  // Rotating words effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2500); // Cambiar cada 2.5 segundos

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;

        // Hero mode: en el hero section O en el footer
        const isInHero = scrollPosition <= window.innerHeight * 0.5;
        setIsScrolled(!isInHero && !isInFooter);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isInFooter]);

  // Intersection Observer para detectar la sección activa
  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Buscar el href correspondiente
          const href = Object.keys(sectionMap).find(
            (key) => sectionMap[key] === sectionId
          );
          if (href) {
            setActiveSection(href);
          } else if (sectionId === "hero") {
            setActiveSection("");
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todas las secciones
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Intersection Observer para detectar el footer
  useEffect(() => {
    const footerObserverOptions = {
      root: scrollContainerRef.current,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0,
    };

    const footerObserverCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsInFooter(entry.isIntersecting);
      });
    };

    const footerObserver = new IntersectionObserver(
      footerObserverCallback,
      footerObserverOptions
    );

    const footer = document.getElementById("footer");
    if (footer) {
      footerObserver.observe(footer);
    }

    return () => {
      if (footer) {
        footerObserver.unobserve(footer);
      }
    };
  }, []);

  // Función para hacer scroll a una sección específica
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section && scrollContainerRef.current) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Mapa de hrefs a section IDs
  const sectionMap: Record<string, string> = {
    "/flights": "vuelos",
    "/how-it-works": "como-funciona",
    "/benefits": "beneficios",
    "/comparison": "comparacion",
    "/faq": "preguntas-frecuentes",
    "/contact": "contacto",
  };

  // Comparison table data
  const comparisonFeatures = [
    {
      feature: "Modelo de compra",
      mobius: "Por asiento",
      traditional: "Vuelo completo",
      jetCard: "Membresía anual",
      fullCharter: "Vuelo completo",
    },
    {
      feature: "Costo por asiento",
      mobius: "Desde €900",
      traditional: "€10,000+",
      jetCard: "€25k - €50k/año",
      fullCharter: "€15,000+",
    },
    {
      feature: "Vuelo completo obligatorio",
      mobius: "No",
      traditional: "Sí",
      jetCard: "Sí",
      fullCharter: "Sí",
    },
    {
      feature: "Transparencia de costos",
      mobius: "Completa",
      traditional: "Parcial",
      jetCard: "Parcial",
      fullCharter: "Negociable",
    },
    {
      feature: "Flexibilidad de reserva",
      mobius: "Muy alta",
      traditional: "Baja",
      jetCard: "Moderada",
      fullCharter: "Alta",
    },
    {
      feature: "Proceso de pago",
      mobius: "Digital, instantáneo",
      traditional: "Manual",
      jetCard: "Acuerdos previos",
      fullCharter: "Manual",
    },
    {
      feature: "Acceso a vuelos vacíos",
      mobius: "Sí, especializado",
      traditional: "No",
      jetCard: "Ocasionalmente",
      fullCharter: "No",
    },
    {
      feature: "Ideal para",
      mobius: "Viajeros ocasionales",
      traditional: "Vuelos frecuentes",
      jetCard: "Usuarios frecuentes",
      fullCharter: "Grupos grandes",
    },
  ];

  // FAQ data
  const faqCompradores = [
    {
      question: "¿Qué es un vuelo empty leg?",
      answer: "Un vuelo empty leg es un segmento de un vuelo privado que no tiene pasajeros confirmados. Las aeronaves deben viajar de todas formas para llegar a su próxima misión, lo que permite ofrecer estos asientos a un precio reducido.",
    },
    {
      question: "¿Cómo reservo un asiento?",
      answer: "Encuentra el vuelo que te interesa, selecciona la cantidad de asientos que necesitas y completa el proceso de pago. Recibirás confirmación inmediata por email.",
    },
    {
      question: "¿Cuántos asientos puedo comprar?",
      answer: "Puedes comprar desde 1 hasta todos los asientos disponibles en el vuelo, dependiendo de la capacidad de la aeronave y los asientos que el operador haya publicado.",
    },
    {
      question: "¿Qué documentos necesito para volar?",
      answer: "Necesitarás tu identificación oficial vigente (pasaporte para vuelos internacionales) y cualquier documentación adicional que requiera el país de destino.",
    },
    {
      question: "¿Qué pasa si mi pago falla?",
      answer: "Si tu pago no se procesa correctamente, no se confirmará tu reserva. Puedes intentar nuevamente con otro método de pago o contactar a nuestro equipo de soporte.",
    },
    {
      question: "¿Puedo cancelar una reserva?",
      answer: "Las políticas de cancelación varían según el operador y el tiempo de anticipación. Revisa los términos específicos de tu reserva antes de confirmar.",
    },
  ];

  const faqPropietarios = [
    {
      question: "¿Qué es Mobius Fly para propietarios?",
      answer: "Mobius Fly es una plataforma que te permite monetizar tus vuelos empty leg publicándolos directamente a pasajeros verificados, sin intermediarios ni comisiones excesivas.",
    },
    {
      question: "¿Cómo publico un vuelo empty leg?",
      answer: "Desde tu panel de control, selecciona la ruta, fecha, hora, aeronave y cantidad de asientos disponibles. Puedes publicar un vuelo en menos de 5 minutos.",
    },
    {
      question: "¿Cómo defino el precio por asiento?",
      answer: "Tú decides el precio por asiento basándote en tus costos operativos y la demanda del mercado. Mobius Fly te proporciona sugerencias basadas en rutas similares.",
    },
    {
      question: "¿Cuándo recibo el pago?",
      answer: "Los pagos se procesan semanalmente. Mobius Fly retiene los fondos hasta que el vuelo se completa exitosamente, y luego los transfiere a tu cuenta registrada.",
    },
    {
      question: "¿Puedo editar o cancelar un vuelo?",
      answer: "Puedes editar los detalles de un vuelo mientras no tenga reservas confirmadas. Si ya hay pasajeros confirmados, deberás contactar a soporte para gestionar cambios o cancelaciones.",
    },
    {
      question: "¿Qué documentos debo cargar como propietario?",
      answer: "Necesitas cargar certificaciones de la aeronave, licencias de la tripulación, seguros vigentes y cualquier documentación regulatoria requerida por las autoridades de aviación.",
    },
  ];

  return (
    <div ref={scrollContainerRef} className="lg:snap-y lg:snap-mandatory overflow-y-scroll h-screen">
      {/* Fixed Navbar - Aparece después del scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(246, 246, 244, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Navbar
          variant="default"
          backgroundColor="transparent"
          logo={
            <Image
              src="/logo/main-logo.svg"
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
          onLogoClick={() => scrollToSection("hero")}
          onNavLinkClick={(href) => {
            const sectionId = sectionMap[href];
            if (sectionId) scrollToSection(sectionId);
          }}
        />
      </div>

      {/* Hero Section */}
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
            onLogoClick={() => scrollToSection("hero")}
            onNavLinkClick={(href) => {
              const sectionId = sectionMap[href];
              if (sectionId) scrollToSection(sectionId);
            }}
          />
        </div>

        {/* Hero Content */}
        <div className={`flex-1 relative z-[1] flex items-center ${sectionPadding}`}>
            <div className="w-full max-w-2xl">
              {/* Main Heading */}
              <motion.h1
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
                    <motion.span
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
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
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
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex flex-col items-start gap-3"
              >
                <button
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
              </motion.div>
            </div>
        </div>
      </section>

      {/* Sección de Vuelos */}
      <section
        id="vuelos"
        className={`snap-start h-screen relative flex flex-col justify-center ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
          >
            <SectionHeader
              title="Encuentra tu vuelo ideal"
              subtitle="Selecciona ruta, fecha y pasajeros"
              align="center"
              size="page"
            />
          </motion.div>

          {/* Flight Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
          >
            <FlightSearchCard
              tripType={flightTripType}
              onTripTypeChange={setFlightTripType}
              originCode="COK"
              destinationCode="BLR"
              departureDate="15 dec"
              passengers={2}
            />
          </motion.div>

          {/* Search Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="gap-2 w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
              style={{
                backgroundColor: "#C4A77D",
                color: "#ffffff",
                fontWeight: 500,
              }}
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
              Buscar vuelos
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-center text-xs sm:text-sm px-4"
            style={{
              color: "#39424E",
              fontWeight: 400,
            }}
          >
            Vuelos verificados · Pagos seguros · Sin membresías
          </motion.p>
        </div>
      </section>

      {/* Sección Cómo funciona */}
      <section
        id="como-funciona"
        className={`lg:snap-start min-h-screen lg:h-screen relative flex flex-col py-12 lg:py-0 lg:justify-center ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-12">
          {/* Header */}
          <motion.div
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
              onChange={(value) => setUserType(value as "pasajero" | "propietario")}
              activeColor="#C4A77D"
              inactiveColor="#C4A77D"
              activeBgColor="#EDE7DC"
            />
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuresData[userType].map((feature, index) => (
              <motion.div
                key={`${userType}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.3 }}
                className="h-full"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Comparación */}
      <section
        id="comparacion"
        className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-8">
          {/* Header */}
          <motion.div
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
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full overflow-x-auto"
          >
            <div className="min-w-[700px]">
              <ComparisonTable features={comparisonFeatures} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección Beneficios */}
      <section
        id="beneficios"
        className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-16">
          {/* Header */}
          <motion.div
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
          </motion.div>

          {/* Two Column Benefits */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl">
            {/* Left Column - Para quienes vuelan */}
            <motion.div
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
                {[
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
                    title: "4. Experiencia privada de principio a fin",
                    description: "Desde el FBO hasta el aterrizaje, todo está diseñado para volar sin fricciones.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex flex-col gap-1.5 sm:gap-2">
                    <h4
                      className="text-sm sm:text-base font-medium"
                      style={{
                        color: "#39424E",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {benefit.title}
                    </h4>
                    <p
                      className="text-xs sm:text-sm font-normal leading-relaxed"
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

              <button
                className="flex items-center gap-2 self-start transition-all hover:gap-3 text-xs sm:text-sm font-medium"
                style={{
                  color: "#C4A77D",
                  letterSpacing: "-0.01em",
                }}
              >
                Explorar vuelos
                <ArrowRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2} />
              </button>
            </motion.div>

            {/* Right Column - Para quienes operan */}
            <motion.div
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
                Para quienes operan
              </h3>

              <div className="flex flex-col gap-4 sm:gap-6">
                {[
                  {
                    title: "1. Monetiza vuelos empty leg fácilmente",
                    description: "Convierte trayectos sin pasajeros en ingresos adicionales.",
                  },
                  {
                    title: "2. Publica y gestiona tus vuelos en un solo lugar",
                    description: "Controla flota, tripulación y pasajeros desde tu panel.",
                  },
                  {
                    title: "3. Sin brokers ni fricción operativa",
                    description: "Publica vuelos directamente, sin llamadas ni intermediarios.",
                  },
                  {
                    title: "4. Soporte y validación de Mobius Fly",
                    description: "Nos encargamos de revisar documentación y respaldar cada operación.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex flex-col gap-1.5 sm:gap-2">
                    <h4
                      className="text-sm sm:text-base font-medium"
                      style={{
                        color: "#39424E",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {benefit.title}
                    </h4>
                    <p
                      className="text-xs sm:text-sm font-normal leading-relaxed"
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

              <button
                className="flex items-center gap-2 self-start transition-all hover:gap-3 text-xs sm:text-sm font-medium"
                style={{
                  color: "#C4A77D",
                  letterSpacing: "-0.01em",
                }}
              >
                Publicar un vuelo
                <ArrowRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección Experiencia Mobius */}
      <section
        id="experiencia"
        className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-12">
          {/* Header */}
          <motion.div
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
          </motion.div>

          {/* Bento Grid */}
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* Sección Preguntas Frecuentes */}
      <section
        id="preguntas-frecuentes"
        className={`snap-start min-h-screen relative flex flex-col justify-center py-20 ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full flex flex-col items-center gap-12">
          {/* Header */}
          <motion.div
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
          </motion.div>

          {/* Two Column Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl">
            {/* Left Column - Para compradores */}
            <motion.div
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
            </motion.div>

            {/* Right Column - Para propietarios */}
            <motion.div
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
                  Respuestas para propietarios y operadores de aeronaves sobre monetización, publicación de vuelos y gestión de operaciones.
                </p>
              </div>

              <Accordion items={faqPropietarios} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección Contacto - Multistep Form */}
      <section
        id="contacto"
        className={`snap-start h-screen relative flex flex-col justify-center ${sectionPadding}`}
        style={{ backgroundColor: "#F6F6F4" }}
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-12">
          {/* Header */}
          {contactStep !== 4 && (
            <SectionHeader
              title="Hablemos"
              subtitle="Cuéntanos qué necesitas y te contactamos personalmente"
              align="center"
              size="page"
            />
          )}

          {/* Form Container */}
          <div className="w-full relative flex items-center gap-8">
            {/* Left Arrow */}
            {contactStep !== 4 && (
              <button
                onClick={() => {
                  setContactStep(Math.max(1, contactStep - 1));
                  setSubmitError(null);
                }}
                disabled={contactStep === 1 || isSubmitting}
                className="group relative transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
              >
                <ChevronLeft size={32} strokeWidth={1} style={{ color: "#39424E" }} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Anterior
                </span>
              </button>
            )}

            {/* Form Content */}
            <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center">
              {/* Step 1: User Type Selection */}
              {contactStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p
                    className="text-sm sm:text-base font-normal text-center"
                    style={{
                      color: "#39424E",
                      opacity: 0.8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ¿Qué te gustaría hacer en Mobius Fly?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                    <button
                      onClick={() => {
                        setContactData({ ...contactData, userType: "reservar" });
                        setContactStep(2);
                      }}
                      className={cn(
                        "group p-6 sm:p-8 rounded-2xl bg-white hover:shadow-hover transition-all flex flex-col items-start gap-2 sm:gap-3 text-left border",
                        contactData.userType === "reservar"
                          ? "border-primary"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <h3
                        className={cn(
                          "transition-colors text-base sm:text-lg md:text-xl font-medium",
                          contactData.userType === "reservar"
                            ? "!text-primary"
                            : "group-hover:!text-primary"
                        )}
                        style={{
                          color: "#39424E",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Reservar un vuelo
                      </h3>
                      <p
                        className={cn(
                          "transition-colors text-xs sm:text-sm font-normal leading-relaxed",
                          contactData.userType === "reservar"
                            ? "!text-primary !opacity-100"
                            : "group-hover:!text-primary group-hover:!opacity-100"
                        )}
                        style={{
                          color: "#39424E",
                          opacity: 0.7,
                        }}
                      >
                        Explorar vuelos privados disponibles
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setContactData({ ...contactData, userType: "administrar" });
                        setContactStep(2);
                      }}
                      className={cn(
                        "group p-6 sm:p-8 rounded-2xl bg-white hover:shadow-hover transition-all flex flex-col items-start gap-2 sm:gap-3 text-left border",
                        contactData.userType === "administrar"
                          ? "border-primary"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <h3
                        className={cn(
                          "transition-colors text-base sm:text-lg md:text-xl font-medium",
                          contactData.userType === "administrar"
                            ? "!text-primary"
                            : "group-hover:!text-primary"
                        )}
                        style={{
                          color: "#39424E",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Administrar mis vuelos
                      </h3>
                      <p
                        className={cn(
                          "transition-colors text-xs sm:text-sm font-normal leading-relaxed",
                          contactData.userType === "administrar"
                            ? "!text-primary !opacity-100"
                            : "group-hover:!text-primary group-hover:!opacity-100"
                        )}
                        style={{
                          color: "#39424E",
                          opacity: 0.7,
                        }}
                      >
                        Soy operador o propietario de aeronaves
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {contactStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p
                    className="text-sm sm:text-base font-normal text-center"
                    style={{
                      color: "#39424E",
                      opacity: 0.8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ¿Cómo podemos contactarte?
                  </p>

                  <div className="w-full flex flex-col gap-4">
                    <InputGroup
                      label="Nombre"
                      type="text"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      required
                    />

                    <InputGroup
                      label="Correo"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      required
                    />

                    <InputGroup
                      label="Número telefónico (opcional)"
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Message */}
              {contactStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <p
                    className="text-sm sm:text-base font-normal text-center"
                    style={{
                      color: "#39424E",
                      opacity: 0.8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ¿Hay algo más qué quieras contarnos?
                  </p>

                  <Textarea
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    rows={6}
                    className="resize-none"
                  />

                  {submitError && (
                    <div
                      className="w-full p-4 rounded-lg text-center"
                      style={{
                        backgroundColor: "#FEE2E2",
                        border: "1px solid #FCA5A5",
                      }}
                    >
                      <p
                        style={{
                          color: "#991B1B",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {submitError}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Success */}
              {contactStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center gap-10"
                >
                  {/* Success Icon */}
                  <div
                    className="rounded-full flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
                    style={{
                      backgroundColor: "#C4A77D20",
                    }}
                  >
                    <Check size={32} className="sm:w-10 sm:h-10" strokeWidth={2} style={{ color: "#C4A77D" }} />
                  </div>

                  <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md px-4">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-medium leading-tight"
                      style={{
                        color: "#39424E",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Hemos recibido tus datos
                    </h3>
                    <p
                      className="text-sm sm:text-base font-normal leading-relaxed"
                      style={{
                        color: "#39424E",
                        opacity: 0.7,
                      }}
                    >
                      Nos pondremos en contacto contigo muy pronto para continuar
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto px-4">
                    <Button
                      variant="link"
                      icon={<ArrowRight size={16} strokeWidth={1} />}
                      iconPosition="end"
                    >
                      Explorar vuelos
                    </Button>

                    <span style={{ color: "#E0E0DE" }}>|</span>

                    <Button
                      variant="link"
                      icon={<ArrowRight size={16} strokeWidth={1} />}
                      iconPosition="end"
                    >
                      Publicar un vuelo
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Arrow */}
            {contactStep !== 4 && (
              <button
                onClick={async () => {
                  setSubmitError(null);

                  if (contactStep === 3) {
                    // Submit form
                    setIsSubmitting(true);
                    try {
                      const response = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(contactData),
                      });

                      if (response.ok) {
                        setContactStep(4);
                      } else {
                        setSubmitError("Error al enviar el formulario. Por favor, intenta de nuevo.");
                      }
                    } catch (error) {
                      setSubmitError("Error de conexión. Verifica tu internet e intenta de nuevo.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  } else if (contactStep < 4) {
                    setContactStep(contactStep + 1);
                  }
                }}
                disabled={
                  (contactStep === 1 && !contactData.userType) ||
                  (contactStep === 2 && (!contactData.name.trim() || !contactData.email.trim())) ||
                  (contactStep === 3 && !contactData.message.trim()) ||
                  isSubmitting
                }
                className="group relative transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
              >
                {isSubmitting ? (
                  <div className="animate-spin">
                    <Loader2 size={32} strokeWidth={1} style={{ color: "#C4A77D" }} />
                  </div>
                ) : (
                  <>
                    <ChevronRight
                      size={32}
                      strokeWidth={1}
                      style={{ color: "#39424E" }}
                    />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {contactStep === 3 ? "Enviar" : "Siguiente"}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="snap-start relative min-h-screen flex items-center justify-center py-16"
        style={{ backgroundColor: "#39424E" }}
      >
        <div className={`w-full flex flex-col gap-12 sm:gap-16 md:gap-20 ${sectionPadding}`}>
          {/* Top Section - Logo + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
            className="flex flex-col items-center gap-6 sm:gap-8 text-center"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo/mobiuswhite-logo.svg"
                alt="Mobius Fly"
                width={60}
                height={60}
                className="sm:w-20 sm:h-20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 px-4">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug"
                style={{
                  color: "#F6F6F4",
                  letterSpacing: "-0.02em",
                }}
              >
                La plataforma que une pasajeros y operadores
              </h2>
              <p
                className="text-sm sm:text-base font-normal"
                style={{
                  color: "#F6F6F4",
                  opacity: 0.7,
                }}
              >
                Más valor. Menos intermediarios. Total control
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto px-4">
              <Button
                variant="link"
                icon={<ArrowRight size={16} strokeWidth={1} />}
                iconPosition="end"
                className="!text-background"
              >
                Explorar vuelos
              </Button>

              <span style={{ color: "#F6F6F4", opacity: 0.2 }}>|</span>

              <Button
                variant="link"
                icon={<ArrowRight size={16} strokeWidth={1} />}
                iconPosition="end"
                className="!text-background"
              >
                Publicar un vuelo
              </Button>
            </div>
          </motion.div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#F6F6F4", opacity: 0.1 }} />

          {/* Middle Section - Links with Background SVG */}
          <div className="relative">
            {/* Background Mobius Fly Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-5xl" style={{ opacity: 0.15 }}>
                <Image
                  src="/assets/mobius-footer.svg"
                  alt="Mobius Fly"
                  width={1200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Links Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.8 }}
              className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-4xl mx-auto py-6 sm:py-8 text-center sm:text-left"
            >
              {/* Plataforma */}
              <div className="flex flex-col gap-3 sm:gap-4 items-center sm:items-start">
                <h3
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                  style={{
                    color: "#F6F6F4",
                    opacity: 0.9,
                  }}
                >
                  Plataforma
                </h3>
                <nav className="flex flex-col gap-2 sm:gap-3">
                  {[
                    { label: "Vuelos", href: "/flights" },
                    { label: "Cómo funciona", href: "/how-it-works" },
                    { label: "Beneficios", href: "/benefits" },
                    { label: "Contacto", href: "/contact" },
                  ].map((link, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left transition-all hover:opacity-100 hover:translate-x-1 text-xs sm:text-sm font-normal"
                      style={{
                        color: "#F6F6F4",
                        opacity: 0.7,
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Recursos */}
              <div className="flex flex-col gap-3 sm:gap-4 items-center sm:items-start">
                <h3
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                  style={{
                    color: "#F6F6F4",
                    opacity: 0.9,
                  }}
                >
                  Recursos
                </h3>
                <nav className="flex flex-col gap-3">
                  {[
                    { label: "Preguntas frecuentes", href: "/faq" },
                    { label: "Comparación", href: "/comparison" },
                  ].map((link, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(link.href)}
                      className="text-left transition-all hover:opacity-100 hover:translate-x-1 text-xs sm:text-sm font-normal"
                      style={{
                        color: "#F6F6F4",
                        opacity: 0.7,
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <h3
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                  style={{
                    color: "#F6F6F4",
                    opacity: 0.9,
                  }}
                >
                  Legal
                </h3>
                <nav className="flex flex-col gap-2 sm:gap-3">
                  <a
                    href="#"
                    className="text-left transition-all hover:opacity-100 hover:translate-x-1 text-xs sm:text-sm font-normal"
                    style={{
                      color: "#F6F6F4",
                      opacity: 0.7,
                    }}
                  >
                    Privacidad
                  </a>
                  <a
                    href="#"
                    className="text-left transition-all hover:opacity-100 hover:translate-x-1 text-xs sm:text-sm font-normal"
                    style={{
                      color: "#F6F6F4",
                      opacity: 0.7,
                    }}
                  >
                    Términos
                  </a>
                </nav>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#F6F6F4", opacity: 0.1 }} />

          {/* Bottom Section - Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left"
          >
            <p
              className="text-xs sm:text-sm font-normal"
              style={{
                color: "#F6F6F4",
                opacity: 0.6,
              }}
            >
              © 2025 Mobius Fly. Todos los derechos reservados.
            </p>
            <a
              href="https://www.amoxtli.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:opacity-100 text-xs sm:text-sm font-normal"
              style={{
                color: "#F6F6F4",
                opacity: 0.6,
              }}
            >
              Powered by Amoxtli®
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
