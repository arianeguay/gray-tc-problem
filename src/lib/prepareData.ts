// src/utils/prepareData.ts

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
import { buildTechniqueMaps as buildTechniqueMapsUtil } from "../utils/clustering";

/**
 * Construit les maps nécessaires à partir des activities et des clusters :
 * - technique → label humain
 * - technique → meta de cluster (nom, couleur)
 */
function buildTechniqueMaps(activities: Activity[], clusters: Cluster[]) {
  const { techniqueToLabel, techniqueToCluster } = buildTechniqueMapsUtil(
    activities,
    clusters
  );
  return { techniqueToLabel, techniqueToCluster };
}

/**
 * Enrichit un rendez-vous avec :
 * - clusterMeta (si applicable)
 * - techniqueLabel
 * - flags isMoved / isModified
 */
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
    // certains rendez-vous optimisés ont déjà un `technique_label`
    (appt as any).technique_label || labelFromMap || appt.technique;

  return {
    ...appt,
    clusterMeta,
    techniqueLabel,
    isMoved,
    isModified,
  };
}

/**
 * Regroupe les rendez-vous enrichis par machine (location)
 * et les trie par heure de rendez-vous.
 */
function buildMachineSchedules(
  appointments: Appointment[],
  techniqueToLabel: Map<string, string>,
  techniqueToCluster: Map<string, ClusterMeta>,
  resources: Resource[]
): MachineSchedule[] {
  const resourceByName = new Map<string, Resource>();
  for (const res of resources) {
    resourceByName.set(res.name, res);
  }

  const byLocation = new Map<string, EnrichedAppointment[]>();

  for (const appt of appointments) {
    const enriched = enrichAppointment(
      appt,
      techniqueToLabel,
      techniqueToCluster
    );
    const key = appt.location;

    if (!byLocation.has(key)) {
      byLocation.set(key, []);
    }
    byLocation.get(key)!.push(enriched);
  }

  const schedules: MachineSchedule[] = [];

  for (const [location, appts] of byLocation.entries()) {
    // Tri simple par horaire
    appts.sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));

    const resource = resourceByName.get(location);

    schedules.push({
      resource,
      location,
      appointments: appts,
    });
  }

  // Option : trier les machines par nom “pretty_name” ou par location
  schedules.sort((a, b) => {
    const aName = a.resource?.pretty_name || a.location;
    const bName = b.resource?.pretty_name || b.location;
    return aName.localeCompare(bName);
  });

  return schedules;
}

/**
 * Prépare toutes les données nécessaires à l’UI de comparaison
 * AVANT / APRÈS clustering.
 *
 * Cette fonction est volontairement simple et déterministe :
 * - pas d’accès réseau
 * - pas de state global
 * - pure transformation de données
 */
export async function prepareData(): Promise<PreparedData> {
  const clusters = await fetchClusters();
  const activities = await fetchActivities();
  const appointmentsBefore = await fetchAppointments();
  const appointmentsAfter = await fetchMockMovedAppointments();
  const resources = await fetchResources();

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

  // On expose aussi la liste des clusters pour la légende
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
