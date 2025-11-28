# Guide de Démarrage Rapide - TriZone

## Installation rapide (5 minutes)

### 1. Installer les dépendances

```bash
# À la racine du projet
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Retour à la racine
cd ..
```

Ou utilisez le script global :

```bash
npm run install:all
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Aller dans **Settings** > **API**
3. Copier :
   - Project URL
   - anon/public key
   - service_role key (secret)

### 3. Configurer les variables d'environnement

#### Frontend

```bash
cd frontend
cp .env.example .env.local
```

Éditer `frontend/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend

```bash
cd backend
cp .env.example .env
```

Éditer `backend/.env` :

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://votre-project.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_KEY=votre_service_role_key
FRONTEND_URL=http://localhost:3000
```

### 4. Initialiser la base de données

1. Ouvrir Supabase Dashboard
2. Aller dans **SQL Editor**
3. Copier le contenu de `database/init.sql`
4. Exécuter le script

### 5. Installer shadcn/ui

```bash
cd frontend

# Installer les composants de base
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add toast
npx shadcn@latest add tabs
npx shadcn@latest add table
```

### 6. Lancer l'application

Ouvrir **2 terminaux** :

#### Terminal 1 - Frontend

```bash
cd frontend
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

#### Terminal 2 - Backend

```bash
cd backend
npm run dev
```

→ [http://localhost:3001](http://localhost:3001)

**Ou utilisez le script global** (depuis la racine) :

```bash
npm run dev
```

### 7. Vérifier que tout fonctionne

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend Health** : [http://localhost:3001/health](http://localhost:3001/health)
- **Backend API** : [http://localhost:3001/api](http://localhost:3001/api)

## Commandes utiles

```bash

# Démarrer seulement le frontend
npm run dev:frontend

# Démarrer seulement le backend
npm run dev:backend

# Build pour production
npm run build

# Nettoyer tous les node_modules et builds
npm run clean
```

## Structure créée

```
TrainerTracker/
├── frontend/              # Next.js + shadcn/ui
│   ├── app/              # Pages et layouts
│   ├── components/       # Composants React
│   │   └── ui/          # Composants shadcn/ui
│   ├── lib/             # Utilitaires (Supabase, etc.)
│   ├── stores/          # Stores Zustand
│   ├── types/           # Types TypeScript
│   └── hooks/           # Hooks React
│
├── backend/              # Express + TypeScript
│   └── src/
│       ├── config/      # Configuration (Supabase)
│       ├── middleware/  # Auth, errorHandler
│       ├── routes/      # Routes API
│       ├── controllers/ # Contrôleurs
│       ├── services/    # Logique métier
│       ├── types/       # Types TypeScript
│       └── utils/       # Utilitaires
│
├── database/            # Scripts SQL
│   └── init.sql        # Initialisation Supabase
│
├── README.md           # Documentation complète
├── ROADMAP_TRIZONE_MVP.md  # Roadmap détaillée
└── QUICKSTART.md       # Ce guide
```

## Prochaines étapes

Consultez [ROADMAP_TRIZONE_MVP.md](./ROADMAP_TRIZONE_MVP.md) pour voir le plan de développement complet.

**Phase 1 (Semaines 1-2)** : Auth & Dashboard

- Implémenter l'authentification
- Créer le layout avec sidebar
- Page de profil

**Phase 2 (Semaine 3)** : Calcul des zones

- Formulaires VMA/FTP/CSS
- Calcul automatique des 5 zones
- Tableaux d'affichage

**Phase 3 (Semaines 4-5)** : Gestion des séances

- CRUD séances
- Builder de blocs d'entraînement
- Association aux zones

## Aide

- [README complet](./README.md)
- [Roadmap détaillée](./ROADMAP_TRIZONE_MVP.md)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com)
- [Documentation Supabase](https://supabase.com/docs)

---

**Bon développement ! 🚀**
