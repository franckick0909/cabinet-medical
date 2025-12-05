# Police Stardom

## 📁 Structure des fichiers

Copiez les fichiers de police depuis votre dossier `WEB/font` vers ce dossier (`public/fonts/`).

## 📋 Fichiers à copier

Depuis le dossier `WEB/font`, copiez les fichiers suivants :

- `Stardom-Regular.woff2` (prioritaire - format moderne)
- `Stardom-Regular.woff` (fallback - format ancien)

## 🔧 Noms de fichiers attendus

Les fichiers doivent être nommés exactement :
- `Stardom-Regular.woff2`
- `Stardom-Regular.woff`

Si vos fichiers ont un nom différent, renommez-les ou modifiez les chemins dans `src/app/layout.tsx`.

## ✅ Après avoir copié les fichiers

Une fois les fichiers copiés, la police sera automatiquement disponible via :
- Classe CSS : `font-stardom`
- Variable CSS : `var(--font-stardom)`
- Classe Tailwind : `font-stardom`

## 📝 Exemple d'utilisation

```tsx
<h1 className="font-stardom text-4xl">
  Mon titre avec Stardom
</h1>
```

