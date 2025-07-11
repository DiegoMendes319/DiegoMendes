# 🔧 Instruções Para Activar o Supabase

## ✅ O que já está feito:
- Painel de administração criado em `/admin`
- Código preparado para Supabase
- Sistema de autenticação funcionando (temporariamente)

## ⚠️ O que precisa fazer:

### 1. Obter a DATABASE_URL correcta:
1. Vá para: https://supabase.com/dashboard/projects
2. Clique no seu projecto (ivqskduqelswxvhnobqe)
3. Clique em "Settings" (menu lateral esquerdo)
4. Clique em "Database" 
5. Encontre "Connection string"
6. Copie a URL (substitua [YOUR-PASSWORD] pela palavra-passe real)

### 2. Actualizar o ficheiro .env:
1. Abra o ficheiro `.env` (na lista de ficheiros)
2. Substitua a linha 2 (DATABASE_URL=...) pela nova URL
3. Guarde o ficheiro (Ctrl+S)

### 3. Activar o Supabase:
Depois de ter a URL correcta, avise-me que eu activo o Supabase com um simples comando.

## 📊 Quando o Supabase estiver activo:
- ✅ Dados permanentes (não se perdem)
- ✅ Fotografias persistem
- ✅ Painel admin funciona completamente
- ✅ Backup automático

## 🔄 Estado actual:
- ❌ Dados temporários (perdem-se quando servidor reinicia)
- ❌ Supabase não conectado (DATABASE_URL incorrecta)
- ✅ Tudo funciona, apenas sem persistência

**Assim que tiver a DATABASE_URL correcta, avise-me que activo o Supabase!**