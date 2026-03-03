import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/atoms/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/atoms/DropdownMenu";
import {
  User,
  Settings,
  LogOut,
  Plane,
  Calendar,
  FileText,
  CreditCard,
  Bell,
  Users,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

const navbarVariants = cva("w-full", {
  variants: {
    variant: {
      hero: "",
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode;
  logoText?: string;
  navLinks?: NavLink[];
  isLoggedIn?: boolean;
  userType?: "buyer" | "owner";
  userInitials?: string;
  backgroundColor?: string;
  loginButtonText?: string;
  signUpButtonText?: string;
  contentPadding?: string;
  activeHref?: string;
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onNavLinkClick?: (href: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onMyFlightsClick?: () => void;
  onMyBookingsClick?: () => void;
  onDocumentsClick?: () => void;
  onBillingClick?: () => void;
  onNotificationsClick?: () => void;
  onMyPlanesClick?: () => void;
  onAnalyticsClick?: () => void;
  onCrewManagementClick?: () => void;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      variant,
      logo,
      logoText = "Mobius Fly",
      navLinks = [
        { label: "Vuelos", href: "/flights" },
        { label: "Como funciona", href: "/how-it-works" },
        { label: "Beneficios", href: "/benefits" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Contacto", href: "/contact" },
      ],
      isLoggedIn = false,
      userType = "buyer",
      userInitials = "CP",
      backgroundColor = "#1a1a2e",
      loginButtonText = "Iniciar Sesion",
      signUpButtonText = "Crear cuenta",
      contentPadding = "px-8 2xl:px-80",
      activeHref = "",
      onLogoClick,
      onLoginClick,
      onSignUpClick,
      onNavLinkClick,
      onProfileClick,
      onSettingsClick,
      onLogoutClick,
      onMyFlightsClick,
      onMyBookingsClick,
      onDocumentsClick,
      onBillingClick,
      onNotificationsClick,
      onMyPlanesClick,
      onAnalyticsClick,
      onCrewManagementClick,
      ...props
    },
    ref
  ) => {
    const isHero = variant === "hero";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Bloquear scroll cuando el menu movil este abierto
    React.useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isMobileMenuOpen]);

    // Componente del menu movil
    const mobileMenu = (
      <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "lg:hidden fixed inset-0",
              isHero ? "bg-secondary" : "bg-background"
            )}
            style={{ zIndex: 99999 }}
          >
            <m.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header with close button */}
            <div
              className={cn(
                "flex items-center justify-between p-6 border-b",
                isHero ? "border-white/10" : "border-border"
              )}
            >
              <span
                className={cn(
                  "font-bold text-lg",
                  isHero ? "text-white" : "text-secondary"
                )}
              >
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "p-2 transition-opacity hover:opacity-80",
                  isHero ? "text-white" : "text-secondary"
                )}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col p-6 gap-1 flex-1 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      onNavLinkClick?.(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "text-left px-4 py-3 rounded-sm transition-all text-body",
                      isActive
                        ? isHero
                          ? "bg-white/10"
                          : "bg-primary/10"
                        : isHero
                          ? "hover:bg-white/5"
                          : "hover:bg-secondary/5",
                      isActive ? "font-semibold" : "font-normal",
                      !isActive && "opacity-80",
                      isActive
                        ? isHero
                          ? "text-white"
                          : "text-primary"
                        : isHero
                          ? "text-white"
                          : "text-secondary"
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Bottom CTA Buttons */}
            <div
              className={cn(
                "p-6 border-t flex flex-col gap-3",
                isHero ? "border-white/10" : "border-border"
              )}
            >
              <button
                onClick={() => {
                  onSignUpClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-sm transition-all text-small font-semibold",
                  isHero
                    ? "text-white hover:bg-white/10"
                    : "text-secondary hover:bg-secondary/10"
                )}
              >
                {signUpButtonText}
              </button>
              <button
                onClick={() => {
                  onLoginClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 rounded-sm transition-all text-small font-semibold border",
                  isHero
                    ? "text-white bg-white/10 border-white/20 hover:bg-white/20"
                    : "text-secondary bg-transparent border-secondary hover:bg-secondary/10"
                )}
              >
                {loginButtonText}
              </button>
            </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
      </LazyMotion>
    );

    return (
      <>
        <nav
          ref={ref}
          className={cn(
            "w-full h-[79px] flex items-center justify-center",
            navbarVariants({ variant, className })
          )}
          style={{ backgroundColor }}
          {...props}
        >
          {/* Menu Container with proper padding */}
          <div className={cn("w-full h-[60px] flex items-center justify-between rounded-md py-3", contentPadding)}>

            {/* Left: Company Logo + Name */}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8">
                {logo || <div className="w-full h-full bg-white/10 rounded" />}
              </div>
              <span
                className={cn(
                  "font-bold whitespace-nowrap text-body sm:text-lg md:text-xl tracking-tight",
                  isHero ? "text-white" : "text-secondary"
                )}
              >
                {logoText}
              </span>
            </button>

          {/* Center: Navigation Links - flex-grow to take available space */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => onNavLinkClick?.(link.href)}
                  className={cn(
                    "text-center whitespace-nowrap transition-all relative text-small leading-5 tracking-tight",
                    isHero
                      ? "text-white"
                      : isActive
                        ? "text-primary"
                        : "text-secondary",
                    isActive ? "opacity-100 font-semibold" : "opacity-70 hover:opacity-100 font-normal"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-0.5 rounded-full",
                        isHero ? "bg-white" : "bg-primary"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: CTA Buttons or User Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            {!isLoggedIn ? (
              <>
                {/* Sign up button */}
                <button
                  onClick={onSignUpClick}
                  className={cn(
                    "hidden md:flex items-center justify-center px-3 md:px-4 py-2 rounded-sm whitespace-nowrap transition-all text-small font-semibold tracking-tight",
                    isHero
                      ? "text-white hover:bg-white/10"
                      : "text-secondary hover:bg-secondary/10"
                  )}
                >
                  {signUpButtonText}
                </button>

                {/* Login button - glassmorphism on hero, outline on default */}
                <button
                  onClick={onLoginClick}
                  className={cn(
                    "hidden sm:flex items-center justify-center px-3 md:px-4 py-2 whitespace-nowrap transition-all rounded-sm text-small font-medium tracking-tight",
                    isHero
                      ? "text-white hover:bg-white/10"
                      : "hover:bg-secondary/10 text-secondary border border-secondary"
                  )}
                  style={
                    isHero
                      ? {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }
                      : {
                          backgroundColor: "transparent",
                        }
                  }
                >
                  {loginButtonText}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    "lg:hidden flex items-center justify-center p-2 transition-opacity hover:opacity-80",
                    isHero ? "text-white" : "text-secondary"
                  )}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full transition-all hover:ring-2 hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/30">
                    <Avatar initials={userInitials} size="md" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem icon={User} onClick={onProfileClick}>
                    Mi perfil
                  </DropdownMenuItem>

                  {userType === "buyer" ? (
                    <>
                      <DropdownMenuItem icon={Plane} onClick={onMyFlightsClick}>
                        Mis vuelos
                      </DropdownMenuItem>
                      <DropdownMenuItem icon={Calendar} onClick={onMyBookingsClick}>
                        Mis reservas
                      </DropdownMenuItem>
                      <DropdownMenuItem icon={FileText} onClick={onDocumentsClick}>
                        Mis documentos
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem icon={Plane} onClick={onMyPlanesClick}>
                        Mis aviones
                      </DropdownMenuItem>
                      <DropdownMenuItem icon={BarChart3} onClick={onAnalyticsClick}>
                        Analiticas
                      </DropdownMenuItem>
                      <DropdownMenuItem icon={Users} onClick={onCrewManagementClick}>
                        Gestion de tripulacion
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={CreditCard} onClick={onBillingClick}>
                    Facturacion
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={Bell} onClick={onNotificationsClick}>
                    Notificaciones
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={Settings} onClick={onSettingsClick}>
                    Configuracion
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={LogOut} variant="danger" onClick={onLogoutClick}>
                    Cerrar sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        </nav>

        {/* Mobile Menu Overlay - Renderizado mediante Portal */}
        {mounted && createPortal(mobileMenu, document.body)}
      </>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar, navbarVariants };
