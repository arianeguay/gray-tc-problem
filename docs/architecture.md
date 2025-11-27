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
    scheduling-clusters/
      ComparisonByMachine.tsx
      GlobalDiffSummary.tsx
      Legend.tsx
      MachineCalendar.tsx
      MachineScheduleColumn.tsx
      SchedulesRow.tsx
    ui/
      button.tsx …
  lib/
    prepareData.ts
    utils/
      color.ts          (textColorForBackground)
      clustering.ts
      grouping.ts
      time.ts
  views/
    AllMachines.tsx
    SingleMachineView.tsx
  data/
    appointments.json
    clusters.json
    activities.json
    resources.json
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
- gérer les états `loading` / `error` minimalistes (fallbacks centrés).

---

## `SchedulesRow`
Affiche l’une des deux vues :
- **Before** (horaire actuel)
- **After** (horaire optimisé)

Responsabilités :
- organiser les machines en colonnes verticales,
- mapper chaque machine vers un `MachineSchedule`.
- afficher la `Legend` au‑dessus de la grille.

---

## `MachineScheduleColumn`
Représente la timeline d’une machine spécifique.

Responsabilités :
- afficher les rendez-vous de façon chronologique,
- positionner les blocs sur l’axe temporel,
- gérer les “gaps” (optionnel),
- déléguer l’affichage visuel à `MachineCalendar`.
- propager le filtre `onlyMoved` vers les calendriers.
- masquer la colonne "Before" quand `onlyMoved` est actif (pour une lecture plus directe du "After").

---

## `MachineCalendar`
Le cœur visuel de l’interface (rendu FullCalendar).

Responsabilités :
- couleur selon le cluster,
- highlight si `moved` dans la vue `After` (accent gauche + ring blancs subtils),
- afficher technique + heure,
- garder un visuel simple et lisible.
- support du filtre `onlyMoved` (filtrage à la source des events).
- calcul de contraste via `textColorForBackground` (lib/utils/color.ts) pour sélectionner noir/blanc selon la couleur de fond.

Propriétés typiques :
```ts
{
  appointment: Appointment
  clusterColor: string
  moved: boolean
}
```

---

## `GlobalDiffSummary`
Petit module contextuel affichant :
- "X appointments moved on <Machine>", pour chaque machine,
- "Total moved today: <Total>",
- et le toggle global "Show only moved" (propagé à la grille).

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

## `color.ts`
Fonctions de couleur :
- `textColorForBackground(hex)`: renvoie `#111827` (noir) ou `#ffffff` (blanc) selon la luminance (YIQ).

---

# 4. Logique des états

## États gérés :
- **normal**
- **moved** (highlight)
- **empty state** si une machine est vide
- **loading**/**error** (fallbacks minimalistes dans `App`)

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
