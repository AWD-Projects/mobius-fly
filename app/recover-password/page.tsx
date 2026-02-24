"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement password recovery logic
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <LazyMotion features={domAnimation} strict>
        {/* Back Arrow - Fixed to top left corner */}
        <m.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => router.push("/login")}
          className="fixed top-6 left-6 p-2 text-text hover:text-secondary transition-colors z-50"
          aria-label="Volver al inicio de sesión"
        >
          <ArrowLeft size={24} />
        </m.button>
        <div className="w-full max-w-[356px] flex flex-col items-center">
          {/* Logo */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
              <Image
                src="/logo/main-logo.svg"
                alt="Mobius Fly"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-medium text-text">Mobius Fly</span>
            </Link>
          </m.div>

          {/* Heading */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[2rem] font-bold text-text mb-8 text-center"
          >
            ¿Olvidaste tu contraseña?
          </m.h1>

          {isSubmitted ? (
            /* Success Message */
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-center"
            >
              <p className="text-body text-text mb-4">
                Si existe una cuenta con ese correo, recibirás un enlace para
                restablecer tu contraseña.
              </p>
              <Button
                variant="link"
                onClick={() => setIsSubmitted(false)}
                className="text-text"
              >
                Intentar con otro correo
              </Button>
            </m.div>
          ) : (
            /* Form */
            <m.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="w-full space-y-6"
            >
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-text">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-8"
            >
              Recuperar contraseña
            </Button>
            </m.form>
          )}
        </div>
      </LazyMotion>
    </div>
  );
}
