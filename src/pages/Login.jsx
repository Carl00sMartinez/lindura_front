import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { testConnection } from '../services/supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [connectionTest, setConnectionTest] = useState(null)
  
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Probar conexión al cargar
    testConnection().then(success => {
      setConnectionTest(success);
    });
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    clearError()

    try {
      const { error } = await login(email, password)
      if (!error) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error inesperado:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Sistema de Ventas Personal</h2>
        
        {/* Estado de conexión */}
        {connectionTest === false && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#856404'
          }}>
            ⚠️ Problema de conexión con la base de datos
          </div>
        )}
        
        {connectionTest === true && (
          <div style={{ 
            background: '#d1ecf1', 
            border: '1px solid #bee5eb',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#0c5460'
          }}>
            ✅ Conectado a la base de datos
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              ❌ {error}
              <br />
              <small>Verifica tu conexión a internet y las credenciales</small>
            </div>
          )}
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@ejemplo.com"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{width: '100%'}}
          >
            {loading ? '🔐 Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>

          <div style={{
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#666',
            background: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px'
          }}>
            <p><strong>💡 Credenciales de prueba:</strong></p>
            <p>📧 Email: test@ventas.com</p>
            <p>🔑 Password: test123456</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              Si no funcionan, ejecuta el script create_new_user.py en el backend
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login