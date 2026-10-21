"use client";

import { ArrowLeft, Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { FloatingField } from "@/components/ui/FloatingField";
import { EASE_EXPO_OUT, slideX } from "@/lib/animations";
import { bookingServices, timeWindows } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { cn } from "@/lib/utils";

const STEPS = ["Service", "Date & time", "Your details"] as const;

interface FormData {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  patient: "new" | "returning";
}

type Errors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = {
  service: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  patient: "new",
};

/** The next `count` weekdays, starting tomorrow. Built in the browser so a static build never shows stale dates. */
function upcomingWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const day = new Date();
  day.setHours(12, 0, 0, 0);
  while (days.length < count) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() !== 0 && day.getDay() !== 6) days.push(new Date(day));
  }
  return days;
}

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function validate(step: number, data: FormData): Errors {
  const errors: Errors = {};
  if (step === 0 && !data.service) errors.service = "Choose a service to continue.";
  if (step === 1) {
    if (!data.date) errors.date = "Pick a preferred date.";
    if (!data.time) errors.time = "Pick a preferred time of day.";
  }
  if (step === 2) {
    if (!data.name.trim()) errors.name = "Please enter your name.";
    if (data.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a phone number we can call you on.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "That email doesn't look quite right.";
  }
  return errors;
}

/**
 * Multi-step booking request (Service → Date & time → Your details) with sliding steps and an
 * animated success check. Front-end only. Colors, radii and type come from the template's tokens.
 */
export function BookingCard({ practice, className }: { practice: Practice; className?: string }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [days, setDays] = useState<Date[]>([]);
  const focusLegend = useRef(false);

  useEffect(() => setDays(upcomingWeekdays(10)), []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    focusLegend.current = true;
    setStep(next);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(step, data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (step < STEPS.length - 1) goTo(step + 1);
    else setSubmitted(true);
  };

  const reset = () => {
    setData(EMPTY);
    setErrors({});
    setStep(0);
    setDirection(-1);
    setSubmitted(false);
  };

  // Move focus to each new step's heading once it has slid in, so screen readers follow along.
  const legendRef = (el: HTMLLegendElement | null) => {
    if (el && focusLegend.current) {
      focusLegend.current = false;
      el.focus({ preventScroll: true });
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.35)] sm:p-8 md:p-10",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <Success key="success" practice={practice} data={data} onReset={reset} />
        ) : (
          <m.div key="form" exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}>
            <ol className="grid grid-cols-3 gap-3" aria-label="Booking progress">
              {STEPS.map((label, i) => (
                <li key={label} aria-current={i === step ? "step" : undefined}>
                  <span className="block h-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink)_12%,transparent)]">
                    <span
                      className={cn(
                        "block h-full origin-left bg-accent-deep transition-transform duration-700 ease-[var(--ease-expo)]",
                        i <= step ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                  <span className={cn("mt-3 block text-xs font-medium sm:text-sm", i === step ? "text-ink" : "text-muted")}>
                    <span className="tabular-nums">0{i + 1}</span> {label}
                  </span>
                </li>
              ))}
            </ol>

            <form noValidate onSubmit={onSubmit} className="mt-8">
              <div className="min-h-[25rem] overflow-hidden sm:min-h-[23rem]">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <m.fieldset
                    key={step}
                    custom={direction}
                    variants={slideX}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="min-w-0"
                  >
                    <legend ref={legendRef} tabIndex={-1} className="font-display text-2xl font-light md:text-3xl">
                      {step === 0 && "What can we help with?"}
                      {step === 1 && "When suits you best?"}
                      {step === 2 && "How can we reach you?"}
                    </legend>

                    {step === 0 && (
                      <div className="mt-6">
                        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Service">
                          {bookingServices.map((service) => (
                            <ChoiceCard
                              key={service}
                              name="service"
                              value={service}
                              checked={data.service === service}
                              onChange={() => update("service", service)}
                              describedBy={errors.service ? "service-error" : undefined}
                            >
                              {service}
                            </ChoiceCard>
                          ))}
                        </div>
                        <FieldError id="service-error" message={errors.service} />
                      </div>
                    )}

                    {step === 1 && (
                      <div className="mt-6 space-y-7">
                        <div>
                          <p id="date-label" className="text-sm font-medium">
                            Preferred date
                          </p>
                          <div
                            role="radiogroup"
                            aria-labelledby="date-label"
                            className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5"
                          >
                            {days.map((day) => {
                              const value = isoDate(day);
                              return (
                                <ChoiceCard
                                  key={value}
                                  name="date"
                                  value={value}
                                  checked={data.date === value}
                                  onChange={() => update("date", value)}
                                  describedBy={errors.date ? "date-error" : undefined}
                                  compact
                                >
                                  <span className="block text-xs text-muted">
                                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                                  </span>
                                  <span className="block font-display text-2xl leading-tight">{day.getDate()}</span>
                                  <span className="block text-xs text-muted">
                                    {day.toLocaleDateString("en-US", { month: "short" })}
                                  </span>
                                </ChoiceCard>
                              );
                            })}
                          </div>
                          <FieldError id="date-error" message={errors.date} />
                        </div>
                        <div>
                          <p id="time-label" className="text-sm font-medium">
                            Preferred time
                          </p>
                          <div role="radiogroup" aria-labelledby="time-label" className="mt-3 grid gap-2 sm:grid-cols-3">
                            {timeWindows.map((time) => (
                              <ChoiceCard
                                key={time}
                                name="time"
                                value={time}
                                checked={data.time === time}
                                onChange={() => update("time", time)}
                                describedBy={errors.time ? "time-error" : undefined}
                              >
                                {time}
                              </ChoiceCard>
                            ))}
                          </div>
                          <FieldError id="time-error" message={errors.time} />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-6 space-y-4">
                        <div role="radiogroup" aria-label="Patient type" className="grid grid-cols-2 gap-2">
                          {(["new", "returning"] as const).map((type) => (
                            <ChoiceCard
                              key={type}
                              name="patient"
                              value={type}
                              checked={data.patient === type}
                              onChange={() => update("patient", type)}
                            >
                              {type === "new" ? "New patient" : "Returning patient"}
                            </ChoiceCard>
                          ))}
                        </div>
                        <FloatingField
                          id="name"
                          label="Full name"
                          value={data.name}
                          onChange={(v) => update("name", v)}
                          error={errors.name}
                          autoComplete="name"
                          required
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FloatingField
                            id="phone"
                            label="Phone"
                            type="tel"
                            inputMode="tel"
                            value={data.phone}
                            onChange={(v) => update("phone", v)}
                            error={errors.phone}
                            autoComplete="tel"
                            required
                          />
                          <FloatingField
                            id="email"
                            label="Email (optional)"
                            type="email"
                            inputMode="email"
                            value={data.email}
                            onChange={(v) => update("email", v)}
                            error={errors.email}
                            autoComplete="email"
                          />
                        </div>
                        <FloatingField
                          id="notes"
                          label="Anything we should know? (optional)"
                          value={data.notes}
                          onChange={(v) => update("notes", v)}
                          multiline
                        />
                      </div>
                    )}
                  </m.fieldset>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => goTo(step - 1)} className={buttonClasses("ghost", "px-2")}>
                    <ArrowLeft aria-hidden="true" className="size-4" /> Back
                  </button>
                ) : (
                  <span className="text-sm text-muted">Takes about a minute</span>
                )}
                <button type="submit" className={buttonClasses(step === STEPS.length - 1 ? "accent" : "primary")}>
                  {step === STEPS.length - 1 ? "Request appointment" : "Continue"} <ButtonArrow />
                </button>
              </div>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  describedBy,
  compact = false,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  describedBy?: string;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-center rounded-2xl border bg-surface/50 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-deep has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-card",
        checked ? "border-accent-deep bg-accent/15" : "border-line hover:border-[color-mix(in_oklab,var(--ink)_35%,transparent)]",
        compact ? "flex-col justify-center px-2 py-3 text-center" : "justify-between gap-3 px-5 py-4",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span className={compact ? undefined : "font-medium"}>{children}</span>
      {!compact && (
        <span
          aria-hidden="true"
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
            checked ? "border-accent-deep bg-accent-deep text-card" : "border-line",
          )}
        >
          <Check
            className={cn(
              "size-3.5 transition-[scale,opacity] duration-300 ease-[var(--ease-expo)]",
              checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
            strokeWidth={3}
          />
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role="alert" className="mt-2 min-h-5 text-sm text-[var(--danger)]">
      {message}
    </p>
  );
}

function Success({ practice, data, onReset }: { practice: Practice; data: FormData; onReset: () => void }) {
  const firstName = data.name.trim().split(/\s+/)[0];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <m.div
      role="status"
      className="flex min-h-[30rem] flex-col items-center justify-center py-6 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE_EXPO_OUT }}
    >
      <div className="relative grid size-24 place-items-center">
        <m.span
          className="absolute inset-0 rounded-full bg-accent/25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        />
        <svg viewBox="0 0 80 80" className="relative size-20 text-accent-deep" aria-hidden="true">
          <m.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
          />
          <m.path
            d="M25 41.5 35 51.5 56 29"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, delay: 0.6, ease: EASE_EXPO_OUT }}
          />
        </svg>
      </div>

      <h3 ref={heading} tabIndex={-1} className="mt-8 font-display text-3xl font-light md:text-4xl">
        Thank you{firstName ? `, ${firstName}` : ""}!
      </h3>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        Your request for <strong className="font-medium text-ink">{data.service.toLowerCase()}</strong> on{" "}
        <strong className="font-medium text-ink">{longDate(data.date)}</strong> ({data.time.toLowerCase()}) is ready.
      </p>
      <p className="mt-3 max-w-md text-sm text-muted">
        This is a preview, so nothing was sent. On the live site, {practice.name} receives it instantly and calls you to
        confirm.
      </p>
      <button type="button" onClick={onReset} className={buttonClasses("outline", "mt-8")}>
        Make another request
      </button>
    </m.div>
  );
}
