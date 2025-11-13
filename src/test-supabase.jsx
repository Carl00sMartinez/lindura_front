import { supabase } from './services/supabase'

// Ejecuta esto en la consola del navegador para probar Supabase
export const testSupabaseConnection = async () => {
  console.log('🧪 Probando conexión con Supabase...')
  
  try {
    // Probar autenticación
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@ventas.com',
      password: 'test123456'
    })
    
    if (error) {
      console.error('❌ Error de autenticación:', error)
      return false
    }
    
    console.log('✅ Autenticación exitosa:', data.user.email)
    
    // Probar consulta a la base de datos
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (dbError) {
      console.error('❌ Error de base de datos:', dbError)
      return false
    }
    
    console.log('✅ Conexión a base de datos exitosa')
    console.log('📦 Productos de ejemplo:', products)
    
    return true
  } catch (error) {
    console.error('❌ Error general:', error)
    return false
  }
}

// Ejecutar prueba automáticamente
testSupabaseConnection()