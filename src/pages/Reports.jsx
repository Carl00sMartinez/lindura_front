import React, { useState, useEffect } from 'react'
import { reportAPI, saleAPI } from '../services/api'

const Reports = () => {
  const [dailySales, setDailySales] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [allSales, setAllSales] = useState([])

  useEffect(() => {
    loadDailySales(selectedDate)
    loadAllSales()
  }, [])

  const loadDailySales = async (date) => {
    try {
      const response = await reportAPI.dailySales(date)
      setDailySales(response.data)
    } catch (error) {
      console.error('Error loading daily sales:', error)
    }
  }

  const loadAllSales = async () => {
    try {
      const response = await saleAPI.getAll()
      setAllSales(response.data)
    } catch (error) {
      console.error('Error loading all sales:', error)
    }
  }

  const getTotalSales = () => {
    return allSales.reduce((total, sale) => total + parseFloat(sale.total), 0)
  }

  const getTodayTotal = () => {
    return dailySales.reduce((total, sale) => total + parseFloat(sale.total), 0)
  }

  const getProductSales = () => {
    const productMap = {}
    allSales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const productName = item.products?.name || 'Producto desconocido'
        if (!productMap[productName]) {
          productMap[productName] = { quantity: 0, revenue: 0 }
        }
        productMap[productName].quantity += item.quantity
        productMap[productName].revenue += item.quantity * item.unit_price
      })
    })
    return Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
  }

  return (
    <div className="container">
      <h1>Reportes y Estadísticas</h1>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>Ventas Totales</h3>
          <p className="stat-number">${getTotalSales().toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <p className="stat-number">{allSales.length}</p>
        </div>
      </div>

      <div className="card">
        <h3>Ventas por Día</h3>
        <div className="form-group">
          <label>Seleccionar Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value)
              loadDailySales(e.target.value)
            }}
          />
        </div>
        
        <h4>Ventas del {selectedDate}: ${getTodayTotal().toFixed(2)}</h4>
        {dailySales.length === 0 ? (
          <p>No hay ventas para esta fecha</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Hora</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Items</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    {new Date(sale.sale_date).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {sale.customers?.name || 'Sin cliente'}
                  </td>
                  <td style={{ padding: '10px' }}>${parseFloat(sale.total).toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>
                    {sale.sale_items?.length || 0} productos
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Productos Más Vendidos</h3>
        {getProductSales().length === 0 ? (
          <p>No hay datos de ventas</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Cantidad Vendida</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {getProductSales().map((product, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px' }}>{product.quantity}</td>
                  <td style={{ padding: '10px' }}>${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Reports