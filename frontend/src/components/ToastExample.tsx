"use client"

import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/button"

export const ToastExample = () => {
  const { success, error, info, warning, toast, promise } = useToast()

  const handleSuccess = () => {
    success("Opération réussie !", {
      duration: 3000,
      action: {
        label: "Voir",
        onClick: () => console.log("Action clicked"),
      },
    })
  }

  const handleError = () => {
    error("Une erreur est survenue !")
  }

  const handleInfo = () => {
    info("Information importante")
  }

  const handleWarning = () => {
    warning("Attention ! Vérifiez vos données")
  }

  const handlePromise = () => {
    const asyncOperation = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Succès !") : reject("Échec !")
      }, 2000)
    })

    promise(asyncOperation, {
      loading: "Chargement en cours...",
      success: (data) => `${data}`,
      error: (error) => `Erreur: ${error}`,
    })
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Exemples de Toast</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSuccess} variant="default">
          Toast Succès
        </Button>
        <Button onClick={handleError} variant="destructive">
          Toast Erreur
        </Button>
        <Button onClick={handleInfo} variant="secondary">
          Toast Info
        </Button>
        <Button onClick={handleWarning} variant="outline">
          Toast Warning
        </Button>
        <Button onClick={handlePromise} variant="secondary">
          Toast Promise
        </Button>
      </div>
    </div>
  )
}
