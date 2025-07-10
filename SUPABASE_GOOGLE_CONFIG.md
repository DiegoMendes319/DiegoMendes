# Configuração Final do Google OAuth no Supabase

## O que já fez ✓
- Configurou Google Cloud Console com URLs correctos
- Tem Client ID e Client Secret

## Próximos passos no Supabase:

### 1. Copiar credenciais do Google Cloud
Na sua imagem do Google Cloud Console, vejo:
- **Client ID**: `465090348l3-d7pcu5a7pp8ua32rq1032due1t27nf.apps.googleusercontent.com`
- **Client Secret**: Clique no ícone de cópia ao lado do código que começa com `GOCSPX-`

### 2. Configurar no Supabase
1. Vá para: https://supabase.com/dashboard/project/ivqskduqelswxvhnobqe
2. Menu lateral: **Authentication**
3. Clique em: **Third party authentication**
4. Procure por **Google** e clique para configurar
5. Cole:
   - **Client ID**: `465090348l3-d7pcu5a7pp8ua32rq1032due1t27nf.apps.googleusercontent.com`
   - **Client Secret**: (o código que começa com GOCSPX-)
6. **Enabled**: Marque como True/Activado
7. **Save** ou **Guardar**

### 3. URLs de verificação
Certifique-se que no Google Cloud Console tem exactamente:
- **Authorized JavaScript origins**: `https://ivqskduqelswxvhnobqe.supabase.co`
- **Authorized redirect URIs**: `https://ivqskduqelswxvhnobqe.supabase.co/auth/v1/callback`

### 4. Teste
Após configurar no Supabase:
1. Aguarde 2-3 minutos para aplicar as configurações
2. Teste o "Cadastrar com Google"
3. Deve redirigir para a página de consentimento do Google sem erros

## Possíveis problemas:
- Se ainda der erro, verifique se activou o Google OAuth no Supabase
- Certifique-se que copiou o Client Secret completo
- Aguarde alguns minutos pois as configurações podem demorar a aplicar