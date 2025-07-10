# APIs Google Cloud - Nomes Atualizados para 2025

## ⚠️ IMPORTANTE: Mudanças de Nome

### APIs DESCONTINUADAS:
- ❌ **Google+ API** - Foi descontinuada
- ❌ **Google Identity and Access Management (IAM) API** - Nome desatualizado

### APIs CORRETAS para 2025:

#### 1. People API (OBRIGATÓRIA)
- **Nome**: People API
- **ID do Serviço**: `people.googleapis.com`
- **Localização**: APIs & Services → Library → "People API"
- **Função**: Acesso a perfis e informações de contacto do utilizador

#### 2. Cloud Identity API (OBRIGATÓRIA)
- **Nome**: Cloud Identity API  
- **ID do Serviço**: `cloudidentity.googleapis.com`
- **Localização**: APIs & Services → Library → "Cloud Identity API"
- **Função**: Gestão de identidades e autenticação

#### 3. Google OAuth2 API (Geralmente já activada)
- **Nome**: Google OAuth2 API
- **Função**: Protocolo de autorização OAuth 2.0

## Passos Corrigidos para Activar:

1. **Acesse**: https://console.cloud.google.com/
2. **Navegue**: APIs & Services → Library
3. **Procure e active**:
   - People API
   - Cloud Identity API
   - (Google OAuth2 API se não estiver activada)

## Links Diretos:
- People API: https://console.cloud.google.com/apis/library/people.googleapis.com
- Cloud Identity API: https://console.cloud.google.com/apis/library/cloudidentity.googleapis.com

## Verificação:
Após activar, vá para **"Enabled APIs & services"** e confirme que vê:
- ✅ People API
- ✅ Cloud Identity API
- ✅ Google OAuth2 API

## Configuração OAuth Consent Screen:
1. **APIs & Services** → **OAuth consent screen**
2. **External** user type
3. Preencha informações obrigatórias
4. Adicione scopes necessários para People API

Após estas configurações, o Google OAuth deve funcionar correctamente!