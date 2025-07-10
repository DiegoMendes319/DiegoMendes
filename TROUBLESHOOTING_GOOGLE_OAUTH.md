# Solução para Erro 403 Google OAuth

## Problema Identificado
O erro 403 "Vous n'avez pas accès à cette page" acontece porque o Google OAuth ainda não está completamente configurado no Supabase.

## Verificações Importantes

### 1. No Supabase Dashboard
Vá para: https://supabase.com/dashboard/project/ivqskduqelswxvhnobqe/auth/providers

Certifique-se de que:
- ✅ Google provider está **ENABLED** (activado)
- ✅ Client ID: `465090348l3-d7pcu5a7pp8ua32rq1032due1t27nf.apps.googleusercontent.com`
- ✅ Client Secret: GOCSPX-... (código completo)
- ✅ Configurações foram **SALVAS**

### 2. No Google Cloud Console
Verifique se as URLs estão exactamente assim:
- ✅ Authorized JavaScript origins: `https://ivqskduqelswxvhnobqe.supabase.co`
- ✅ Authorized redirect URIs: `https://ivqskduqelswxvhnobqe.supabase.co/auth/v1/callback`

### 3. APIs Necessárias no Google Cloud
Certifique-se de que estas APIs estão activadas:
1. Google+ API
2. Google OAuth2 API
3. People API

Para activar:
1. Vá para Google Cloud Console
2. "APIs & Services" > "Library"
3. Procure e active cada uma das APIs acima

## Solução Temporária
Enquanto resolve o Google OAuth, pode usar o registo por email que já funciona perfeitamente.

## Teste Final
Após todas as configurações:
1. Aguarde 5-10 minutos
2. Limpe cache do navegador
3. Teste novamente o Google OAuth

Se continuar com erro, use o registo por email que está a funcionar correctamente.