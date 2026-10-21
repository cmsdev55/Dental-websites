"use client";

import { cn } from "@/lib/utils";

/**
 * Text input with a label that floats up on focus or when filled, and an animated focus ring
 * (opacity + scale only). Errors are linked with aria-describedby.
 */
export function FloatingField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  multiline?: boolean;
}) {
  const field = {
    id,
    name: id,
    value,
    placeholder: " ",
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: cn(
      "peer block w-full rounded-xl border bg-surface/50 px-4 pt-6 pb-2 text-base text-ink transition-colors outline-none focus-visible:outline-none",
      error ? "border-[var(--danger)]" : "border-line focus:border-transparent",
      multiline && "min-h-28 resize-none",
    ),
  };

  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...field} rows={3} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...field} type={type} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-4 left-4 origin-top-left text-muted transition-[translate,scale] duration-300 ease-[var(--ease-expo)] peer-focus:-translate-y-2.5 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px scale-[0.985] rounded-xl opacity-0 ring-2 ring-accent-deep transition-[opacity,scale] duration-300 ease-[var(--ease-expo)] peer-focus:scale-100 peer-focus:opacity-100"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
