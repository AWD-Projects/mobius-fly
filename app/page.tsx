"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { LazyMotion, domAnimation } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Compass, Calendar, Lock, Star, TrendingUp, Users, LayoutDashboard, Wallet } from "lucide-react";
import { HeroSection } from "./sections/HeroSection";
import { FlightSearchSection } from "./sections/FlightSearchSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { FAQSection } from "./sections/FAQSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";

// Mapa de hrefs a section IDs
const sectionMap: Record<string, string> = {
  "/flights": "vuelos",
  "/how-it-works": "como-funciona",
  "/benefits": "beneficios",
  "/comparison": "comparacion",
  "/faq": "preguntas-frecuentes",
  "/contact": "contacto",
};

export default function Home() {
  const router = useRouter();

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
    }, 2500);

    return () => clearInterval(interval);
    // rotatingWords is a constant array, no need for dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const isInHero = scrollPosition <= window.innerHeight * 0.5;
        setIsScrolled(!isInHero && !isInFooter);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
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
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section && scrollContainerRef.current) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Memoized handlers for better performance
  const handleContactSubmit = useCallback(async (data: import("./sections/ContactSection").ContactFormData) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error al enviar el formulario. Por favor, intenta de nuevo.");
    }
  }, []);

  const handleExploreClick = useCallback(() => {
    scrollToSection("vuelos");
  }, [scrollToSection]);

  const handleNavLinkClick = useCallback((href: string) => {
    const sectionId = sectionMap[href];
    if (sectionId) scrollToSection(sectionId);
  }, [scrollToSection]);

  const handleLogoClick = useCallback(() => {
    scrollToSection("hero");
  }, [scrollToSection]);

  const handleLoginClick = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleSignUpClick = useCallback(() => {
    router.push("/register");
  }, [router]);

  // Comparison table data
  const comparisonFeatures = [
    { feature: "Modelo de compra", mobius: "Por asiento", traditional: "Vuelo completo", jetCard: "Membresía anual", fullCharter: "Vuelo completo" },
    { feature: "Costo por asiento", mobius: "Desde €900", traditional: "€10,000+", jetCard: "€25k - €50k/año", fullCharter: "€15,000+" },
    { feature: "Vuelo completo obligatorio", mobius: "No", traditional: "Sí", jetCard: "Sí", fullCharter: "Sí" },
    { feature: "Transparencia de costos", mobius: "Completa", traditional: "Parcial", jetCard: "Parcial", fullCharter: "Negociable" },
    { feature: "Flexibilidad de reserva", mobius: "Muy alta", traditional: "Baja", jetCard: "Moderada", fullCharter: "Alta" },
    { feature: "Proceso de pago", mobius: "Digital, instantáneo", traditional: "Manual", jetCard: "Acuerdos previos", fullCharter: "Manual" },
    { feature: "Acceso a vuelos vacíos", mobius: "Sí, especializado", traditional: "No", jetCard: "Ocasionalmente", fullCharter: "No" },
    { feature: "Ideal para", mobius: "Viajeros ocasionales", traditional: "Vuelos frecuentes", jetCard: "Usuarios frecuentes", fullCharter: "Grupos grandes" },
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
      question: "¿Puedo llevar equipaje?",
      answer: "Sí. Cada asiento incluye equipaje de mano y una maleta facturada. Consulta los detalles específicos de cada vuelo.",
    },
    {
      question: "¿Qué documentos necesito?",
      answer: "Para vuelos nacionales, identificación oficial vigente. Para internacionales, pasaporte vigente y visas necesarias.",
    },
  ];

  const faqPropietarios = [
    {
      question: "¿Cómo publico un vuelo?",
      answer: "Inicia sesión, ve a 'Publicar Vuelo', completa la ruta, fecha y precio. Tu vuelo estará visible en minutos.",
    },
    {
      question: "¿Cuánto cuesta publicar?",
      answer: "Publicar es gratis. Mobius cobra una comisión solo cuando se confirma una reserva.",
    },
    {
      question: "¿Puedo cancelar un vuelo publicado?",
      answer: "Sí, mientras no haya reservas confirmadas. Si ya hay pasajeros confirmados, contacta a soporte para gestionar la cancelación.",
    },
    {
      question: "¿Cómo recibo el pago?",
      answer: "Los pagos se procesan de forma automática cada semana. Recibirás transferencia directa a tu cuenta bancaria registrada.",
    },
    {
      question: "¿Qué verificaciones hace Mobius?",
      answer: "Verificamos que operadores y aeronaves cumplan regulaciones vigentes, seguro activo y certificaciones al día.",
    },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
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
          onLogoClick={handleLogoClick}
          onNavLinkClick={handleNavLinkClick}
          onLoginClick={handleLoginClick}
          onSignUpClick={handleSignUpClick}
        />
      </div>

      {/* Hero Section */}
      <HeroSection
        sectionPadding={sectionPadding}
        currentWordIndex={currentWordIndex}
        rotatingWords={rotatingWords}
        activeSection={activeSection}
        onLogoClick={handleLogoClick}
        onNavLinkClick={handleNavLinkClick}
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        onExploreClick={handleExploreClick}
      />

      {/* Flight Search Section */}
      <FlightSearchSection
        sectionPadding={sectionPadding}
      />

      {/* Features Section */}
      <FeaturesSection
        sectionPadding={sectionPadding}
        userType={userType}
        featuresData={featuresData}
        onUserTypeChange={setUserType}
      />

      {/* Comparison Section */}
      <ComparisonSection
        sectionPadding={sectionPadding}
        comparisonFeatures={comparisonFeatures}
      />

      {/* Benefits Section */}
      <BenefitsSection sectionPadding={sectionPadding} />

      {/* Experience Section */}
      <ExperienceSection sectionPadding={sectionPadding} />

      {/* FAQ Section */}
      <FAQSection
        sectionPadding={sectionPadding}
        faqCompradores={faqCompradores}
        faqPropietarios={faqPropietarios}
      />

      {/* Contact Section */}
      <ContactSection
        sectionPadding={sectionPadding}
        onSubmit={handleContactSubmit}
      />

      {/* Footer Section */}
      <FooterSection
        sectionPadding={sectionPadding}
        onScrollToSection={scrollToSection}
      />
    </div>
    </LazyMotion>
  );
}
