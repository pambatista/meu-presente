# Configuração do Supabase

## Passo 1: Executar o SQL no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard/project/gqchtrrgvqtnexipmmal
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `supabase-schema.sql`
5. Cole no editor SQL
6. Clique em **Run** para executar

Isso irá criar:
- Tabela `profiles` (perfis de usuário)
- Tabela `gifts` (presentes)
- Políticas de Row Level Security (RLS)
- Índices para performance
- Triggers para atualizar `updated_at` automaticamente

## Passo 2: Verificar as Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as tabelas:
   - `profiles`
   - `gifts`

## Passo 3: Configurar Email Templates (Opcional)

1. No menu lateral, clique em **Authentication** > **Email Templates**
2. Personalize os templates de email se desejar

## Passo 4: Testar a Integração

1. Reinicie o servidor Next.js: `npm run dev`
2. Acesse http://localhost:3000/register
3. Crie uma conta de teste
4. Faça login
5. Adicione um presente

## Estrutura do Banco de Dados

### Tabela: profiles
- `id` (UUID) - PK, referência para auth.users
- `email` (TEXT)
- `name` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: gifts
- `id` (UUID) - PK
- `user_id` (UUID) - FK para auth.users
- `name` (TEXT)
- `link` (TEXT)
- `image` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Row Level Security (RLS)

Todas as tabelas têm RLS habilitado, garantindo que:
- Usuários só podem ver/editar seus próprios dados
- Ninguém pode acessar dados de outros usuários
- Políticas são aplicadas automaticamente pelo Supabase

## Próximos Passos

Após executar o SQL, você pode:
1. Integrar o AuthProvider no _app.tsx
2. Atualizar os formulários de login e registro
3. Atualizar a página de presentes para usar a API
4. Testar todo o fluxo de autenticação e CRUD
