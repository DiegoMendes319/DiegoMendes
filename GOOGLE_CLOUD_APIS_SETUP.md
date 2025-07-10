# Como Activar APIs no Google Cloud Console

## Passo a Passo para Activar APIs

### 1. Acesse o Google Cloud Console
1. Vá para: https://console.cloud.google.com/
2. Seleccione o seu projecto (o mesmo onde criou o OAuth)

### 2. Navegue para APIs & Services
1. No menu lateral esquerdo, clique em **"APIs & Services"**
2. Clique em **"Library"** (Biblioteca)

### 3. Procure e Active as APIs Necessárias (Nomes Atualizados 2025)

#### API 1: People API (OBRIGATÓRIA)
1. Na caixa de pesquisa, digite: **"People API"**
2. Clique no resultado "People API" (people.googleapis.com)
3. Clique no botão **"ENABLE"** (Activar)
4. Aguarde a activação (pode demorar alguns segundos)

#### API 2: Cloud Identity API (OBRIGATÓRIA) 
1. Volte para Library
2. Pesquise: **"Cloud Identity API"**
3. Clique no resultado "Cloud Identity API" (cloudidentity.googleapis.com)
4. Clique no botão **"ENABLE"** (Activar)

#### API 3: Google OAuth2 API (Geralmente já activada)
1. Volte para Library
2. Pesquise: **"Google OAuth2 API"**
3. Se não estiver activada, clique em **"ENABLE"**

**NOTA IMPORTANTE**: A Google+ API foi descontinuada. As funcionalidades necessárias estão agora na People API.

### 4. Verificar APIs Activadas
1. Vá para **"APIs & Services"** → **"Enabled APIs & services"**
2. Deve ver na lista:
   - ✅ People API (people.googleapis.com)
   - ✅ Cloud Identity API (cloudidentity.googleapis.com)
   - ✅ Google OAuth2 API (geralmente já activada)
   - ✅ Gmail API (se necessário para notificações)

### 5. Configurar Tela de Consentimento OAuth (Se necessário)
1. Vá para **"APIs & Services"** → **"OAuth consent screen"**
2. Seleccione **"External"** como User Type
3. Preencha:
   - App name: **Jikulumessu**
   - User support email: (seu email)
   - Developer contact: (seu email)
4. Adicione **Scopes** necessários:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Salve as configurações

### 6. Teste Final
Após activar todas as APIs:
1. Aguarde 5-10 minutos para aplicar
2. Teste o Google OAuth na aplicação
3. Deve funcionar sem o erro 403

## URLs de Referência Rápida
- Google Cloud Console: https://console.cloud.google.com/
- APIs Library: https://console.cloud.google.com/apis/library
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent

## Nota Importante
Se continuar com erro após activar as APIs, verifique também se:
- O projecto Google Cloud é o mesmo onde criou as credenciais OAuth
- As credenciais foram copiadas correctamente para o Supabase
- Aguardou tempo suficiente para as configurações aplicarem