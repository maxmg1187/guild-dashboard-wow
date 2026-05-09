import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export const useAuth = () => {
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError("Invalid credentials.")
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return { session, login, logout, error, setError }
}