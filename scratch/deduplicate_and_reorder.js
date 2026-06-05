const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';           
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ'; 

function isAllCaps(str) {
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

function isAllLowercase(str) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

function getCasingScore(str) {
  // Prefer Title/Mixed Case over ALL CAPS or all lowercase
  if (isAllCaps(str)) return 1;
  if (isAllLowercase(str)) return 2;
  return 3; // Mixed/Title Case is best
}

async function runDeduplicateAndReorder() {
  try {
    console.log("Fetching all empresa parameters...");
    const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/parametros?categoria=eq.empresa`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!fetchRes.ok) {
      throw new Error(`Fetch failed: ${await fetchRes.text()}`);
    }
    
    const params = await fetchRes.json();
    console.log(`Total parameters fetched: ${params.length}`);

    // Group by case-insensitive value
    const groups = {};
    params.forEach(p => {
      const key = p.valor.toLowerCase().trim();
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    const toDeleteIds = [];
    const keptParams = [];

    for (const [key, items] of Object.entries(groups)) {
      if (items.length === 1) {
        keptParams.push(items[0]);
      } else {
        // Sort items to choose the best one to keep
        items.sort((a, b) => {
          // 1. Prefer better casing score
          const scoreA = getCasingScore(a.valor);
          const scoreB = getCasingScore(b.valor);
          if (scoreA !== scoreB) return scoreB - scoreA; // descending score

          // 2. Prefer orden > 0 (user-created)
          const ordenA = a.orden || 0;
          const ordenB = b.orden || 0;
          if (ordenA !== ordenB) return ordenB - ordenA; // descending orden

          // 3. Prefer earlier created_at
          return new Date(a.created_at) - new Date(b.created_at);
        });

        const kept = items[0];
        keptParams.push(kept);

        // Delete the rest
        for (let i = 1; i < items.length; i++) {
          toDeleteIds.push(items[i].id);
        }
        console.log(`Duplicate found for "${key}". Keeping "${kept.valor}" (ID: ${kept.id}, Orden: ${kept.orden}), deleting:`, items.slice(1).map(i => `${i.valor} (${i.id})`));
      }
    }

    // Delete duplicates from Supabase
    if (toDeleteIds.length > 0) {
      console.log(`Deleting ${toDeleteIds.length} duplicate parameters...`);
      // Delete in batches of 20 to be safe
      const batchSize = 20;
      for (let i = 0; i < toDeleteIds.length; i += batchSize) {
        const batch = toDeleteIds.slice(i, i + batchSize);
        const deleteQuery = batch.map(id => `id.eq.${id}`).join(',');
        const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/parametros?or=(${deleteQuery})`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (!deleteRes.ok) {
          throw new Error(`Delete failed for batch: ${await deleteRes.text()}`);
        }
        console.log(`Deleted batch ${i / batchSize + 1}`);
      }
    } else {
      console.log("No duplicates to delete.");
    }

    // Now, sort the kept parameters and assign sequential order numbers
    console.log("Reordering kept parameters...");
    
    // Sort logic to match original order (seeded first, then user-created)
    keptParams.sort((a, b) => {
      // 1. Seeded ones (orden = 0) should come first, then user-created (orden > 0)
      const isSeededA = (a.orden === 0);
      const isSeededB = (b.orden === 0);
      if (isSeededA && !isSeededB) return -1;
      if (!isSeededA && isSeededB) return 1;

      // 2. If both are seeded, preserve current sorting order by id or valor
      if (isSeededA && isSeededB) {
        return a.valor.localeCompare(b.valor);
      }

      // 3. If both are user-created, sort by their original orden
      return a.orden - b.orden;
    });

    console.log("Updating order in Supabase...");
    // Update them one by one or in parallel batches
    for (let index = 0; index < keptParams.length; index++) {
      const item = keptParams[index];
      const newOrden = index + 1;
      
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/parametros?id=eq.${item.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orden: newOrden })
      });
      
      if (!updateRes.ok) {
        console.error(`Failed to update orden for ID ${item.id} to ${newOrden}: ${await updateRes.text()}`);
      } else {
        console.log(`Updated "${item.valor}" (ID: ${item.id}) to orden ${newOrden}`);
      }
    }

    console.log("Deduplication and reordering complete successfully!");

  } catch (err) {
    console.error("Error running script:", err);
  }
}

runDeduplicateAndReorder();
