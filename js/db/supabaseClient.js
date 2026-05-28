/**
 * @fileoverview Cliente de Supabase para la aplicación Eternit HSE.
 * 
 * Supabase se carga globalmente desde CDN en index.html:
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * 
 * El usuario debe reemplazar SUPABASE_URL y SUPABASE_ANON_KEY
 * con sus credenciales reales de Supabase.
 * 
 * @module db/supabaseClient
 */

// ─────────────────────────────────────────────────────────
//  CONFIGURACIÓN — Reemplazar con tus credenciales reales
// ─────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';           
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ'; 

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let supabaseInstance = null;

/**
 * Obtiene (o crea) la instancia singleton del cliente Supabase.
 * 
 * La librería `supabase` se espera como variable global cargada
 * desde el CDN en el HTML principal.
 * 
 * @returns {import('@supabase/supabase-js').SupabaseClient} Instancia del cliente Supabase
 * @throws {Error} Si la librería de Supabase no está cargada globalmente
 * 
 * @example
 * import { getSupabase } from './db/supabaseClient.js';
 * const sb = getSupabase();
 * const { data, error } = await sb.from('registros').select('*');
 */
export function getSupabase() {
    if (!supabaseInstance) {
        if (typeof supabase === 'undefined' || !supabase.createClient) {
            throw new Error(
                'Supabase no está cargado. Asegúrate de incluir el script del CDN en tu HTML:\n' +
                '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
            );
        }
        supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseInstance;
}
