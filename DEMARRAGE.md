# 🚀 Guide de Démarrage Rapide

## Étapes pour lancer le projet

### 1. Configuration de la base de données Neon

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet PostgreSQL
3. Copiez l'URL de connexion (Connection String)

### 2. Configuration de l'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="votre-url-neon-ici"
```

### 3. Initialisation de Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Synchroniser le schéma avec la base de données
npx prisma db push
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Tester l'application

### Formulaire de demande

1. Visitez `/demande/soins`
2. Sélectionnez un type de soin (ex: Pansement)
3. Remplissez les détails dans la modale
4. Suivez les 4 étapes du formulaire
5. Validez votre demande

### Visualiser la base de données

```bash
npx prisma studio
```

Cela ouvre une interface web pour voir vos données.

---

## 📝 Prochaines étapes du développement

### Dashboard Cabinet (À faire)

Le dashboard avec vue Kanban sera dans `src/app/dashboard/`.

Structure recommandée :

```
src/app/dashboard/
├── page.tsx              # Vue principale (Kanban)
├── layout.tsx            # Layout avec auth
└── components/
    ├── KanbanBoard.tsx   # Board avec @dnd-kit
    ├── DemandeCard.tsx   # Card draggable
    └── DemandeModal.tsx  # Détails de la demande
```

### Authentification Better Auth

Pour protéger le dashboard :

1. Installer Better Auth
2. Créer les routes d'auth
3. Protéger `/dashboard` avec middleware

### Animations GSAP

Idées d'animations :

- Transitions entre étapes du formulaire
- Entrée des cards de soins
- Drag & drop du Kanban
- Modal open/close

---

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur

# Prisma
npx prisma studio        # Interface visuelle BDD
npx prisma db push       # Synchroniser le schéma
npx prisma generate      # Générer le client

# Linting
npm run lint             # Vérifier le code

# Build
npm run build            # Build production
npm start                # Lancer en production
```

---

## 📊 Structure de la base de données

### Table Patient

- `id` (String)
- `nom`, `prenom` (String)
- `email` (unique)
- `telephone`
- `dateNaissance` (DateTime)
- `adresse`, `ville`, `codePostal` (optional)

### Table Demande

- `id` (String)
- `patientId` (FK → Patient)
- `typeSoin` (String)
- `detailsSoin` (JSON)
- `aOrdonnance` (Boolean)
- `ordonnanceDetails` (JSON)
- `datePreferee`, `heurePreferee`
- `urgence` (Enum: FAIBLE, NORMALE, ELEVEE, URGENTE)
- `lieu` (String)
- `statut` (Enum: EN_ATTENTE, CONFIRMEE, EN_COURS, TERMINEE, ANNULEE)

---

## 🎨 Personnalisation

### Ajouter un nouveau type de soin

Éditez `src/app/demande/soins/page.tsx` :

```typescript
{
  id: 'mon-soin',
  titre: 'Mon nouveau soin',
  description: 'Description',
  icon: '💊',
  questions: [
    { id: 'question1', label: 'Question', type: 'text', required: true },
  ]
}
```

### Modifier les couleurs

Les couleurs Tailwind sont configurables dans `tailwind.config.ts`.

---

## ❓ Problèmes courants

### Erreur : "Cannot find module 'zustand'"

```bash
npm install zustand
```

### Erreur Prisma : "Environment variable not found"

Vérifiez que `.env.local` existe avec `DATABASE_URL`.

### Erreur : "Connection refused"

Vérifiez que votre URL Neon est correcte et que votre IP est autorisée.

---

Bon développement ! 🚀
