import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Layout.css'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>VentasApp</h2>
          <p>Hola, {user?.email}</p>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>
              📦 Productos
            </Link>
          </li>
          <li>
            <Link to="/sales" className={isActive('/sales') ? 'active' : ''}>
              💰 Ventas
            </Link>
          </li>
          <li>
            <Link to="/customers" className={isActive('/customers') ? 'active' : ''}>
              👥 Clientes
            </Link>
          </li>
          <li>
            <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>
              📈 Reportes
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout