# 🗺️ ROADMAP TRIZONE - MVP

## 📋 Stack Tech Confirmée
- **Front**: Next.js + **shadcn/ui** + Zustand
- **Back**: Express + TypeScript
- **BDD**: Supabase (PostgreSQL + Auth)
- **Auth**: Supabase Auth (Email/Password + OAuth Strava)
- **UI**: **shadcn/ui** (composants + Tailwind CSS)

---

## 🎨 COMPOSANTS SHADCN/UI À INSTALLER

### Installation initiale
```bash
npx shadcn-ui@latest init
```

### Composants nécessaires pour le MVP
```bash
# Auth & Forms
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label

# Layout & Navigation
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu

# Feedback
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress

# Modales & Overlays
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add popover

# Data Display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group

# Navigation
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add command

# Utilitaires
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add skeleton
```

---

## 🎯 PHASE 1 : FONDATIONS (Semaine 1-2)

### Semaine 1 : Setup & Auth

#### Backend
- ✅ Init projet Express + TypeScript
- ✅ Config Supabase (connexion DB + Auth)
- ✅ Middleware d'authentification
- ✅ Routes auth : signup, login, logout, OAuth Strava
- ✅ Gestion des erreurs globale

#### Frontend
- ✅ Init Next.js + **shadcn/ui**
- ✅ Config Supabase client
- ✅ Store Zustand pour l'auth
- ✅ **Pages login/signup avec shadcn Form + Input + Button**
- ✅ **Bouton "Se connecter avec Strava" (Button variant)**
- ✅ Protected routes (middleware)
- ✅ **Layout de base avec shadcn (Sidebar + Header + Separator)**
- ✅ **Toast pour notifications auth**

**Composants shadcn utilisés :**
- `Button`, `Input`, `Form`, `Label`, `Card`, `Toast`

#### Base de données
- ✅ Table `profiles`
- ✅ Table `metrics` (VMA/FTP/CSS)
- ✅ RLS (Row Level Security) Supabase

---

### Semaine 2 : Dashboard & Profil

#### Backend
- ✅ Routes profil : GET, PUT
- ✅ Routes métriques : GET, POST, PUT

#### Frontend
- ✅ **Page Dashboard avec Cards shadcn**
- ✅ **Sidebar avec Navigation Menu**
- ✅ **Header avec Avatar + Dropdown Menu**
- ✅ Page Profil
- ✅ **Formulaire édition profil (Form + Input + Select)**
- ✅ Affichage métriques actuelles (VMA/FTP/CSS)

**Dashboard v1 (simple)**
- **3 Cards shadcn** : Séances cette semaine, Total km, Prochaine séance
- Message de bienvenue personnalisé
- **Badge** pour statuts

**Composants shadcn utilisés :**
- `Card`, `Avatar`, `Dropdown Menu`, `Navigation Menu`, `Form`, `Select`, `Badge`

---

## 🎯 PHASE 2 : CALCUL DES ZONES (Semaine 3)

### Semaine 3 : Zones d'entraînement

#### Backend
- ✅ Table `zones` en BDD
- ✅ Routes zones : GET (par discipline)
- ✅ Endpoint calcul automatique des zones
- ✅ Logique de calcul :
  - Course (VMA) : 5 zones
  - Vélo (FTP) : 5 zones
  - Natation (CSS) : 5 zones

#### Frontend
- ✅ Page `/zones`
- ✅ **Tabs shadcn** : Course | Vélo | Natation
- ✅ **Formulaire saisie/calcul VMA (Form + Input + Button)**
- ✅ Formulaire saisie FTP
- ✅ Formulaire saisie CSS
- ✅ **Affichage tableau zones avec Table shadcn**
- ✅ **Barres colorées pour chaque zone (Progress)**
- ✅ **Badge pour numéro de zone**
- ✅ Détails : plage valeurs, %, allure, description

**Composants utilisés :**
- **Card récap métriques (éditable avec Dialog)**
- **Table shadcn** pour zones avec code couleur
- **Calculateur VMA (Form + Input + Select pour distance)**
- `Tabs`, `Table`, `Progress`, `Badge`, `Dialog`, `Form`, `Input`, `Button`

---

## 🎯 PHASE 3 : GESTION DES SÉANCES (Semaine 4-5)

### Semaine 4 : CRUD Séances

#### Backend
- ✅ Table `workouts` en BDD
- ✅ Table `workout_blocks` (structure des séances)
- ✅ Routes workouts :
  - GET all (avec filtres : discipline, statut, date)
  - GET by ID
  - POST create
  - PUT update
  - DELETE

#### Frontend
- ✅ Page `/workouts` (liste)
- ✅ **Filtres avec Select + Badge shadcn** : Toutes | À venir | Complétées | Discipline
- ✅ **Cards shadcn pour chaque séance** :
  - **Badge discipline** (couleur custom)
  - Date/heure
  - Titre
  - Durée/distance
  - **Zones ciblées (Badge colorés)**
  - **Actions : Dropdown Menu (Voir | Modifier | Dupliquer | Supprimer)**

**Composants shadcn utilisés :**
- `Card`, `Badge`, `Select`, `Dropdown Menu`, `Button`, `Separator`

---

### Semaine 5 : Création/Édition Séances

#### Frontend
- ✅ **Dialog shadcn pour création de séance**
- ✅ **Formulaire Form shadcn** :
  - Infos de base (Input, Select, Calendar pour date)
  - **Builder de blocs avec Accordion ou Cards**
  - **Sélection zones par bloc (Select + Popover pour preview)**
  - Durée/distance par bloc (Input)
- ✅ **Aperçu en temps réel (Card + Progress)**
- ✅ Page détail séance `/workouts/[id]`
- ✅ **Timeline verticale avec Separator**
- ✅ **Fonction dupliquer (Dialog confirmation)**

**Composants shadcn utilisés :**
- `Dialog`, `Form`, `Input`, `Select`, `Calendar`, `Accordion`, `Card`, `Popover`, `Badge`, `Progress`, `Separator`, `Button`

---

## 🎯 PHASE 4 : CALENDRIER & PLANIFICATION (Semaine 6-7)

### Semaine 6 : Calendrier

#### Backend
- ✅ Table `training_plans`
- ✅ Routes plans : GET, POST, PUT, DELETE
- ✅ Endpoint : lier séances à un plan

#### Frontend
- ✅ Page `/calendar`
- ✅ **Composant Calendar shadcn (customisé pour vue mensuelle)**
- ✅ Affichage des séances sur le calendrier
- ✅ **Badge coloré par discipline**
- ✅ **Click sur un jour → Dialog création séance (pré-remplie avec la date)**
- ✅ **Drag & drop pour déplacer une séance (optionnel)**
- ✅ **Popover pour détails rapides au hover**

**Composants shadcn utilisés :**
- `Calendar`, `Dialog`, `Badge`, `Popover`, `Card`, `Button`, `Sheet` (sidebar pour détails)

---

### Semaine 7 : Plans d'entraînement

#### Frontend
- ✅ Page `/plans` (liste des plans)
- ✅ **Grille de Cards shadcn** pour plans prédéfinis
- ✅ **Filtres avec Select** : Distance, Niveau, Durée
- ✅ **Badge "Premium"** si applicable
- ✅ Détail d'un plan : `/plans/[id]`
- ✅ **Vue semaine par semaine avec Accordion shadcn**
- ✅ **Bouton "Démarrer ce plan" (Button + Dialog confirmation)**
- ✅ Import séances dans calendrier

#### Backend
- ✅ Endpoint : générer/importer séances d'un plan
- ✅ Logique : créer toutes les séances du plan à partir de la date de début

**Composants shadcn utilisés :**
- `Card`, `Badge`, `Select`, `Accordion`, `Button`, `Dialog`, `Progress` (progression du plan)

---

## 🎯 PHASE 5 : POLISH & DÉPLOIEMENT (Semaine 8)

### Semaine 8 : Finitions MVP

#### Frontend
- ✅ **Dashboard v2** : enrichir avec données réelles
  - Stats séances/semaine dans **Cards**
  - **Graphique simple volume** (custom ou recharts avec shadcn styling)
  - **Cards pour prochaines séances**
- ✅ Navigation fluide entre toutes les pages
- ✅ **Toast notifications** (succès/erreur) partout
- ✅ **États vide avec Alert ou Card** ("Pas encore de séances", etc.)
- ✅ **Responsive mobile** (shadcn est responsive par défaut)
- ✅ **Loading states avec Skeleton shadcn**

#### Backend
- ✅ Tests basiques des endpoints
- ✅ Validation des données (zod ou joi)
- ✅ Rate limiting
- ✅ Logs propres

#### Déploiement
- ✅ Front : Vercel
- ✅ Back : Railway / Render
- ✅ Supabase : déjà hébergé
- ✅ Variables d'env configurées
- ✅ CORS configuré

**Composants shadcn pour polish :**
- `Skeleton`, `Alert`, `Toast`, `Progress`, `Scroll Area`

---

## 📦 LIVRABLES MVP (Fin Semaine 8)

✅ **Auth** : Email/Password + Strava OAuth *(Button, Form, Input, Toast)*  
✅ **Dashboard** : Vue d'ensemble personnalisée *(Cards, Badge, Avatar, Dropdown)*  
✅ **Zones** : Calcul auto VMA/FTP/CSS + tableau *(Tabs, Table, Progress, Badge, Dialog)*  
✅ **Séances** : CRUD complet + modale *(Dialog, Form, Accordion, Calendar, Select)*  
✅ **Calendrier** : Vue mensuelle + ajout séance *(Calendar, Dialog, Popover, Badge)*  
✅ **Plans** : Liste + import *(Cards, Accordion, Badge, Select, Dialog)*  

---

## 🚀 PHASE 6 : POST-MVP (À planifier après)

### Features V2
- **Analytics** :
  - Graphiques progression (volume, métriques)
  - Répartition par zones
  - Historique tests
  - *Composants : Cards, Charts (recharts), Tabs, Select*
  
- **Intégrations** :
  - Strava : import séances automatique
  - Garmin : export séances vers montre
  - Création séances complexes compatibles Garmin
  - *Composants : Dialog, Form, Badge, Alert, Toast*

- **Optimisations** :
  - Mode coach (gestion multi-athlètes)
  - Templates de séances
  - Export PDF/ICS
  - Notifications email
  - App mobile (React Native ou PWA)
  - *Composants : Table, Dropdown Menu, Command, Sheet*

---

## 📊 Schéma Base de Données Complet

```
profiles (utilisateurs)
├── id (UUID, PK, ref auth.users)
├── email
├── first_name
├── age
├── weight
├── gender
├── created_at
└── updated_at

metrics (VMA/FTP/CSS avec historique)
├── id (UUID, PK)
├── user_id (FK → profiles)
├── discipline (running|cycling|swimming)
├── metric_type (vma|ftp|css)
├── value
├── unit
├── test_date
└── created_at

zones (5 zones x 3 disciplines, auto-calculées)
├── id (UUID, PK)
├── user_id (FK → profiles)
├── discipline
├── zone_number (1-5)
├── zone_name
├── min_value
├── max_value
├── percentage_min
├── percentage_max
├── description
├── color (hex)
├── created_at
└── updated_at

workouts (séances)
├── id (UUID, PK)
├── user_id (FK → profiles)
├── title
├── discipline
├── workout_type
├── scheduled_date
├── duration_minutes
├── distance_km
├── description
├── objective
├── status (planned|completed|cancelled|draft)
├── completed_at
├── created_at
└── updated_at

workout_blocks (structure des séances)
├── id (UUID, PK)
├── workout_id (FK → workouts)
├── block_order
├── block_type (warmup|main|recovery|cooldown)
├── duration_minutes
├── distance_km
├── zone_id (FK → zones)
├── repetitions
├── notes
└── created_at

training_plans (plans d'entraînement)
├── id (UUID, PK)
├── user_id (FK → profiles)
├── name
├── goal (Sprint|Olympic|Half|Ironman)
├── level (beginner|intermediate|advanced)
├── duration_weeks
├── start_date
├── end_date
├── is_active
├── created_at
└── updated_at
```

---

## 🎨 DESIGN SYSTEM SHADCN/UI

### Thème personnalisé TriZone
```css
/* tailwind.config.js - Variables CSS custom */
:root {
  --zone-1: 220 90% 56%; /* Bleu - Récupération */
  --zone-2: 142 71% 45%; /* Vert - Endurance */
  --zone-3: 48 96% 53%;  /* Jaune - Tempo */
  --zone-4: 25 95% 53%;  /* Orange - Seuil */
  --zone-5: 0 84% 60%;   /* Rouge - VO2max */
  
  --running: 142 71% 45%;   /* Vert */
  --cycling: 221 83% 53%;   /* Bleu */
  --swimming: 199 89% 48%;  /* Cyan */
}
```

### Composants custom à créer
- **ZoneBadge** : Badge avec couleur de zone
- **WorkoutCard** : Card séance avec toutes les infos
- **CalendarWorkout** : Mini carte séance pour calendrier
- **WorkoutBlockBuilder** : Builder de blocs d'entraînement
- **MetricDisplay** : Affichage métrique avec édition inline
- **DisciplineIcon** : Icônes CAP/Vélo/Nat (Lucide React)

---

## 📁 Structure des dossiers Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx (Sidebar + Header)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── zones/page.tsx
│   │   │   ├── workouts/
│   │   │   │   ├── page.tsx (liste)
│   │   │   │   └── [id]/page.tsx (détail)
│   │   │   ├── calendar/page.tsx
│   │   │   ├── plans/
│   │   │   │   ├── page.tsx (liste)
│   │   │   │   └── [id]/page.tsx (détail)
│   │   │   └── profile/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── NextWorkouts.tsx
│   │   │   └── QuickZones.tsx
│   │   ├── zones/
│   │   │   ├── ZoneTable.tsx
│   │   │   ├── ZoneBadge.tsx
│   │   │   ├── MetricForm.tsx
│   │   │   └── VMACalculator.tsx
│   │   ├── workouts/
│   │   │   ├── WorkoutCard.tsx
│   │   │   ├── WorkoutDialog.tsx
│   │   │   ├── WorkoutBlockBuilder.tsx
│   │   │   └── WorkoutTimeline.tsx
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   └── CalendarWorkoutCard.tsx
│   │   └── plans/
│   │       ├── PlanCard.tsx
│   │       └── PlanWeekAccordion.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── api.ts
│   │   └── utils.ts (shadcn cn() helper)
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── workoutStore.ts
│   │   └── zoneStore.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useWorkouts.ts
│       └── useZones.ts
└── package.json
```

---

## 📁 Structure des dossiers Backend

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── metrics.routes.ts
│   │   ├── zones.routes.ts
│   │   ├── workouts.routes.ts
│   │   └── plans.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── metrics.controller.ts
│   │   ├── zones.controller.ts
│   │   ├── workouts.controller.ts
│   │   └── plans.controller.ts
│   ├── services/
│   │   ├── zones.service.ts (logique calcul zones)
│   │   ├── metrics.service.ts
│   │   └── workouts.service.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── zoneCalculator.ts
│   │   └── validators.ts
│   └── server.ts
├── .env
├── tsconfig.json
└── package.json
```

---

## ✅ CHECKLIST FINALE MVP

### Auth & Profil
- [ ] Signup email/password
- [ ] Login email/password
- [ ] OAuth Strava
- [ ] Logout
- [ ] Page profil avec édition
- [ ] Protected routes

### Dashboard
- [ ] Message personnalisé
- [ ] 3 stats cards (séances, km, prochaine)
- [ ] Navigation sidebar
- [ ] Header avec avatar + menu

### Zones
- [ ] 3 tabs (CAP/Vélo/Nat)
- [ ] Formulaire saisie/calcul VMA
- [ ] Formulaire saisie FTP
- [ ] Formulaire saisie CSS
- [ ] Tableau 5 zones par discipline
- [ ] Barres colorées + descriptions

### Séances
- [ ] Liste séances avec filtres
- [ ] Cards séances avec badges
- [ ] Modale création séance
- [ ] Builder de blocs
- [ ] Page détail séance
- [ ] Timeline verticale
- [ ] Édition/suppression/duplication

### Calendrier
- [ ] Vue mensuelle
- [ ] Affichage séances sur dates
- [ ] Click jour → création séance
- [ ] Popover détails rapides

### Plans
- [ ] Liste plans prédéfinis
- [ ] Filtres (distance, niveau, durée)
- [ ] Page détail plan
- [ ] Accordion semaines
- [ ] Bouton import vers calendrier

### Polish
- [ ] Toasts notifications
- [ ] États vides
- [ ] Loading skeletons
- [ ] Responsive mobile
- [ ] Déploiement front + back

---

## 🎯 PRIORITÉS DE DEV

**Semaine 1-2** : Auth + Layout + Dashboard basique  
**Semaine 3** : Zones (cœur métier)  
**Semaine 4-5** : Séances (feature principale)  
**Semaine 6-7** : Calendrier + Plans  
**Semaine 8** : Polish + Déploiement  

---

## 🔗 Ressources utiles

- [shadcn/ui docs](https://ui.shadcn.com)
- [Next.js docs](https://nextjs.org/docs)
- [Supabase docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Bon dev ! 🚀**
