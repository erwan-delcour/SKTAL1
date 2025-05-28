# Hook useToast

Ce hook personnalisé permet d'utiliser facilement les notifications toast de Sonner dans toute l'application.

## Installation

Le hook est déjà configuré et prêt à être utilisé. Sonner est déjà installé et le Toaster est configuré dans le layout principal.

## Utilisation

### Import du hook

```typescript
import { useToast } from "@/hooks/useToast"
```

### Méthodes disponibles

Le hook retourne un objet avec les méthodes suivantes :

- `success(message, options?)` - Affiche un toast de succès
- `error(message, options?)` - Affiche un toast d'erreur  
- `info(message, options?)` - Affiche un toast d'information
- `warning(message, options?)` - Affiche un toast d'avertissement
- `toast(message, options?)` - Affiche un toast neutre
- `promise(promise, messages)` - Affiche un toast qui suit l'état d'une promesse

### Options

```typescript
interface ToastOptions {
  duration?: number; // Durée en ms (défaut: 4000)
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Exemples d'utilisation

#### Toast simple

```typescript
const { success, error, info, warning } = useToast()

// Toast de succès
success("Opération réussie !")

// Toast d'erreur
error("Une erreur est survenue")

// Toast avec action
success("Fichier sauvegardé", {
  duration: 3000,
  action: {
    label: "Voir",
    onClick: () => console.log("Action clicked")
  }
})
```

#### Toast avec promesse

```typescript
const { promise } = useToast()

const saveData = async () => {
  const operation = fetch("/api/save")
  
  promise(operation, {
    loading: "Sauvegarde en cours...",
    success: "Données sauvegardées !",
    error: "Erreur lors de la sauvegarde"
  })
}
```

#### Utilisation avec des actions de formulaire

Voir l'exemple dans `app/login/useSignInWithToast.ts` qui montre comment intégrer les toasts avec les actions de formulaire Next.js.

## Thème

Le Toaster est automatiquement configuré pour s'adapter au thème (clair/sombre) de l'application via `next-themes`.
