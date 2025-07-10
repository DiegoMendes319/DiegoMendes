# Doméstica Angola - Portal de Diaristas

Um portal completo para conectar famílias com profissionais domésticos qualificados em Angola.

## Características

- 🏠 **Busca por Localização**: Encontre diaristas próximos usando geolocalização ou busca manual
- 👤 **Perfis Completos**: Informações detalhadas sobre cada profissional
- 📱 **Design Responsivo**: Interface otimizada para mobile e desktop
- 🎨 **Cores de Angola**: Design usando as cores da bandeira angolana
- 🔐 **Autenticação**: Sistema completo de login e registro
- 📊 **Filtros Avançados**: Busque por serviços, tipo de contrato e localização
- 📧 **Contato Direto**: Informações de contato para facilitar a comunicação

## Tecnologias Utilizadas

### Frontend
- React 18 com TypeScript
- Tailwind CSS para estilização
- Shadcn/ui para componentes
- Wouter para roteamento
- TanStack Query para gerenciamento de estado

### Backend
- Node.js com Express
- Drizzle ORM para banco de dados
- Supabase para autenticação e storage
- TypeScript para tipagem

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com:

```env
# Supabase Configuration
SUPABASE_URL=sua-url-do-supabase
SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
DATABASE_URL=sua-url-de-conexao-do-banco

# Development
NODE_ENV=development
