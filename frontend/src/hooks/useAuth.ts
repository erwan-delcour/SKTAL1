"use client"

import { useEffect, useState } from "react"
import { decodeTokenUnsafe, type JWTPayload } from "@/lib/jwt"

interface UserInfo {
  role: string | null
  userId: string | null
  email?: string
  login?: string
  exp?: number // expiration timestamp
}

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    role: null,
    userId: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTokenInfo = () => {
      try {
        // Récupérer le token depuis les cookies côté client
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        if (!token) {
          setUserInfo({ role: null, userId: null })
          setIsLoading(false)
          return
        }

        // Décoder le JWT côté client
        const decoded = decodeTokenUnsafe(token)
        
        if (!decoded) {
          setUserInfo({ role: null, userId: null })
          setIsLoading(false)
          return
        }
        
        setUserInfo({
          role: decoded.role || null,
          userId: decoded.userId || decoded.id || null,
          email: decoded.email || undefined,
          login: decoded.login || undefined,
          exp: decoded.exp || undefined,
        })
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error)
        setUserInfo({ role: null, userId: null })
      } finally {
        setIsLoading(false)
      }
    }

    getTokenInfo()
  }, [])

  const isManager = userInfo.role === 'manager'
  const isSecretary = userInfo.role === 'secretary'
  const isEmployee = userInfo.role === 'user'
  const isAuthenticated = !!userInfo.userId

  return {
    userInfo,
    isLoading,
    isAuthenticated,
    isManager,
    isSecretary,
    isEmployee,
  }
}
