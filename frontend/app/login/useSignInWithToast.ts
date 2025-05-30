"use client"

import { useActionState } from "react"
import { signInAction } from "./action"
import { useToast } from "@/hooks/useToast"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface SignInState {
  message: string
  success: boolean
  redirect?: string
}

export const useSignInWithToast = () => {
  const { success, error } = useToast()
  const router = useRouter()
  const lastProcessedState = useRef<string>("")
  const [state, formAction, isPending] = useActionState(signInAction, {
    message: "",
    success: false,
  } as SignInState)

  useEffect(() => {
    // Ne pas afficher de toast si le message est vide (état initial)
    if (!state?.message) return
    
    // Éviter de traiter le même état plusieurs fois
    if (lastProcessedState.current === `${state.message}-${state.success}`) {
      return
    }
    
    lastProcessedState.current = `${state.message}-${state.success}`
      if (state?.success === true) {
      success(state.message)
      // La redirection est maintenant gérée directement dans l'action serveur
    } else if (state?.success === false) {
      error(state.message)
    }
  }, [state, success, error, router])

  return {
    formAction,
    isPending,
    state,
  }
}
