# Configuração do Google OAuth no Supabase

## Problema
Quando clica em "Cadastrar com Google", recebe uma página de erro dizendo que não tem acesso. Isto acontece porque o Google OAuth ainda não está configurado correctamente.

## Solução Passo a Passo

### 1. Configurar Google Cloud Console

1. **Acesse**: https://console.cloud.google.com/
2. **Crie um projeto** ou seleccione um existente
3. **Vá para**: "APIs & Services" > "Credentials" 
4. **Clique**: "Create Credentials" > "OAuth 2.0 Client IDs"
5. **Configure**:
   - Application type: **Web application**
   - Name: `Jikulumessu OAuth`
   - Authorized JavaScript origins: `https://[SEU-PROJETO].supabase.co`
   - Authorized redirect URIs: `https://[SEU-PROJETO].supabase.co/auth/v1/callback`

**Importante**: Substitua `[SEU-PROJETO]` pelo ID real do seu projecto Supabase.

### 2. Configurar Supabase

1. **Vá para**: https://supabase.com/dashboard
2. **Seleccione** o seu projecto
3. **Clique** em "Authentication" (menu lateral)
4. **Clique** em "Third party authentication" (como visto na sua imagem)
5. **Procure** por "Google" e **active**
6. **Cole**:
   - Client ID: (do Google Cloud Console)
   - Client Secret: (do Google Cloud Console)
7. **Salve** as configurações

### 3. URLs Importantes

**Seu projeto Supabase**: `https://ivqskduqelswxvhnobqe.supabase.co`

**URLs para configurar no Google**:
- JavaScript origins: `https://ivqskduqelswxvhnobqe.supabase.co`
- Redirect URI: `https://ivqskduqelswxvhnobqe.supabase.co/auth/v1/callback`

### 4. Verificação

Após configurar:
1. Teste o login com Google
2. Deve redirigir para a página de consentimento do Google
3. Após autorizar, volta para a aplicação já autenticado

## Notas

- Certifique-se de usar HTTPS nos URLs
- O Google pode demorar alguns minutos para aplicar as configurações
- Se continuar com erro, verifique se os URLs estão exactamente iguais