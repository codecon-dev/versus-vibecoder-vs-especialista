-- ============================================
-- MIGRATION: Adicionar Hierarquia de Páginas
-- ============================================
-- Execute este script no Supabase SQL Editor
-- Para adicionar suporte a subpáginas
-- ============================================

-- 1. Adicionar coluna parent_id para criar hierarquia
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES documents(id) ON DELETE CASCADE;

-- 2. Criar índice para melhorar performance em consultas por parent
CREATE INDEX IF NOT EXISTS documents_parent_id_idx ON documents(parent_id);

-- 3. Comentários para documentação
COMMENT ON COLUMN documents.parent_id IS 'ID do documento pai. NULL = documento raiz (top-level)';

-- ============================================
-- QUERIES ÚTEIS PARA TESTES
-- ============================================

-- Ver todos os documentos com seus pais:
-- SELECT id, title, parent_id FROM documents ORDER BY created_at DESC;

-- Ver hierarquia completa (com recursão):
-- WITH RECURSIVE doc_tree AS (
--   SELECT id, title, parent_id, 0 as level
--   FROM documents 
--   WHERE parent_id IS NULL
--   UNION ALL
--   SELECT d.id, d.title, d.parent_id, dt.level + 1
--   FROM documents d
--   INNER JOIN doc_tree dt ON d.parent_id = dt.id
-- )
-- SELECT * FROM doc_tree ORDER BY level, title;

-- ============================================
-- FIM DA MIGRATION
-- ============================================

