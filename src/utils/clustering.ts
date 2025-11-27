import type { Activity, Cluster, ClusterMeta } from "@/data/types";

export function makeTechniqueColorMap(clusters: Cluster[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of clusters) {
    for (const tech of c.activities) {
      map.set(tech, c.color);
    }
  }
  return map;
}

export function makeTechniqueLabelMap(
  activities: Activity[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const a of activities) {
    if (a.technique) {
      map.set(a.technique, a.description || a.technique);
    }
  }
  return map;
}

export function makeTechniqueToClusterMap(
  clusters: Cluster[]
): Map<string, ClusterMeta> {
  const map = new Map<string, ClusterMeta>();
  for (const c of clusters) {
    const meta: ClusterMeta = { id: c.id, name: c.name, color: c.color };
    for (const tech of c.activities) {
      map.set(tech, meta);
    }
  }
  return map;
}

export function buildTechniqueMaps(
  activities: Activity[],
  clusters: Cluster[]
): {
  techniqueToLabel: Map<string, string>;
  techniqueToCluster: Map<string, ClusterMeta>;
  techniqueToColor: Map<string, string>;
} {
  const techniqueToLabel = makeTechniqueLabelMap(activities);
  const techniqueToCluster = makeTechniqueToClusterMap(clusters);
  const techniqueToColor = makeTechniqueColorMap(clusters);
  return { techniqueToLabel, techniqueToCluster, techniqueToColor };
}
