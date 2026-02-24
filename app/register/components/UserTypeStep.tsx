import * as React from "react";
import { m } from "framer-motion";
import { SelectionCard } from "@/components/molecules/SelectionCard";

interface UserTypeStepProps {
  userType: "buyer" | "owner" | "";
  onSelectUserType: (type: "buyer" | "owner") => void;
}

export const UserTypeStep = React.memo<UserTypeStepProps>(({ userType, onSelectUserType }) => {
  return (
    <m.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl space-y-8"
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
        <SelectionCard
          title="Vivir la experiencia de un vuelo privado"
          description="Explorar vuelos privados disponibles"
          isSelected={userType === "buyer"}
          onClick={() => onSelectUserType("buyer")}
        />

        <SelectionCard
          title="Tener control total de mis empty legs"
          description="Soy operador o propietario de aeronaves"
          isSelected={userType === "owner"}
          onClick={() => onSelectUserType("owner")}
        />
      </div>
    </m.div>
  );
});

UserTypeStep.displayName = "UserTypeStep";
