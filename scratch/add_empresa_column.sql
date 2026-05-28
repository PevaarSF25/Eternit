-- =============================================================
-- SQL para agregar la columna "empresa" a la tabla "registros"
-- Ejecutar en el SQL Editor de Supabase
-- =============================================================

ALTER TABLE registros
ADD COLUMN IF NOT EXISTS empresa TEXT DEFAULT '';

-- Verificar que se creó correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'registros' AND column_name = 'empresa';
