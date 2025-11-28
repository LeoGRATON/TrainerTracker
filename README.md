# TriZone - Application de Gestion d'Entraînement

Application de gestion d'entraînement sportif avec calcul automatique des zones d'entraînement pour le triathlon (course, vélo, natation).

## Stack Technique

### Frontend
- **Framework**: Next.js 15 avec App Router
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Authentification**: Supabase Auth
- **Langage**: TypeScript

### Backend
- **Framework**: Express.js
- **Langage**: TypeScript
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Validation**: Zod

## Structure du Projet

```
TrainerTracker/
├── frontend/           # Application Next.js
│   ├── app/           # Pages et layouts (App Router)
│   ├── components/    # Composants React
│   │   └── ui/       # Composants shadcn/ui
│   ├── lib/          # Utilitaires et configurations
│   ├── stores/       # Stores Zustand
│   ├── types/        # Types TypeScript
│   └── hooks/        # Hooks React personnalisés
│
├── backend/           # API Express
│   └── src/
│       ├── config/       # Configuration (Supabase, etc.)
│       ├── middleware/   # Middlewares Express
│       ├── routes/       # Routes API
│       ├── controllers/  # Contrôleurs
│       ├── services/     # Logique métier
│       ├── types/        # Types TypeScript
│       └── utils/        # Utilitaires
│
└── ROADMAP_TRIZONE_MVP.md  # Roadmap détaillée
```

## Installation

### Prérequis
- Node.js 18+ et npm
- Un compte Supabase (gratuit)

### 1. Installation des dépendances

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 2. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer les clés API dans Settings > API
3. Copier les fichiers d'exemple et remplir les variables :

#### Frontend
```bash
cd frontend
cp .env.example .env.local
```

Éditer `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend
```bash
cd backend
cp .env.example .env
```

Éditer `.env` :
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_KEY=votre_service_role_key
FRONTEND_URL=http://localhost:3000
```

### 3. Configuration de la base de données

Créer les tables dans Supabase en exécutant les scripts SQL suivants :

#### Table profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  age INTEGER,
  weight NUMERIC,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Table metrics
```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('running', 'cycling', 'swimming')),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('vma', 'ftp', 'css')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  test_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own metrics" ON metrics
  FOR ALL USING (auth.uid() = user_id);
```

#### Table zones
```sql
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('running', 'cycling', 'swimming')),
  zone_number INTEGER NOT NULL CHECK (zone_number BETWEEN 1 AND 5),
  zone_name TEXT NOT NULL,
  min_value NUMERIC NOT NULL,
  max_value NUMERIC NOT NULL,
  percentage_min NUMERIC NOT NULL,
  percentage_max NUMERIC NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, discipline, zone_number)
);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own zones" ON zones
  FOR ALL USING (auth.uid() = user_id);
```

### 4. Installation des composants shadcn/ui

```bash
cd frontend
npx shadcn@latest init
```

Installer les composants de base :
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add toast
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add dialog
```

## Démarrage

### Mode développement

#### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

#### Terminal 2 - Backend
```bash
cd backend
npm run dev
```
L'API sera accessible sur [http://localhost:3001](http://localhost:3001)

### Vérification

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Health: [http://localhost:3001/health](http://localhost:3001/health)
- Backend API Info: [http://localhost:3001/api](http://localhost:3001/api)

## Commandes disponibles

### Frontend
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run start    # Démarrage du build de production
npm run lint     # Linter
```

### Backend
```bash
npm run dev      # Démarrage en mode développement (avec watch)
npm run build    # Compilation TypeScript
npm run start    # Démarrage du build de production
npm run lint     # Linter
```

## Fonctionnalités (MVP)

### Phase 1 - Fondations ✅
- [x] Configuration projet Frontend & Backend
- [x] Configuration Supabase
- [x] Configuration shadcn/ui
- [ ] Authentification (Email/Password + OAuth Strava)
- [ ] Dashboard de base
- [ ] Gestion du profil

### Phase 2 - Calcul des Zones
- [ ] Saisie et calcul VMA (course)
- [ ] Saisie et calcul FTP (vélo)
- [ ] Saisie et calcul CSS (natation)
- [ ] Affichage des 5 zones par discipline

### Phase 3 - Gestion des Séances
- [ ] CRUD séances d'entraînement
- [ ] Builder de blocs d'entraînement
- [ ] Association des zones aux blocs

### Phase 4 - Calendrier
- [ ] Vue calendrier mensuel
- [ ] Planification des séances
- [ ] Plans d'entraînement prédéfinis

### Phase 5 - Polish
- [ ] Notifications et feedbacks
- [ ] Responsive mobile
- [ ] Déploiement

## Technologies et bibliothèques

### Frontend
- `next`: Framework React
- `react` & `react-dom`: Bibliothèque React
- `@supabase/supabase-js`: Client Supabase
- `zustand`: State management
- `tailwindcss`: CSS utility-first
- `lucide-react`: Icônes
- `class-variance-authority`: Gestion des variants
- `clsx` & `tailwind-merge`: Utilitaires CSS

### Backend
- `express`: Framework web
- `@supabase/supabase-js`: Client Supabase
- `cors`: Gestion CORS
- `dotenv`: Variables d'environnement
- `zod`: Validation de données
- `express-rate-limit`: Rate limiting
- `typescript`: Langage typé

## Contribution

Ce projet suit la roadmap définie dans [ROADMAP_TRIZONE_MVP.md](./ROADMAP_TRIZONE_MVP.md).

## Licence

ISC

---

**Bon développement ! 🚀**
