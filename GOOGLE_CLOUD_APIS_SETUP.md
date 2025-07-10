# Como Activar APIs no Google Cloud Console

## Passo a Passo para Activar APIs

### 1. Acesse o Google Cloud Console
1. Vá para: https://console.cloud.google.com/
2. Seleccione o seu projecto (o mesmo onde criou o OAuth)

### 2. Navegue para APIs & Services
1. No menu lateral esquerdo, clique em **"APIs & Services"**
2. Clique em **"Library"** (Biblioteca)

### 3. Procure e Active as APIs Necessárias

#### API 1: Google+ API (OBRIGATÓRIA)
1. Na caixa de pesquisa, digite: **"Google+ API"**
2. Clique no resultado "Google+ API"
3. Clique no botão **"ENABLE"** (Activar)
4. Aguarde a activação (pode demorar alguns segundos)

#### API 2: People API (OBRIGATÓRIA) 
1. Volte para Library
2. Pesquise: **"People API"**
3. Clique no resultado "People API"
4. Clique no botão **"ENABLE"** (Activar)

#### API 3: Google Identity and Access Management (IAM) API
1. Volte para Library
2. Pesquise: **"Identity and Access Management (IAM) API"**
3. Clique no resultado
4. Clique no botão **"ENABLE"** (Activar)

### 4. Verificar APIs Activadas
1. Vá para **"APIs & Services"** → **"Enabled APIs & services"**
2. Deve ver na lista:
   - ✅ Google+ API
   - ✅ People API
   - ✅ Identity and Access Management (IAM) API
   - ✅ Google OAuth2 API (geralmente já activada)

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