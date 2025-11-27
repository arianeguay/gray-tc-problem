import type {
  Appointment,
  Activity,
  Cluster,
  Resource,
  ClusterMeta,
  MachineSchedule,
  EnrichedAppointment,
  PreparedData,
} from "../data/types";
import {
  fetchActivities,
  fetchAppointments,
  fetchClusters,
  fetchMockMovedAppointments,
  fetchResources,
} from "./api";
import { buildTechniqueMaps as buildTechniqueMapsUtil } from "./utils/clustering";

/* ----------------------------------------------------------
 *  Technique maps (labels + cluster metadata)
 * -------------------------------------------------------- */
function buildTechniqueMaps(activities: Activity[], clusters: Cluster[]) {
  const { techniqueToLabel, techniqueToCluster } = buildTechniqueMapsUtil(
    activities,
    clusters
  );
  return { techniqueToLabel, techniqueToCluster };
}

/* ----------------------------------------------------------
 *  Enrichissement d’un rendez-vous
 * -------------------------------------------------------- */
function enrichAppointment(
  appt: Appointment,
  techniqueToLabel: Map<string, string>,
  techniqueToCluster: Map<string, ClusterMeta>
): EnrichedAppointment {
  const clusterMeta = techniqueToCluster.get(appt.technique);
  const labelFromMap = techniqueToLabel.get(appt.technique);

  const isMoved = appt.state?.moved === "moved";
  const isModified = appt.state?.modified === "modified";

  const techniqueLabel =
    (appt as any).technique_label || labelFromMap || appt.technique;

  return {
    ...appt,
    clusterMeta,
    techniqueLabel,
    isMoved,
    isModified,
  };
}

/* ----------------------------------------------------------
 *  Regroupe par machine → tri par heure
 * -------------------------------------------------------- */
function buildMachineSchedules(
  appointments: Appointment[],
  techniqueToLabel: Map<string, string>,
  techniqueToCluster: Map<string, ClusterMeta>,
  resources: Resource[]
): MachineSchedule[] {
  const resourceByName = new Map(resources.map((r) => [r.name, r]));

  const byLocation = new Map<string, EnrichedAppointment[]>();

  for (const appt of appointments) {
    const enriched = enrichAppointment(
      appt,
      techniqueToLabel,
      techniqueToCluster
    );
    const key = appt.location;

    if (!byLocation.has(key)) byLocation.set(key, []);
    byLocation.get(key)!.push(enriched);
  }

  const schedules: MachineSchedule[] = [];

  for (const [location, appts] of byLocation.entries()) {
    appts.sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));

    schedules.push({
      resource: resourceByName.get(location),
      location,
      appointments: appts,
    });
  }

  schedules.sort((a, b) => {
    const aName = a.resource?.pretty_name || a.location;
    const bName = b.resource?.pretty_name || b.location;
    return aName.localeCompare(bName);
  });

  return schedules;
}

/* ----------------------------------------------------------
 *  Fusion BEFORE + moved = AFTER complet
 * -------------------------------------------------------- */
function applyMovedAppointments(
  appointmentsBefore: Appointment[],
  movedAppointments: Appointment[]
): Appointment[] {
  const movedById = new Map<string, Appointment>(
    movedAppointments.map((a) => [a.id, a])
  );

  return appointmentsBefore.map((appt) => {
    const moved = movedById.get(appt.id);
    return moved ? { ...appt, ...moved } : appt;
  });
}

/* ----------------------------------------------------------
 *  Entrée principale
 * -------------------------------------------------------- */
export async function prepareData(): Promise<PreparedData> {
  const [clusters, activities, appointmentsBefore, movedAppointments, resources] =
    await Promise.all([
      fetchClusters(),
      fetchActivities(),
      fetchAppointments(),
      fetchMockMovedAppointments(),
      fetchResources(),
    ]);

  const appointmentsAfter = applyMovedAppointments(
    appointmentsBefore,
    movedAppointments
  );

  const { techniqueToLabel, techniqueToCluster } = buildTechniqueMaps(
    activities,
    clusters
  );

  const beforeSchedules = buildMachineSchedules(
    appointmentsBefore,
    techniqueToLabel,
    techniqueToCluster,
    resources
  );

  const afterSchedules = buildMachineSchedules(
    appointmentsAfter,
    techniqueToLabel,
    techniqueToCluster,
    resources
  );

  const clusterMetaList: ClusterMeta[] = clusters.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
  }));

  return {
    before: beforeSchedules,
    after: afterSchedules,
    clusters: clusterMetaList,
  };
}
