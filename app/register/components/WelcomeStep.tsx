import * as React from "react";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface WelcomeStepProps {
  onGoToDashboard: () => void;
  isLoading?: boolean;
}

export const WelcomeStep = React.memo<WelcomeStepProps>(({ onGoToDashboard, isLoading }) => {
  return (
    <m.div
      key="step6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl text-center space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-text">
        Bienvenid@ a Mobius Fly
      </h1>
      <p className="text-base sm:text-lg text-text max-w-md mx-auto">
        Completaste tu registro. Todo listo<br />
        para reservar tus vuelos privados
      </p>
      <Button
        variant="outline"
        size="lg"
        onClick={onGoToDashboard}
        isLoading={isLoading}
        className="mx-auto"
        icon={<ArrowRight size={18} />}
        iconPosition="end"
      >
        Ir a mi perfil
      </Button>
    </m.div>
  );
});

WelcomeStep.displayName = "WelcomeStep";
