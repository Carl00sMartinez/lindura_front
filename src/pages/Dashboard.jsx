import React, { useState, useEffect } from 'react'
import { productAPI, saleAPI, reportAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    todaySales: 0,
    totalSales: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [productsResponse, salesResponse] = await Promise.all([
        productAPI.getAll(),
        saleAPI.getAll()
      ])

      const products = productsResponse.data
      const sales = salesResponse.data

      // Calcular estadísticas
      const lowStockCount = products.filter(p => p.stock <= p.low_stock_alert).length
      const totalSalesAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0)

      // Ventas de hoy
      const today = new Date().toISOString().split('T')[0]
      const todaySalesResponse = await reportAPI.dailySales(today)
      const todaySalesAmount = todaySalesResponse.data.reduce((sum, sale) => sum + parseFloat(sale.total), 0)

      setStats({
        totalProducts: products.length,
        lowStock: lowStockCount,
        todaySales: todaySalesAmount,
        totalSales: totalSalesAmount,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">Cargando...</div>
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        
        <div className={`stat-card ${stats.lowStock > 0 ? 'warning' : ''}`}>
          <h3>Stock Bajo</h3>
          <p className="stat-number">{stats.lowStock}</p>
        </div>
        
        <div className="stat-card success">
          <h3>Ventas Hoy</h3>
          <p className="stat-number">${stats.todaySales.toFixed(2)}</p>
        </div>
        
        <div className="stat-card info">
          <h3>Ventas Totales</h3>
          <p className="stat-number">${stats.totalSales.toFixed(2)}</p>
        </div>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card.warning {
          border-left: 4px solid #e74c3c;
        }

        .stat-card.success {
          border-left: 4px solid #27ae60;
        }

        .stat-card.info {
          border-left: 4px solid #3498db;
        }

        .stat-card h3 {
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
        }
      `}</style>
    </div>
  )
}

export default Dashboard