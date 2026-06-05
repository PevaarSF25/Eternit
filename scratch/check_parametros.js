const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';           
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ'; 

async function printAllInOrder() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/parametros?categoria=eq.empresa&order=orden.asc`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await res.json();
  data.forEach((item, index) => {
    console.log(`${index + 1}. [ID: ${item.id}] [Valor: ${item.valor}] [Orden: ${item.orden}] [Created: ${item.created_at}]`);
  });
}

printAllInOrder();
