import React, { useState, useEffect } from 'react'
import { customerAPI } from '../services/api'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getAll()
      setCustomers(response.data)
    } catch (error) {
      console.error('Error loading customers:', error)
      alert('Error cargando clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        await customerAPI.update(editingCustomer.id, formData)
      } else {
        await customerAPI.create(formData)
      }
      setShowForm(false)
      setEditingCustomer(null)
      setFormData({ name: '', email: '', phone: '' })
      loadCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Error guardando cliente')
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await customerAPI.delete(id)
        loadCustomers()
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Error eliminando cliente')
      }
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Gestión de Clientes</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingCustomer(null)
            setFormData({ name: '', email: '', phone: '' })
            setShowForm(true)
          }}
        >
          + Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingCustomer ? 'Editar' : 'Nuevo'} Cliente</h3>
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
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingCustomer ? 'Actualizar' : 'Crear'}
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
        <p>Cargando clientes...</p>
      ) : (
        <div className="card">
          <h3>Lista de Clientes</h3>
          {customers.length === 0 ? (
            <p>No hay clientes registrados.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{customer.name}</td>
                    <td style={{ padding: '10px' }}>{customer.email}</td>
                    <td style={{ padding: '10px' }}>{customer.phone}</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                        className="btn"
                        onClick={() => handleEdit(customer)}
                        style={{ marginRight: '5px' }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer.id)}
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
    </div>
  )
}

export default Customers