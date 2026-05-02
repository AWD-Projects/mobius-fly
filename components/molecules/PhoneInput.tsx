"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/Popover";

// ─── Country data ────────────────────────────────────────────────────────────

const ALL_COUNTRIES: CountryCode[] = getCountries();

const getCountryName = (() => {
  let cache: Intl.DisplayNames | null = null;
  return (code: CountryCode): string => {
    if (!cache) {
      try {
        cache = new Intl.DisplayNames(["es"], { type: "region" });
      } catch {
        return code;
      }
    }
    return cache.of(code) ?? code;
  };
})();

const getFlagEmoji = (code: CountryCode): string => {
  if (!code || code.length !== 2) return "🏳️";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripNonDigits = (s: string) => s.replace(/\D/g, "");

const formatNational = (digits: string, country: CountryCode): string => {
  if (!digits) return "";
  const formatter = new AsYouType(country);
  // Feeding only the national portion makes AsYouType emit the national format.
  return formatter.input(digits) || digits;
};

const buildE164 = (digits: string, country: CountryCode): string => {
  if (!digits) return "";
  return `+${getCountryCallingCode(country)}${digits}`;
};

const parseE164 = (
  value: string,
  fallback: CountryCode
): { country: CountryCode; national: string } => {
  if (!value) return { country: fallback, national: "" };
  const parsed = parsePhoneNumberFromString(value);
  if (parsed?.country) {
    return { country: parsed.country, national: parsed.nationalNumber };
  }
  // Couldn't parse — keep digits, fall back to provided default country.
  return { country: fallback, national: stripNonDigits(value) };
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface PhoneInputProps {
  id?: string;
  name?: string;
  value?: string;
  defaultCountry?: CountryCode;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      id,
      name,
      value,
      defaultCountry = "MX",
      onChange,
      onBlur,
      error,
      disabled,
      placeholder = "10 dígitos",
      className,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const initial = React.useMemo(
      () => parseE164(value ?? "", defaultCountry),
      // Only on first render — subsequent external changes handled via effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    const [country, setCountry] = React.useState<CountryCode>(initial.country);
    const [digits, setDigits] = React.useState<string>(initial.national);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Keep internal state in sync if `value` changes externally.
    React.useEffect(() => {
      const next = parseE164(value ?? "", country);
      setDigits((prev) => (prev === next.national ? prev : next.national));
      if (next.country !== country && value) setCountry(next.country);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const emit = (nextDigits: string, nextCountry: CountryCode) => {
      onChange?.(nextDigits ? buildE164(nextDigits, nextCountry) : "");
    };

    const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = stripNonDigits(e.target.value).slice(0, 15);
      setDigits(next);
      emit(next, country);
    };

    const handleSelectCountry = (next: CountryCode) => {
      setCountry(next);
      setOpen(false);
      setSearch("");
      emit(digits, next);
    };

    const filteredCountries = React.useMemo(() => {
      const q = search.trim().toLowerCase();
      const list = ALL_COUNTRIES.map((c) => ({
        code: c,
        name: getCountryName(c),
        dial: `+${getCountryCallingCode(c)}`,
      }));
      list.sort((a, b) => a.name.localeCompare(b.name, "es"));
      if (!q) return list;
      return list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.dial.includes(q)
      );
    }, [search]);

    const display = React.useMemo(
      () => formatNational(digits, country),
      [digits, country]
    );

    const dialCode = `+${getCountryCallingCode(country)}`;

    return (
      <div
        className={cn(
          "flex items-stretch h-10 w-full rounded-sm border border-border bg-transparent transition-all overflow-hidden",
          "focus-within:bg-surface focus-within:border-text focus-within:border-2",
          error && "border-error focus-within:border-error",
          disabled && "opacity-40 cursor-not-allowed bg-neutral/40",
          className
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label="Seleccionar país"
              className={cn(
                "flex items-center gap-1.5 px-3 border-r border-border bg-transparent text-small text-text",
                "hover:bg-background focus:outline-none focus:bg-background",
                "disabled:cursor-not-allowed"
              )}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {getFlagEmoji(country)}
              </span>
              <span className="font-medium">{dialCode}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar país"
                className="flex-1 bg-transparent text-small text-text placeholder:text-muted focus:outline-none"
                autoFocus
              />
            </div>
            <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
              {filteredCountries.length === 0 && (
                <li className="px-3 py-2 text-small text-muted">
                  Sin resultados
                </li>
              )}
              {filteredCountries.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => handleSelectCountry(c.code)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-small text-text text-left",
                      "hover:bg-background focus:outline-none focus:bg-background",
                      country === c.code && "bg-background font-medium"
                    )}
                    role="option"
                    aria-selected={country === c.code}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      {getFlagEmoji(c.code)}
                    </span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-muted">{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <input
          ref={ref}
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={display}
          onChange={handleDigitsChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={ariaInvalid ?? error}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "flex-1 min-w-0 bg-transparent px-3 text-small text-text",
            "placeholder:text-muted focus:outline-none",
            "disabled:cursor-not-allowed"
          )}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
