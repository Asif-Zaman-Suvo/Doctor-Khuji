"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import "react-day-picker/style.css";

interface DatePickerProps {
  value?: string;           // YYYY-MM-DD
  onChange: (val: string) => void;
  min?: string;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  hasError?: boolean;
  /** "birthdate" shows year+month dropdowns for quick navigation */
  variant?: "default" | "birthdate";
}

function parseLocalDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIsoLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const currentYear = new Date().getFullYear();

function StyledSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-app-surface-2 border border-app-border text-sm font-semibold text-app-text hover:border-[#24AE7C]/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#24AE7C]">
        <Select.Value />
        <Select.Icon><ChevronDown size={13} className="text-app-muted" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-[200] max-h-60 overflow-y-auto rounded-xl border border-app-border bg-app-surface shadow-xl shadow-black/20 animate-in fade-in-0 zoom-in-95"
        >
          <Select.Viewport className="p-1">
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="flex items-center px-3 py-1.5 text-sm text-app-text rounded-lg cursor-pointer hover:bg-app-surface-2 focus:bg-app-surface-2 focus:outline-none data-[state=checked]:text-[#24AE7C] data-[state=checked]:font-semibold"
              >
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function DatePicker({
  value,
  onChange,
  min,
  disabled,
  placeholder = "Pick a date",
  hasError = false,
  variant = "default",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = parseLocalDate(value);
  const minDate = parseLocalDate(min);

  // For birthdate variant — track displayed month/year independently
  const [displayMonth, setDisplayMonth] = useState<Date>(
    selected ?? (variant === "birthdate" ? new Date(currentYear - 25, 0, 1) : new Date())
  );

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onChange(toIsoLocal(date));
    setOpen(false);
  }

  const isBirthdate = variant === "birthdate";
  const fromYear = isBirthdate ? 1920 : currentYear - 1;
  const toYear = isBirthdate ? currentYear : currentYear + 2;

  const yearOptions = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => {
      const y = toYear - i; // newest first
      return { label: String(y), value: String(y) };
    }
  );

  const monthOptions = MONTHS.map((m, i) => ({
    label: m,
    value: String(i),
  }));

  const sharedClassNames = {
    root: "rdp-custom",
    months: "flex flex-col",
    month: "space-y-3",
    month_caption: "flex items-center justify-between px-1 py-1",
    caption_label: "text-sm font-semibold text-app-text",
    nav: "flex items-center gap-1",
    button_previous:
      "flex items-center justify-center w-7 h-7 rounded-lg text-app-muted hover:bg-app-surface-2 hover:text-app-text transition-colors cursor-pointer",
    button_next:
      "flex items-center justify-center w-7 h-7 rounded-lg text-app-muted hover:bg-app-surface-2 hover:text-app-text transition-colors cursor-pointer",
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday: "w-9 text-center text-xs font-medium text-app-subtle pb-2",
    week: "flex mt-1",
    day: "w-9 h-9 text-center text-sm",
    day_button:
      "w-9 h-9 rounded-xl text-sm font-medium transition-colors cursor-pointer text-app-muted hover:bg-app-surface-2 hover:text-app-text focus:outline-none focus:ring-1 focus:ring-[#24AE7C]",
    selected: "!bg-[#24AE7C] !text-white !rounded-xl font-semibold",
    today: "text-[#24AE7C] font-semibold",
    disabled: "text-app-border cursor-not-allowed pointer-events-none opacity-40",
    outside: "text-app-subtle pointer-events-none opacity-30",
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`flex items-center gap-3 w-full h-11 rounded-xl border px-4 text-sm transition-colors focus:outline-none focus:ring-1 ${
            hasError
              ? "border-red-500/50 focus:ring-red-500/50 bg-app-surface-2 text-app-text"
              : "border-app-border-2 focus:ring-[#24AE7C] bg-app-surface-2 text-app-text"
          }`}
        >
          <CalendarDays size={16} className={hasError ? "text-red-400" : "text-app-muted"} />
          <span className={selected ? "text-app-text" : "text-app-subtle"}>
            {selected ? format(selected, isBirthdate ? "MMMM d, yyyy" : "EEEE, MMMM d, yyyy") : placeholder}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 rounded-2xl border border-app-border bg-app-surface p-4 shadow-2xl shadow-black/20 outline-none animate-in fade-in-0 zoom-in-95"
        >
          {/* Birthdate: month + year dropdowns */}
          {isBirthdate && (
            <div className="flex items-center gap-2 mb-3">
              <StyledSelect
                value={String(displayMonth.getMonth())}
                options={monthOptions}
                onChange={(v) =>
                  setDisplayMonth(new Date(displayMonth.getFullYear(), Number(v), 1))
                }
              />
              <StyledSelect
                value={String(displayMonth.getFullYear())}
                options={yearOptions}
                onChange={(v) =>
                  setDisplayMonth(new Date(Number(v), displayMonth.getMonth(), 1))
                }
              />
            </div>
          )}

          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            month={isBirthdate ? displayMonth : undefined}
            onMonthChange={isBirthdate ? setDisplayMonth : undefined}
            fromYear={fromYear}
            toYear={toYear}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (disabled) return disabled(date);
              return false;
            }}
            classNames={{
              ...sharedClassNames,
              // hide the built-in caption label in birthdate mode (replaced by dropdowns)
              caption_label: isBirthdate
                ? "hidden"
                : "text-sm font-semibold text-app-text",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                ),
            }}
          />
          <Popover.Arrow className="fill-app-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
