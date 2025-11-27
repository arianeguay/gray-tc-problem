# Architecture — GrayOS Scheduling Challenge

Ce document décrit la structure front-end choisie pour représenter :
- l’horaire avant optimisation,
- l’horaire après optimisation,
- les clusters,
- et les rendez-vous déplacés.

L’objectif : une architecture simple, lisible et facile à expliquer.

---

# 1. Organisation générale du code

```
src/
  components/
    ScheduleColumn/
    MachineSchedule/
    AppointmentBlock/
    ClusterLegend/
    SummaryPanel/       (optionnel)
  utils/
    time.ts
    clustering.ts
    grouping.ts
  data/
    appointments.json
    mock-moved-appointments.json
    clusters.json
    activities.json
    resources.json
  types/
    types.ts
  App.tsx
```

Chaque bloc a une responsabilité unique et explicite.

---

# 2. Structure des composants

## `App.tsx`
Le point d’entrée.  
Responsabilités :
- charger les données.
- préparer les données via un petit module prepareData.ts, combinant appointments, clusters, activities et resources.
- préparer les structures `before` et `after`,
- injecter les données dans les composants “colonne”.

---

## `ScheduleColumn`
Affiche l’une des deux vues :
- **Before** (horaire actuel)
- **After** (horaire optimisé)

Responsabilités :
- organiser les machines en colonnes verticales,
- mapper chaque machine vers un `MachineSchedule`.

---

## `MachineSchedule`
Représente la timeline d’une machine spécifique.

Responsabilités :
- afficher les rendez-vous de façon chronologique,
- positionner les blocs sur l’axe temporel,
- gérer les “gaps” (optionnel),
- déléguer l’affichage visuel à `AppointmentBlock`.

---

## `AppointmentBlock`
Le cœur visuel de l’interface.

Responsabilités :
- couleur selon le cluster,
- highlight si `moved` ou `modified`,
- afficher technique + heure,
- garder un visuel simple et lisible.
- support de la propriété state.moved pour afficher un highlight visuel dans la vue AFTER.

Propriétés typiques :
```ts
{
  appointment: Appointment
  clusterColor: string
  moved: boolean
}
```

---

## `ClusterLegend`
Simple légende affichant :
- la couleur associée à chaque cluster,
- le nom du cluster,
- éventuellement les techniques incluses.

Permet de réduire la charge cognitive.

---

## `SummaryPanel` (optionnel)
Petit panneau affichant :
- nombre de rendez-vous déplacés,
- nombre de clusters améliorés,
- ou autre métrique simple.

Permet de démontrer ta pensée analytique sans surcharger le scope.

---

# 3. Utilitaires

## `time.ts`
Utilitaires pour :
- parser les heures (`HH:mm` → minutes),
- calculer les positions verticales,
- formater les heures.

Exemples :
```ts
toMinutes("10:15") → 615
minutesToLabel(615) → "10:15"
```

---

## `clustering.ts`
Détection des clusters et couleurs :
- récupérer les clusters via `clusters.json`,
- créer un map `{technique → couleur}`,
- extraire la couleur dans `AppointmentBlock`.

---

## `grouping.ts`
Logique simple :
- groupement des rendez-vous par machine,
- tri croissant par horaire.

---

# 4. Logique des états

## États gérés :
- **normal**
- **moved** (highlight)
- **empty state** si une machine est vide
- **loading** très minimal (si nécessaire)

Pas de gestion avancée.  
Clarté > sophistication.

---

# 5. Flux de données (simplifié)

```
RAW JSON (before/after) 
   ↓ parse
group by machine
   ↓
sort by time
   ↓
map cluster colors
   ↓
render ScheduleColumn (before)
render ScheduleColumn (after)
```

Aucune magie : pipeline simple, lisible, déterministe.

---

# 6. Pourquoi cette architecture ?

- **Facile à expliquer** lors de l’entrevue finale.  
- **Découpage clair** par responsabilités.  
- **Lisible même sous stress** (critère clinique).  
- **Assez simple pour tenir dans le temps imparti.**  
- **Assez modulaire pour évoluer** vers des vues plus complètes (zoom, filtres, tooltip).

---

# 7. Améliorations futures (hors scope)

- timeline plus précise (minutes exactes),
- outils de navigation (zoom vertical),
- regroupement automatique par cluster,
- affichage des écarts de minutes (“+30 min”),
- animation lors du highlight des moves,
- export de scénario.

Ces pistes montrent l’évolutivité de la solution sans alourdir le rendu.
