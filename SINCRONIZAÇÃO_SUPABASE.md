# Sincronização com Base de Dados Supabase

## ✅ SITUAÇÃO ACTUAL

### O que funciona agora:
- **Registo por email**: Funcionando com API local
- **Login por email**: Funcionando com API local  
- **Perfil completo**: Sistema de edição funcional
- **Armazenamento**: MemStorage (temporário)

### O que precisa ser configurado:
- **Sincronização com Supabase**: Dados permanentes na base de dados

## 🔧 PARA SINCRONIZAR COM SUPABASE

### Passo 1: Configurar DATABASE_URL
```bash
# No ficheiro .env, adicionar:
DATABASE_URL="postgresql://[username]:[password]@[host]/[database]"
```

### Passo 2: Obter credenciais do Supabase
1. Aceda ao [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccione o seu projecto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String** (URI)
5. Substitua `[YOUR-PASSWORD]` pela palavra-passe da base de dados

### Passo 3: Activar sincronização
Após configurar DATABASE_URL, alterar em `server/storage.ts`:
```typescript
// MUDAR DE:
export const storage = new MemStorage();

// PARA:
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
```

### Passo 4: Executar migrações
```bash
npm run db:push
```

## 📋 INFORMAÇÕES NECESSÁRIAS DO UTILIZADOR

Para completar a sincronização, preciso dos seguintes dados:

1. **URL da Base de Dados Supabase**
   - Formato: `postgresql://username:password@host:port/database`
   - Obtida em: Supabase Dashboard → Settings → Database

2. **Confirmação de teste**
   - Criar uma conta de teste
   - Verificar se dados persistem após restart do servidor

## 🎯 BENEFÍCIOS APÓS SINCRONIZAÇÃO

- ✅ **Dados permanentes**: Utilizadores não perdem informações
- ✅ **Backup automático**: Supabase cuida dos backups
- ✅ **Escalabilidade**: Suporta muitos utilizadores
- ✅ **Performance**: Base de dados optimizada
- ✅ **Relatórios**: Acesso aos dados para análises

## 🔄 ESTADO ACTUAL DO SISTEMA

### MemStorage (Actual):
- Dados apenas enquanto servidor activo
- Restart = perda de dados
- Ideal para desenvolvimento e testes

### DatabaseStorage (Após configuração):
- Dados permanentes
- Backup automático
- Produção-ready

**Tudo já está preparado para a sincronização, só precisa configurar o DATABASE_URL!**