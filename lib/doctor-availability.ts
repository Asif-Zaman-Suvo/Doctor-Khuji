/** Weekday from YYYY-MM-DD in the user's local calendar (avoids UTC shift). */
export function weekdayFromDateInput(isoDate: string): string {
  const parts = isoDate.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long" });
}

const FULL_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Map DB strings like "Monday", "Mon", "mon" to full lowercase weekday. */
export function normalizeDayToken(day: string): string | null {
  const raw = day.trim().toLowerCase();
  if (!raw) return null;

  const exact = FULL_DAYS.find((x) => x === raw);
  if (exact) return exact;

  const three: Record<string, (typeof FULL_DAYS)[number]> = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
  };
  if (raw.length === 3 && three[raw]) return three[raw];

  const byPrefix = FULL_DAYS.filter((x) => x.startsWith(raw));
  if (byPrefix.length === 1) return byPrefix[0];

  return null;
}

/** True if isoDate falls on one of the doctor's availableDays (empty = any day). */
export function isDateOnAvailableDay(
  isoDate: string,
  availableDays: string[] | null | undefined
): boolean {
  if (!availableDays || availableDays.length === 0) return true;

  const weekday = weekdayFromDateInput(isoDate).toLowerCase();
  if (!weekday) return false;

  return availableDays.some((ad) => normalizeDayToken(ad) === weekday);
}

export function formatAvailableDaysHint(availableDays: string[]): string {
  return availableDays.join(", ");
}
