import type { EnrichedAppointment } from "@/data/types";

export function getAppointmentsMovedCount(
  appointments: EnrichedAppointment[]
): number {
  return appointments.filter((a) => a.isMoved).length;
}
