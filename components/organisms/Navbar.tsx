import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, fontFamily } from "@/lib/utils";
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
import { motion, AnimatePresence } from "framer-motion";

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
        { label: "Cómo funciona", href: "/how-it-works" },
        { label: "Beneficios", href: "/benefits" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Contacto", href: "/contact" },
      ],
      isLoggedIn = false,
      userType = "buyer",
      userInitials = "CP",
      backgroundColor = "#1a1a2e",
      loginButtonText = "Iniciar Sesión",
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

    // Bloquear scroll cuando el menú móvil esté abierto
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

    // Componente del menú móvil
    const mobileMenu = (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0"
            style={{ backgroundColor: isHero ? "#090E11" : "#F6F6F4", zIndex: 99999 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: isHero ? "rgba(246, 246, 244, 0.1)" : "#E0E0DE" }}>
              <span
                className="font-bold text-lg"
                style={{
                  color: isHero ? "#F6F6F4" : "#39424E",
                  fontFamily,
                }}
              >
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 transition-opacity hover:opacity-80"
                style={{
                  color: isHero ? "#F6F6F4" : "#39424E",
                }}
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
                      "text-left px-4 py-3 rounded-lg transition-all",
                      isActive
                        ? isHero
                          ? "bg-white/10"
                          : "bg-primary/10"
                        : isHero
                          ? "hover:bg-white/5"
                          : "hover:bg-secondary/5"
                    )}
                    style={{
                      color: isActive
                        ? isHero
                          ? "#F6F6F4"
                          : "#C4A77D"
                        : isHero
                          ? "#F6F6F4"
                          : "#39424E",
                      fontFamily,
                      fontSize: "15px",
                      fontWeight: isActive ? 600 : 400,
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Bottom CTA Buttons */}
            <div className="p-6 border-t flex flex-col gap-3" style={{ borderColor: isHero ? "rgba(246, 246, 244, 0.1)" : "#E0E0DE" }}>
              <button
                onClick={() => {
                  onSignUpClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg transition-opacity hover:opacity-90 text-sm font-semibold"
                style={{
                  color: isHero ? "#F6F6F4" : "#39424E",
                  fontFamily,
                }}
              >
                {signUpButtonText}
              </button>
              <button
                onClick={() => {
                  onLoginClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg transition-all hover:opacity-90 text-sm font-semibold"
                style={
                  isHero
                    ? {
                        color: "#F6F6F4",
                        fontFamily,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }
                    : {
                        color: "#39424E",
                        fontFamily,
                        backgroundColor: "transparent",
                        border: "1px solid #39424E",
                      }
                }
              >
                {loginButtonText}
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          <div className={cn("w-full h-[60px] flex items-center justify-between rounded-2xl py-3", contentPadding)}>

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
                  "font-bold whitespace-nowrap text-base sm:text-lg md:text-xl",
                  isHero ? "" : "text-secondary"
                )}
                style={{
                  color: isHero ? "#F6F6F4" : undefined,
                  fontFamily,
                  letterSpacing: "-0.4px",
                }}
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
                    "text-center whitespace-nowrap transition-all relative",
                    isHero
                      ? ""
                      : isActive
                        ? "text-primary"
                        : "text-secondary",
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                  )}
                  style={{
                    color: isHero ? "#F6F6F4" : undefined,
                    fontFamily,
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "-0.07px",
                    lineHeight: "20px",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{
                        backgroundColor: isHero ? "#F6F6F4" : "#C4A77D",
                      }}
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
                    "hidden md:flex items-center justify-center px-3 md:px-4 py-2 rounded-lg whitespace-nowrap hover:opacity-90 transition-opacity text-sm",
                    isHero ? "" : "text-secondary"
                  )}
                  style={{
                    color: isHero ? "#F6F6F4" : undefined,
                    fontFamily,
                    fontWeight: 600,
                    letterSpacing: "-0.07px",
                  }}
                >
                  {signUpButtonText}
                </button>

                {/* Login button - glassmorphism on hero, outline on default */}
                <button
                  onClick={onLoginClick}
                  className={cn(
                    "hidden sm:flex items-center justify-center px-3 md:px-4 py-2 whitespace-nowrap transition-all rounded-md text-sm",
                    isHero ? "hover:bg-white/10" : "hover:bg-secondary/10 text-secondary border border-secondary"
                  )}
                  style={
                    isHero
                      ? {
                          color: "#F6F6F4",
                          fontFamily,
                          fontWeight: 500,
                          letterSpacing: "-0.07px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }
                      : {
                          fontFamily,
                          fontWeight: 600,
                          letterSpacing: "-0.07px",
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
                    isHero ? "" : "text-secondary"
                  )}
                  style={{
                    color: isHero ? "#F6F6F4" : undefined,
                  }}
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
                        Analíticas
                      </DropdownMenuItem>
                      <DropdownMenuItem icon={Users} onClick={onCrewManagementClick}>
                        Gestión de tripulación
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={CreditCard} onClick={onBillingClick}>
                    Facturación
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={Bell} onClick={onNotificationsClick}>
                    Notificaciones
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={Settings} onClick={onSettingsClick}>
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={LogOut} variant="danger" onClick={onLogoutClick}>
                    Cerrar sesión
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
