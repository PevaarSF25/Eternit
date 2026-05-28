const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';           
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ'; 

async function inspect() {
  try {
    // Attempt to insert a dummy record to get its representation
    const res = await fetch(`${SUPABASE_URL}/rest/v1/registros`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        tipo: 'Directo',
        planta: 'TestPlanta',
        anio: 2026,
        mes: 'Enero'
      })
    });
    const data = await res.json();
    console.log("INSERT RESPONSE:", data);
    
    // Clean up if inserted successfully
    if (Array.isArray(data) && data[0] && data[0].id) {
      const delRes = await fetch(`${SUPABASE_URL}/rest/v1/registros?id=eq.${data[0].id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      console.log("CLEANUP STATUS:", delRes.status);
    }
  } catch (err) {
    console.error("Error inspecting:", err);
  }
}

inspect();
