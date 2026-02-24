import * as React from "react";
import { m } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface VerificationStepProps {
  verificationCode: string[];
  canResend: boolean;
  resendTimer: number;
  onCodeChange: (index: number, value: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onResendCode: () => void;
}

export const VerificationStep = React.memo<VerificationStepProps>(({
  verificationCode,
  canResend,
  resendTimer,
  onCodeChange,
  onPaste,
  onResendCode,
}) => {
  return (
    <m.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl space-y-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-text text-center">
        Verifica tu cuenta
      </h1>

      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {verificationCode.map((code, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={code}
              onChange={(e) => {
                onCodeChange(index, e.target.value);
                // Auto-focus next input
                if (e.target.value && index < 5) {
                  const nextInput = document.getElementById(`code-${index + 1}`);
                  nextInput?.focus();
                }
              }}
              onPaste={index === 0 ? onPaste : undefined}
              id={`code-${index}`}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold rounded-md border border-border bg-transparent text-text transition-all focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2"
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={onResendCode}
            disabled={!canResend}
            className={cn(!canResend && "text-muted")}
          >
            {canResend ? "Reenviar código" : `Reenviar código (${resendTimer}s)`}
          </Button>
        </div>
      </div>
    </m.div>
  );
});

VerificationStep.displayName = "VerificationStep";
