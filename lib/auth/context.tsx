'use client'
import { createContext, useState, useMemo, useContext, ReactNode } from 'react'

type User = {
  userId: number
  username: string
}

type SessionContextValue = {
  user?: User
  setUser: (user?: User) => void
}

export const SessionContext = createContext<SessionContextValue>({
  user: undefined,
  setUser: () => {}
})

export function useSession(): SessionContextValue {
  return useContext(SessionContext)
}

type SessionProviderProps = {
  user?: User
  children: ReactNode
}

export function SessionProvider({ user, children }: SessionProviderProps): JSX.Element {
  const [_user, setUser] = useState(user)
  const value = useMemo(() => ({
    user: _user,
    setUser
  }), [_user])
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}
