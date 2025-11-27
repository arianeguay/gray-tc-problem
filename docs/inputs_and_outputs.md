# Inputs & Outputs — GrayOS Scheduling Challenge

Ce document résume les données reçues (inputs) et les résultats attendus dans l’interface (outputs).  
L’objectif est de garder le scope simple, clair et contrôlé.

---

## 🟦 Inputs (données fournies)

### 1. Appointments — horaire actuel  
Fichier : `appointments.json`  
Contient :  
- `scheduled_time`  
- `duration`  
- `technique`  
- `location` (machine)  
- métadonnées diverses

### 2. Appointments — après optimisation  
Fichier : `mock-moved-appointments.json`  
Contient :  
- nouveaux horaires proposés  
- `state.moved` / `state.modified`  
- données nécessaires pour détecter les déplacements

### 3. Clusters (groupes de techniques)  
Fichier : `clusters.json`  
Contient :  
- liste des techniques appartenant au même cluster  
- couleur associée à chaque cluster

### 4. Activities (détails des techniques)  
Fichier : `activities.json`  
Contient :  
- nom  
- description  
- durée  
- catégorie  
- couleur

### 5. Resources (machines)  
Fichier : `resources.json`  
Contient :  
- liste des machines  
- heures d’ouverture  
- autres attributs pertinents

### 6. Types TypeScript  
Fichier : `types.ts`  
Définitions utilisées pour structurer les données.

---

## 🟩 Outputs (résultat attendu dans l’UI)

### 1. Comparaison claire AVANT / APRÈS  
- Deux vues côte à côte  
- Même structure visuelle pour faciliter la lecture

### 2. Visualisation des clusters  
- Couleur uniforme pour les rendez-vous appartenant au même cluster  
- Légende simple et lisible

### 3. Mise en évidence des rendez-vous déplacés  
- Bordure, badge, flèche ou autre indicateur minimal  
- Comparaison de l’heure “avant” vs “après”

### 4. Lecture temporelle simple  
- Grille horaire (type calendrier)  
- Position approximative en fonction du `scheduled_time`

### 5. UI minimaliste et centrée sur la compréhension  
- Focus sur la lisibilité (pas de styles complexes)  
- Hiérarchie visuelle sobre

### 6. Documentation des choix  
- README expliquant l’approche  
- Limitations et améliorations futures  
- Justification des simplifications

---

## 🎯 But du rendu

Livrer une interface :  
- **lisible**,  
- **stable**,  
- **simple à comparer**,  
- **axée sur la compréhension des clusters et des mouvements**.

Pas de complexité inutile.  
Pas de perfection visuelle.  
Juste une solution claire et explicable.
