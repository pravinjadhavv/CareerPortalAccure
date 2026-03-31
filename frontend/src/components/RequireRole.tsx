import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type React from 'react'

export function RequireRole({
  role,
  children,
}: {
  role: 'CANDIDATE' | 'COMPANY' | 'ADMIN'
  children: React.ReactElement
}) {
  const auth = useAuth()
  if (!auth.token) return <Navigate to="/login" replace />
  if (auth.role !== role) return <Navigate to="/access-denied" replace />
  return children
}

