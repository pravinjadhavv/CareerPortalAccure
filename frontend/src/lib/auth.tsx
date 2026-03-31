import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAuthToken } from './api'

type Role = 'CANDIDATE' | 'COMPANY' | 'ADMIN'

type AuthState = {
  token: string | null
  role: Role | null
  userId: number | null
}

type AuthContextValue = AuthState & {
  login: (token: string, role: Role, userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'careerportal_auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, role: null, userId: null }
    try {
      return JSON.parse(raw) as AuthState
    } catch {
      return { token: null, role: null, userId: null }
    }
  })

  useEffect(() => {
    setAuthToken(state.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: (token, role, userId) => setState({ token, role, userId }),
      logout: () => setState({ token: null, role: null, userId: null }),
    }),
    [state],
  )

  useEffect(() => {
    if (!state.token) return
    api.get('/me').catch(() => {
      setState({ token: null, role: null, userId: null })
    })
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

