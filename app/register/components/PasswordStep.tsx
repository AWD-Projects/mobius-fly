import * as React from "react";
import { m } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { PasswordFormData } from "@/lib/validations/register";

interface PasswordStepProps {
  form: UseFormReturn<PasswordFormData>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export const PasswordStep = React.memo<PasswordStepProps>(({
  form,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  return (
    <m.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl space-y-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-8">
        Crea tu contraseña
      </h1>

      <form className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-text">
            Contraseña <span className="text-error">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              className="w-full pr-10"
              error={!!form.formState.errors.password}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-error">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm text-text">
            Confirmar contraseña <span className="text-error">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              className="w-full pr-10"
              error={!!form.formState.errors.confirmPassword}
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-error">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
      </form>
    </m.div>
  );
});

PasswordStep.displayName = "PasswordStep";
