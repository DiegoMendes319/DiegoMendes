# Doméstica Angola - Portal de Diaristas

Portal completo para conectar famílias com profissionais de serviços domésticos em Angola.

## ✨ Funcionalidades

- **Três Métodos de Autenticação**: Email/Palavra-passe, Google OAuth, e Login Simples (Nome+Palavra-passe)
- **Pesquisa Geolocalizada**: Filtros por província, município e bairro de Angola
- **Páginas Completas**: Sobre Nós, Como Funciona, Ajuda, Termos, Privacidade, Segurança
- **Interface Responsiva**: Design moderno optimizado para dispositivos móveis
- **Cores de Angola**: Tema visual baseado nas cores da bandeira angolana

## 🚀 Configuração Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Base de Dados
O projeto usa PostgreSQL. A ligação à base de dados está configurada através da variável `DATABASE_URL`.

Para usar com Supabase (recomendado):
1. Criar projeto em [supabase.com](https://supabase.com)
2. Ir para Settings > Database
3. Copiar a Connection String
4. Adicionar aos Secrets do Replit como `DATABASE_URL`

### 3. Executar Migrações
```bash
npm run db:push
```

### 4. Iniciar Aplicação
```bash
npm run dev
```

## 🔐 Configuração de Autenticação

### Google OAuth (Opcional)
Para ativar o login com Google:

1. **Google Cloud Console**:
   - Ir para [console.cloud.google.com](https://console.cloud.google.com)
   - Criar novo projeto ou selecionar existente
   - Ativar Google+ API
   - Criar credenciais OAuth 2.0
   - Configurar URI de redirecionamento: `https://[seu-projeto].supabase.co/auth/v1/callback`

2. **Supabase Dashboard**:
   - Ir para Authentication > Providers
   - Ativar Google Provider
   - Inserir Client ID e Client Secret

3. **Variáveis de Ambiente no Replit**:
   ```
   VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
   VITE_SUPABASE_ANON_KEY=[sua-chave-anon]
   GOOGLE_CLIENT_ID=[seu-google-client-id]
   GOOGLE_CLIENT_SECRET=[seu-google-client-secret]
   ```

4. **Instalar Supabase SDK**:
   ```bash
   npm install @supabase/supabase-js
   ```

## 📋 Teste das Funcionalidades

### Autenticação
1. **Email/Palavra-passe**: Registo completo com validação
2. **Google OAuth**: Login social com criação automática de perfil
3. **Login Simples**: Autenticação por nome e palavra-passe

### Validações
- ✅ Idade mínima de 18 anos
- ✅ Campos obrigatórios para registo
- ✅ Formato de email válido
- ✅ Localização hierárquica (Província → Município → Bairro)

### Páginas
- ✅ **Início**: Pesquisa e listagem de profissionais
- ✅ **Sobre Nós**: Missão, visão e valores da empresa
- ✅ **Como Funciona**: Guia passo-a-passo de utilização
- ✅ **Ajuda**: FAQ com perguntas frequentes
- ✅ **Termos de Serviço**: Regras de utilização
- ✅ **Política de Privacidade**: Tratamento de dados
- ✅ **Segurança**: Boas práticas e garantias

## 🛠️ Estrutura Técnica

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Wouter** para roteamento
- **TanStack Query** para gestão de estado
- **Shadcn/ui** para componentes

### Backend
- **Node.js** com Express
- **PostgreSQL** com Drizzle ORM
- **Supabase** para autenticação (opcional)

### Características Especiais
- **Design Angola**: Cores vermelha, preta e amarela da bandeira
- **Português de Portugal**: Terminologia correcta (registar, palavra-passe, morada)
- **Responsivo**: Interface adaptada para dispositivos móveis
- **Acessível**: Componentes com boas práticas de acessibilidade

## 📱 Utilização

### Para Famílias
1. Pesquisar profissionais por localização
2. Filtrar por serviços e tipo de contrato
3. Ver perfis detalhados
4. Contactar directamente via telefone/redes sociais

### Para Profissionais
1. Registar-se com um dos três métodos
2. Completar perfil com experiência e serviços
3. Definir disponibilidade e área de trabalho
4. Receber contactos de pessoas interessadas

## 🔧 Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Construir para produção
- `npm run db:push` - Aplicar mudanças ao esquema da base de dados
- `npm run db:studio` - Abrir Drizzle Studio

### Adicionar Nova Página
1. Criar ficheiro em `client/src/pages/`
2. Adicionar rota em `client/src/App.tsx`
3. Actualizar navegação se necessário

### Modificar Base de Dados
1. Editar `shared/schema.ts`
2. Executar `npm run db:push`
3. Actualizar tipos em `client/src/types/`

## 📞 Suporte

Para questões técnicas ou sugestões:
- Email: suporte@domesticaangola.com
- Documentação: Ver comentários no código
- Issues: Reportar problemas no repositório

---

**Doméstica Angola** - Conectando famílias com profissionais de confiança 🇦🇴