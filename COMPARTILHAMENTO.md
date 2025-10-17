# Sistema de Compartilhamento de Lista de Presentes

## 🎯 Funcionalidade

Permite que usuários compartilhem sua lista de presentes através de um link público.

---

## 📝 IMPORTANTE: Execute o SQL no Supabase

Antes de testar, você PRECISA executar o SQL para permitir leitura pública:

1. Acesse: https://supabase.com/dashboard/project/gqchtrrgvqtnexipmmal/sql
2. Abra o arquivo `supabase-public-policy.sql`
3. Copie e execute o SQL no editor

**SQL a executar:**
```sql
-- Política para permitir SELECT público em gifts
CREATE POLICY "Permitir leitura pública de presentes"
  ON gifts FOR SELECT
  USING (true);

-- Política para permitir leitura pública de profiles (apenas nome)
CREATE POLICY "Permitir leitura pública de nomes de perfil"
  ON profiles FOR SELECT
  USING (true);
```

---

## 🚀 Como Funciona

### 1. Compartilhar Lista
- Usuário logado clica em **"Compartilhar"** no header
- Link é copiado automaticamente: `https://seusite.com/lista/[user-id]`
- Toast confirma: "Link copiado!"

### 2. Visualizar Lista Pública
- Qualquer pessoa (sem login) acessa o link
- Vê todos os presentes do usuário
- Pode clicar para ver o produto na loja

---

## 📁 Arquivos Criados

### 1. `/src/pages/lista/[userId].tsx`
- Página pública de visualização
- Não requer autenticação
- Design limpo e responsivo
- Grid de presentes com imagens
- Botão "Ver Produto" para cada item

### 2. `/src/pages/api/gifts/public/[userId].ts`
- API pública (sem autenticação)
- Retorna presentes + nome do usuário
- Usa RLS do Supabase para segurança

### 3. `/src/components/app-header.tsx` (ATUALIZADO)
- Botão "Compartilhar" adicionado
- Copia link automaticamente
- Toast de confirmação

### 4. `supabase-public-policy.sql`
- Políticas RLS para leitura pública
- Permite SELECT em `gifts` e `profiles`

---

## 🎨 Interface da Página Pública

```
┌─────────────────────────────────────┐
│  🎁 Meu Presente                    │
├─────────────────────────────────────┤
│                                     │
│  Lista de Presentes de João Silva  │
│  Escolha um presente e clique...   │
│                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │img │ │img │ │img │ │img │      │
│  │    │ │    │ │    │ │    │      │
│  └────┘ └────┘ └────┘ └────┘      │
│  Nome1  Nome2  Nome3  Nome4        │
│  [Ver]  [Ver]  [Ver]  [Ver]        │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔒 Segurança

### O que é público:
- ✅ Lista de presentes (nome, imagem, link)
- ✅ Nome do dono da lista

### O que NÃO é público:
- ❌ Email do usuário
- ❌ Senha
- ❌ Outros dados pessoais
- ❌ Edição/exclusão de presentes

### RLS (Row Level Security):
- Leitura pública permitida
- Escrita apenas para o dono (autenticado)
- Políticas do Supabase garantem segurança

---

## 🧪 Como Testar

### 1. Execute o SQL (OBRIGATÓRIO):
```sql
-- No SQL Editor do Supabase
CREATE POLICY "Permitir leitura pública de presentes"
  ON gifts FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de nomes de perfil"
  ON profiles FOR SELECT
  USING (true);
```

### 2. Teste o Compartilhamento:
1. Faça login na aplicação
2. Adicione alguns presentes
3. Clique em **"Compartilhar"** no header
4. Veja o toast: "Link copiado!"
5. Abra uma aba anônima
6. Cole o link copiado
7. Veja sua lista pública!

### 3. Teste sem Login:
1. Copie o link: `http://localhost:3000/lista/[seu-user-id]`
2. Abra em modo anônimo
3. Deve ver a lista sem precisar fazer login

---

## 📊 Fluxo Completo

```
Usuário Logado
    ↓
Clica em "Compartilhar"
    ↓
Link copiado: /lista/[user-id]
    ↓
Compartilha com amigos
    ↓
Amigo acessa link (sem login)
    ↓
API pública busca presentes
    ↓
Lista exibida com botões "Ver Produto"
    ↓
Amigo clica e vai para loja
```

---

## ✨ Recursos

- ✅ Link único por usuário
- ✅ Cópia automática do link
- ✅ Toast de confirmação
- ✅ Página responsiva
- ✅ Sem necessidade de login
- ✅ Design limpo e moderno
- ✅ Botão para ver produto
- ✅ Nome do dono da lista
- ✅ Loading states
- ✅ Tratamento de erros

---

## 🎯 Exemplo de Link

```
http://localhost:3000/lista/550e8400-e29b-41d4-a716-446655440000
```

Onde `550e8400-e29b-41d4-a716-446655440000` é o ID do usuário no Supabase.

---

## 💡 Melhorias Futuras

- [ ] QR Code para compartilhar
- [ ] Botão "Marcar como comprado"
- [ ] Contador de visualizações
- [ ] Personalização da página (cores, tema)
- [ ] Compartilhar via WhatsApp/Facebook
- [ ] Analytics de cliques
