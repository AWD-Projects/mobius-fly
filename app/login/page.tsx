"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement login logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <LazyMotion features={domAnimation} strict>
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
            Iniciar Sesión
          </m.h1>

          {/* Form */}
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

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-text">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Iniciar sesión
          </Button>
          </m.form>

          {/* Forgot Password Link */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-center mt-4"
          >
            <Link
              href="/recover-password"
              className="text-sm text-text hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </m.div>

          {/* Register Link */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="mt-8 text-center text-sm text-text flex items-center justify-center gap-1"
          >
            <span>¿Nuevo en Mobius Fly?</span>
            <Link href="/register">
              <Button variant="link" className="h-auto p-0 text-sm font-semibold text-secondary hover:text-secondary">
                Regístrate
              </Button>
            </Link>
          </m.div>
        </div>
      </LazyMotion>
    </div>
  );
}
