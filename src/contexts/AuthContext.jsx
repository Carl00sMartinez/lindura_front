import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, testConnection } from '../services/supabase' // Importación directa

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 Inicializando AuthContext...');
    
    // Probar conexión primero
    testConnection().then(success => {
      if (!success) {
        console.error('❌ No se puede conectar a Supabase');
        setLoading(false);
        return;
      }

      // Verificar sesión activa
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('📋 Sesión actual:', session);
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Escuchar cambios de autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Cambio de estado de autenticación:', event, session);
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    });
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}