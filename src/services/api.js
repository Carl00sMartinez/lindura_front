import axios from 'axios'

// ⚠️ IMPORTANTE: API_BASE_URL debe estar AL PRINCIPIO, antes de cualquier uso
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🔄 API_BASE_URL configurado como:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Importación dinámica para evitar círculo de dependencias
let supabaseInstance = null;

const getSupabase = async () => {
  if (!supabaseInstance) {
    const { supabase } = await import('./supabase');
    supabaseInstance = supabase;
  }
  return supabaseInstance;
}

// Interceptor para agregar token de autenticación
api.interceptors.request.use(async (config) => {
  try {
    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log('✅ Token agregado a la request:', config.url);
    } else {
      console.warn('⚠️ No hay sesión activa para la request:', config.url);
    }
  } catch (error) {
    console.error('❌ Error obteniendo sesión:', error);
  }
  return config;
});

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitosa:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en API call:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const saleAPI = {
  getAll: () => api.get('/sales'),
  create: (data) => api.post('/sales', data),
};

export const customerAPI = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const reportAPI = {
  dailySales: (date) => api.get(`/reports/daily-sales?date=${date}`),
  topProducts: () => api.get('/reports/top-products'),
};

export default api;