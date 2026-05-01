"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import "react-day-picker/style.css";

interface DatePickerProps {
  value?: string;           // YYYY-MM-DD
  onChange: (val: string) => void;
  min?: string;             // YYYY-MM-DD
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  hasError?: boolean;
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

export function DatePicker({
  value,
  onChange,
  min,
  disabled,
  placeholder = "Pick a date",
  hasError = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseLocalDate(value);
  const minDate = parseLocalDate(min);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onChange(toIsoLocal(date));
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`flex items-center gap-3 w-full h-11 rounded-xl border px-4 text-sm transition-colors focus:outline-none focus:ring-1 ${
            hasError
              ? "border-red-500/50 focus:ring-red-500/50 bg-[#1A1D21] text-white"
              : "border-[#363A3D] focus:ring-[#24AE7C] bg-[#1A1D21] text-white"
          }`}
        >
          <CalendarDays size={16} className={hasError ? "text-red-400" : "text-[#ABB8C4]"} />
          <span className={selected ? "text-white" : "text-[#76828D]"}>
            {selected ? format(selected, "EEEE, MMMM d, yyyy") : placeholder}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 rounded-2xl border border-[#1E2124] bg-[#161A1F] p-4 shadow-2xl shadow-black/50 outline-none animate-in fade-in-0 zoom-in-95"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (disabled) return disabled(date);
              return false;
            }}
            classNames={{
              root: "rdp-custom",
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "flex items-center justify-between px-1 py-1",
              caption_label: "text-sm font-semibold text-white",
              nav: "flex items-center gap-1",
              button_previous:
                "flex items-center justify-center w-7 h-7 rounded-lg text-[#ABB8C4] hover:bg-[#1E2124] hover:text-white transition-colors cursor-pointer",
              button_next:
                "flex items-center justify-center w-7 h-7 rounded-lg text-[#ABB8C4] hover:bg-[#1E2124] hover:text-white transition-colors cursor-pointer",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "w-9 text-center text-xs font-medium text-[#76828D] pb-2",
              week: "flex mt-1",
              day: "w-9 h-9 text-center text-sm",
              day_button:
                "w-9 h-9 rounded-xl text-sm font-medium transition-colors cursor-pointer text-[#ABB8C4] hover:bg-[#1E2124] hover:text-white focus:outline-none focus:ring-1 focus:ring-[#24AE7C]",
              selected:
                "!bg-[#24AE7C] !text-white !rounded-xl font-semibold",
              today: "text-[#24AE7C] font-semibold",
              disabled: "text-[#363A3D] cursor-not-allowed pointer-events-none",
              outside: "text-[#2D3035] pointer-events-none",
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
          <Popover.Arrow className="fill-[#1E2124]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
