import type { Activity, Appointment, Cluster, Resource } from "@/data/types";

/**
 * readDataJson<T>
 * Charge un fichier JSON depuis src/data avec Vite (import.meta.glob).
 * Usage: await readDataJson<Resource[]>('resources.json')
 */
export async function readDataJson<T>(fileName: string): Promise<T[]> {
  const modules = import.meta.glob("../data/*.json", { import: "default" }) as Record<
    string,
    () => Promise<T[]>
  >;
  const key = `../data/${fileName}`;
  const loader = modules[key];
  if (!loader) {
    throw new Error(`Data file not found in /src/data: ${fileName}`);
  }
  return loader();
}


export const fetchClusters = async (): Promise<Cluster[]> => {
  const data = await readDataJson<Cluster>("clusters.json");

  return data;
};

export const fetchActivities = async (): Promise<Activity[]> => {
  const data = await readDataJson<Activity>("activities.json");

  return data;
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const data = await readDataJson<Appointment>("appointments.json");

  return data;
};

export const fetchMockMovedAppointments = async (): Promise<Appointment[]> => {
  const data = await readDataJson<Appointment>("mock-moved-appointments.json");

  return data;
};

export const fetchResources = async (): Promise<Resource[]> => {
  const data = await readDataJson<Resource>("resources.json");

  return data;
};
