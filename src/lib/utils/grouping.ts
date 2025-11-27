export function sortAppointmentsAsc<T extends { scheduled_time: string }>(
  list: T[]
): T[] {
  return [...list].sort((a, b) =>
    a.scheduled_time.localeCompare(b.scheduled_time)
  );
}

export function groupAppointmentsByMachine<
  T extends { location: string; scheduled_time: string }
>(appointments: T[]): Record<string, T[]> {
  const by: Record<string, T[]> = {};
  for (const appt of appointments) {
    (by[appt.location] ??= []).push(appt);
  }
  for (const key of Object.keys(by)) {
    by[key] = sortAppointmentsAsc(by[key]);
  }
  return by;
}