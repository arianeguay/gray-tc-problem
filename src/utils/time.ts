import type { Appointment } from "@/data/types";

export function toMinutes(label: string): number {
  const [hStr, mStr] = label.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    throw new Error(`Invalid time label: ${label}`);
  }
  return h * 60 + m;
}

export function minutesToLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.abs(totalMinutes % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}`;
}

export function computeEnd(appt: Appointment): Date {
  const start = new Date(appt.scheduled_time);
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid scheduled_time: ${appt.scheduled_time}`);
  }
  const endMs = start.getTime() + appt.duration * 60_000;
  return new Date(endMs);
}
