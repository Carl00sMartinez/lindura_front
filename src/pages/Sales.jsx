import React, { useState, useEffect } from 'react'
import { saleAPI, productAPI, customerAPI } from '../services/api'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')

  useEffect(() => {
    loadSales()
    loadProducts()
    loadCustomers()
  }, [])

  const loadSales = async () => {
    try {
      const response = await saleAPI.getAll()
      setSales(response.data)
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAll()
      setCustomers(response.data)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit_price: product.price
      }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map(item => 
      item.product_id === productId 
        ? { ...item, quantity: parseInt(quantity) }
        : item
    ))
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0)
  }

  const handleSubmitSale = async () => {
  if (cart.length === 0) {
    alert('Agrega productos a la venta')
    return
  }

  try {
    const saleData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      customer_id: selectedCustomer || null,
      total: getTotal()
    }

    console.log('📤 Enviando datos de venta:', saleData)
    
    const response = await saleAPI.create(saleData)
    console.log('✅ Venta creada:', response.data)
    
    setCart([])
    setSelectedCustomer('')
    setShowForm(false)
    loadSales()
    alert('Venta registrada exitosamente!')
  } catch (error) {
    console.error('❌ Error registrando venta:', error)
    
    // Mostrar mensaje de error específico del backend si está disponible
    const errorMessage = error.response?.data?.error || 'Error registrando venta'
    alert(`Error: ${errorMessage}`)
  }
}

  return (
    <div className="container">
      <div className="page-header">
        <h1>Registro de Ventas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nueva Venta
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Nueva Venta</h3>
          
          <div className="form-group">
            <label>Cliente (opcional):</label>
            <select 
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Seleccionar cliente...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Productos Disponibles:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {products.map(product => (
                <div key={product.id} className="card" style={{ padding: '10px' }}>
                  <h4>{product.name}</h4>
                  <p>Precio: ${product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <h4>Carrito de Venta</h4>
            {cart.length === 0 ? (
              <p>No hay productos en el carrito</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.product_id}>
                      <td>{item.name}</td>
                      <td>${item.unit_price}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                          min="1"
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Total: ${getTotal().toFixed(2)}</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-primary" onClick={handleSubmitSale}>
                  Confirmar Venta
                </button>
                <button className="btn" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3>Historial de Ventas</h3>
        {sales.length === 0 ? (
          <p>No hay ventas registradas</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Items</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    {new Date(sale.sale_date).toLocaleDateString()}
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
    </div>
  )
}

export default Sales