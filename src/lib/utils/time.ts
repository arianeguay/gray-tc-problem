import type { Appointment } from "@/data/types";

/** Convertit "HH:mm" → minutes */
export function toMinutes(label: string): number {
  const [hStr, mStr] = label.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  return h * 60 + m;
}

/** Convertit minutes → "HH:mm" */
export function minutesToLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Calcule l'heure de fin ("HH:mm") */
export function computeEnd(appt: Appointment): string {
  const startMins = toMinutes(appt.scheduled_time);
  const endMins = startMins + appt.duration;
  return minutesToLabel(endMins);
}
