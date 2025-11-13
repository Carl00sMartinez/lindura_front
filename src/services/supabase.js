import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configurando Supabase con:', {
  url: supabaseUrl,
  keyLength: supabaseKey ? supabaseKey.length : 0
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  console.log('🧪 Probando conexión con Supabase...');
  
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
};