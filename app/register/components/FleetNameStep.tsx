import * as React from "react";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InputGroup } from "@/components/molecules/InputGroup";
import { Button } from "@/components/atoms/Button";

interface FleetNameStepProps {
  onContinue: (fleetName: string) => void;
}

export const FleetNameStep = React.memo<FleetNameStepProps>(({ onContinue }) => {
  const [fleetName, setFleetName] = React.useState("");

  return (
    <m.div
      key="step6-fleet"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl text-center space-y-8"
    >
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-text">
          ¡Ya casi terminamos!
        </h1>
        <p className="text-base sm:text-lg text-text opacity-70 max-w-md mx-auto">
          Dale un nombre a tu flota para identificarla en la plataforma.
        </p>
      </div>

      <div className="max-w-sm mx-auto text-left">
        <InputGroup
          label="Nombre de la flota"
          type="text"
          value={fleetName}
          onChange={(e) => setFleetName(e.target.value)}
          placeholder="Ej. Aerolineas del Norte"
        />
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onContinue(fleetName)}
        className="mx-auto"
        icon={<ArrowRight size={18} />}
        iconPosition="end"
      >
        Continuar
      </Button>
    </m.div>
  );
});

FleetNameStep.displayName = "FleetNameStep";
