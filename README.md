# Cabinet Médical - Prise de Rendez-vous

Application web de prise de rendez-vous pour un cabinet médical, développée avec Next.js 15, TypeScript et Tailwind CSS.

## 🚀 Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Prisma** - ORM pour la base de données
- **Neon** - PostgreSQL serverless
- **Zustand** - Gestion d'état
- **Zod** - Validation de schémas
- **React Hook Form** - Gestion de formulaires
- **GSAP** - Animations (à implémenter)
- **Better Auth** - Authentification (à implémenter)

## 📋 Fonctionnalités

### Côté Patient (Public)

- ✅ Formulaire multi-étapes inspiré de Medicalib
  - Étape 1 : Sélection du type de soin avec modales d'approfondissement
  - Étape 2 : Informations sur l'ordonnance
  - Étape 3 : Choix des disponibilités (date, heure, urgence, lieu)
  - Étape 4 : Informations patient avec validation Zod
  - Étape 5 : Récapitulatif et validation
- ✅ Page de confirmation
- ✅ API REST pour créer les demandes

### Côté Cabinet (À venir)

- ⏳ Dashboard avec tableau Kanban des demandes
- ⏳ Authentification avec Better Auth
- ⏳ Vue détaillée des patients
- ⏳ Gestion des demandes (statut, notes, etc.)
- ⏳ Calendrier des rendez-vous

## 🛠️ Installation

### Prérequis

- Node.js 18+
- npm ou pnpm
- Un compte Neon (PostgreSQL) : https://neon.tech

### Étapes

1. **Installer les dépendances**

```bash
npm install
```

2. **Installer les dépendances additionnelles**

```bash
npm install prisma @prisma/client
npm install @neondatabase/serverless
npm install zustand
npm install zod
npm install react-hook-form @hookform/resolvers
npm install gsap
npm install better-auth
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

3. **Configurer la base de données**

Créez un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

Remplacez par votre URL de connexion Neon.

4. **Générer le client Prisma**

```bash
npx prisma generate
```

5. **Créer les tables dans la base de données**

```bash
npx prisma db push
```

6. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
cabinet-medical/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── demandes/
│   │   │       └── route.ts   # API pour créer/lister les demandes
│   │   ├── demande/           # Formulaire multi-étapes
│   │   │   ├── soins/
│   │   │   ├── ordonnance/
│   │   │   ├── disponibilites/
│   │   │   ├── patient/
│   │   │   ├── recapitulatif/
│   │   │   └── confirmation/
│   │   └── page.tsx           # Page d'accueil
│   ├── components/
│   │   └── ui/                # Composants réutilisables
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   └── prisma.ts          # Client Prisma
│   └── store/
│       └── demandeStore.ts    # Store Zustand
```

## 🗄️ Modèle de données

### Patient

- Nom, prénom
- Email, téléphone
- Date de naissance
- Adresse complète
- Numéro de sécurité sociale

### Demande

- Type de soin + détails JSON
- Ordonnance (oui/non + détails)
- Disponibilités (date, heure, urgence)
- Lieu de l'intervention
- Statut (EN_ATTENTE, CONFIRMEE, EN_COURS, TERMINEE, ANNULEE)

## 🎨 Personnalisation

### Modifier les types de soins

Éditez le fichier `src/app/demande/soins/page.tsx` pour ajouter/modifier les types de soins disponibles.

### Modifier les couleurs

Tailwind CSS est configuré. Vous pouvez personnaliser les couleurs dans `tailwind.config.ts`.

## 📝 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Prisma
npx prisma studio          # Interface visuelle de la BDD
npx prisma db push         # Synchroniser le schéma
npx prisma generate        # Générer le client Prisma
npx prisma migrate dev     # Créer une migration

# Linter
npm run lint
```

## 🔜 Prochaines étapes

1. **Dashboard Cabinet (Kanban)**

   - Authentification avec Better Auth
   - Vue Kanban avec drag & drop (@dnd-kit)
   - Filtres et recherche
   - Détails des demandes en modal

2. **Animations GSAP**

   - Transitions entre les étapes
   - Animations d'entrée des cards
   - Effets de survol

3. **Notifications**

   - Email de confirmation (react-email)
   - Notifications temps réel

4. **Optimisations**
   - Images optimisées
   - SEO
   - Performance

## 📄 Licence

MIT

## 👤 Auteur

Cabinet Médical
