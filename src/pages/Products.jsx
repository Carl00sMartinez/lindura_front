import React, { useState, useEffect } from 'react'
import { productAPI } from '../services/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    low_stock_alert: 5
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Error loading products:', error)
      alert('Error cargando productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData)
      } else {
        await productAPI.create(formData)
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', price: '', stock: '', category: '', low_stock_alert: 5 })
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error guardando producto')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      low_stock_alert: product.low_stock_alert
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productAPI.delete(id)
        loadProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error eliminando producto')
      }
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingProduct(null)
            setFormData({ name: '', price: '', stock: '', category: '', low_stock_alert: 5 })
            setShowForm(true)
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Categoría:</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Alerta de Stock Bajo:</label>
              <input
                type="number"
                value={formData.low_stock_alert}
                onChange={(e) => setFormData({...formData, low_stock_alert: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Actualizar' : 'Crear'}
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="card">
          <h3>Lista de Productos</h3>
          {products.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Precio</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Categoría</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{product.name}</td>
                    <td style={{ padding: '10px' }}>${parseFloat(product.price).toFixed(2)}</td>
                    <td style={{ 
                      padding: '10px', 
                      color: product.stock <= product.low_stock_alert ? 'red' : 'inherit',
                      fontWeight: product.stock <= product.low_stock_alert ? 'bold' : 'normal'
                    }}>
                      {product.stock}
                    </td>
                    <td style={{ padding: '10px' }}>{product.category}</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                        className="btn"
                        onClick={() => handleEdit(product)}
                        style={{ marginRight: '5px' }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(product.id)}
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
      )}

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  )
}

export default Products