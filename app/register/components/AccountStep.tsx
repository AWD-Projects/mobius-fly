import * as React from "react";
import { m } from "framer-motion";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/atoms/Input";
import { DateOfBirthPicker } from "@/components/molecules/DateOfBirthPicker";
import { PhoneInput } from "@/components/molecules/PhoneInput";
import { AccountFormData } from "@/lib/validations/register";
import { cn } from "@/lib/utils";

interface AccountStepProps {
  form: UseFormReturn<AccountFormData>;
}

export const AccountStep = React.memo<AccountStepProps>(({ form }) => {
  const { minBirthDate, maxBirthDate } = React.useMemo(() => {
    const today = new Date();
    const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    return {
      minBirthDate: "1900-01-01",
      maxBirthDate: toIso(max),
    };
  }, []);

  return (
    <m.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl space-y-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-12">
        Crea tu cuenta
      </h1>

      <form className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm text-text">
            Nombre completo <span className="text-error">*</span>
          </label>
          <Input
            id="fullName"
            type="text"
            {...form.register("fullName")}
            className="w-full"
            error={!!form.formState.errors.fullName}
          />
          {form.formState.errors.fullName && (
            <p className="text-xs text-error">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthDate" className="block text-sm text-text">
            Fecha de nacimiento <span className="text-error">*</span>
          </label>
          <Controller
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <DateOfBirthPicker
                id="birthDate"
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={minBirthDate}
                max={maxBirthDate}
                error={!!form.formState.errors.birthDate}
              />
            )}
          />
          {form.formState.errors.birthDate && (
            <p className="text-xs text-error">{form.formState.errors.birthDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm text-text">
            Sexo <span className="text-error">*</span>
          </label>
          <select
            id="gender"
            {...form.register("gender")}
            className={cn(
              "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-body text-text transition-all focus-visible:outline-none focus-visible:bg-surface focus-visible:border-text focus-visible:border-2",
              form.formState.errors.gender ? "border-error" : "border-border"
            )}
          >
            <option value="">Seleccionar</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
          {form.formState.errors.gender && (
            <p className="text-xs text-error">{form.formState.errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-text">
            Correo electrónico <span className="text-error">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            className="w-full"
            error={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-error">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm text-text">
            Número telefónico (opcional)
          </label>
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                id="phone"
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={!!form.formState.errors.phone}
              />
            )}
          />
          {form.formState.errors.phone && (
            <p className="text-xs text-error">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </form>
    </m.div>
  );
});

AccountStep.displayName = "AccountStep";
