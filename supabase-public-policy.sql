-- Adicionar política para permitir leitura pública de presentes
-- Isso permite que qualquer pessoa veja os presentes através do link compartilhado

-- Política para permitir SELECT público em gifts
CREATE POLICY "Permitir leitura pública de presentes"
  ON gifts FOR SELECT
  USING (true);

-- Política para permitir leitura pública de profiles (apenas nome)
CREATE POLICY "Permitir leitura pública de nomes de perfil"
  ON profiles FOR SELECT
  USING (true);
