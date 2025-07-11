# 📊 Explicação Completa: Onde Estão os Dados

## 🧠 Localização Actual dos Dados:
- **Servidor**: Replit (não Supabase)
- **Armazenamento**: Memória RAM do servidor
- **Estruturas**: Map() em JavaScript
- **Dados incluem**: Perfis, sessões, avaliações, fotografias

## 🖥️ Servidor Replit:
- **Uptime actual**: 20h35m (quase 1 dia activo)
- **Localização**: Servidores virtuais da Replit
- **Tipo**: Container Docker temporário
- **Memória**: Dados ficam na RAM enquanto activo

## ⏰ Quando o Servidor Reinicia:

### Reinicializações Automáticas:
- **Manutenção Replit**: ~1-2 vezes por mês
- **Problemas técnicos**: Muito raro
- **Actualizações sistema**: Ocasionalmente

### Reinicializações Manuais:
- **Alterações código**: Reinicia automaticamente
- **Botão "Run"**: Quando para/inicia manualmente
- **Erro crítico**: Reinicia para resolver

### Reinicializações por Inactividade:
- **Contas gratuitas**: Após 1-4 horas sem actividade
- **Contas pagas**: Mantém-se activo 24h+ sem actividade

## 📈 Durabilidade dos Dados:

### Cenário Optimista:
- **Conta paga**: Dados podem durar dias/semanas
- **Actividade regular**: Servidor mantém-se activo
- **Sem alterações código**: Não reinicia automaticamente

### Cenário Realista:
- **Actividade normal**: Dados duram várias horas/dias
- **Pequenas alterações**: Reinicializações ocasionais
- **Uso regular**: Servidor mantém-se mais tempo activo

### Cenário Pessimista:
- **Conta gratuita**: Dados perdem-se mais frequentemente
- **Pouca actividade**: Reinicia por timeout
- **Muitas alterações**: Reinicializações constantes

## 🔄 Dados Perdidos vs Dados Mantidos:

### Dados que se PERDEM:
- ❌ Utilizadores registados
- ❌ Sessões de login
- ❌ Avaliações e comentários
- ❌ Fotografias de perfil

### Dados que se MANTÊM:
- ✅ Código do site
- ✅ Configurações
- ✅ Ficheiros estáticos
- ✅ Estrutura do projeto

## 🎯 Conclusão:
Os dados podem durar **várias horas ou dias** dependendo da actividade e tipo de conta. É relativamente estável para testes e uso moderado, mas não é solução permanente para produção.

## 📊 Recomendação:
- **Para testes**: Actual sistema é adequado
- **Para produção**: Necessário Supabase ou deploy noutra plataforma
- **Para desenvolvimento**: Perfeitamente funcional