-- ============================================
-- NOTION CLONE - Script SQL para Supabase
-- ============================================
-- Execute este script no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- 1. Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Sem título',
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ativar Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Usuários podem visualizar apenas seus próprios documentos
CREATE POLICY "Users can view own documents"
  ON documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: Usuários podem inserir apenas seus próprios documentos
CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Usuários podem atualizar apenas seus próprios documentos
CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Policy: Usuários podem deletar apenas seus próprios documentos
CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Criar índice para melhorar performance em consultas por usuário
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);

-- 8. Criar índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Após executar, vá para Authentication > Providers
-- e habilite Email provider (Magic Link)
-- ============================================

