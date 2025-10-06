# L0gic Landing Page

Landing page profissional desenvolvida para a empresa L0gic, com formulário de contato integrado e sistema de tracking avançado.

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript

## Características Principais

### Design e Interface
- Interface profissional baseada no branding da L0gic
- Design responsivo para desktop, tablet e mobile
- Cor de destaque personalizada (#00FF00)
- Componentes reutilizáveis e acessíveis

### Formulário de Contato
- Campos: nome, email, telefone, cargo, data de nascimento, mensagem
- Validação em tempo real com feedback visual
- Sanitização e validação de dados no frontend e backend
- Tratamento de erros robusto

### Sistema de Tracking
- Tracking automático de parâmetros UTM:
  - utm_source
  - utm_medium
  - utm_campaign
  - utm_term
  - utm_content
- Suporte para Google Ads (gclid) e Facebook Ads (fbclid)
- Hooks customizados para gerenciamento de tracking
- Configuração do Google Tag Manager

## Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   ├── health/        # Endpoint de health check
│   │   └── users/         # Endpoint para formulário
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── ContactForm.tsx    # Formulário de contato
│   ├── DynamicLandingPage.tsx # Página principal
│   ├── ReactQueryProvider.tsx # Provider do React Query
│   └── TrackingInitializer.tsx # Inicializador de tracking
├── hooks/                 # Custom hooks
│   ├── usePageView.tsx    # Hook para page views
│   ├── useTracking.tsx    # Hook principal de tracking
│   └── useUrlTracking.tsx # Hook para tracking de URL
├── lib/                   # Utilitários e configurações
│   ├── api.ts            # Cliente HTTP
│   ├── dataValidation.ts # Validações de dados
│   ├── gtmConfig.ts      # Configuração GTM
│   ├── utils.ts          # Utilitários gerais
│   └── validation.ts     # Esquemas de validação
├── services/             # Serviços
│   ├── layoutService.ts  # Serviço de layout
│   └── userService.ts    # Serviço de usuários
└── types/                # Definições de tipos
    └── api.ts            # Tipos da API
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/alexandremendes381/L0gic_landing_page.git

# Entre no diretório
cd L0gic_landing_page

# Instale as dependências
npm install
```

### Configuração de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Configure as variáveis de ambiente no arquivo `.env.local`:
3. Online: `https://l0gic-landingpage-vr9l.vercel.app/`
4. API REAL VERCEL NEXT_PUBLIC_API_URL=https://l0gic-backend-node.vercel.app

```env
# Configurações da aplicação
NEXT_PUBLIC_API_URL=https://sua-api-url-aqui.com

# Configuração do Google Tag Manager (opcional)
# Obtenha seu GTM ID em: https://tagmanager.google.com/
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Configurações de banco de dados (se aplicável no futuro)
DATABASE_URL=your_database_url_here
```

**Variáveis importantes:**
- `NEXT_PUBLIC_API_URL`: URL da API para envio do formulário
- `NEXT_PUBLIC_GTM_ID`: ID do Google Tag Manager (opcional, mas recomendado para tracking)

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Servidor de produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## API Endpoints

### POST /api/users
Endpoint para envio do formulário de contato.

**Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "telefone": "string",
  "cargo": "string",
  "dataNascimento": "string",
  "mensagem": "string",
  "tracking": {
    "utm_source": "string",
    "utm_medium": "string",
    "utm_campaign": "string",
    "utm_term": "string",
    "utm_content": "string",
    "gclid": "string",
    "fbclid": "string"
  }
}
```

### GET /api/health
Endpoint de health check da aplicação.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Funcionalidades de Tracking

### Parâmetros UTM Suportados
- **utm_source**: Fonte do tráfego (google, facebook, newsletter)
- **utm_medium**: Meio de marketing (cpc, email, social)
- **utm_campaign**: Nome da campanha
- **utm_term**: Palavras-chave (para campanhas pagas)
- **utm_content**: Diferenciação de conteúdo ou versão do anúncio

### Tracking de Anúncios
- **gclid**: Google Ads Click Identifier
- **fbclid**: Facebook Click Identifier

### Implementação
O sistema de tracking é implementado através de hooks personalizados que:
1. Capturam parâmetros da URL na primeira visita
2. Armazenam dados no localStorage
3. Incluem informações no envio do formulário
4. Integram com Google Tag Manager para analytics

## Contribuição

### Padrões de Código
- Use TypeScript para todos os arquivos
- Siga as convenções do ESLint configurado
- Utilize Prettier para formatação
- Escreva componentes funcionais com hooks

### Estrutura de Commits
```
tipo(escopo): descrição

Exemplos:
feat(contact): adicionar validação de telefone
fix(tracking): corrigir capture de parâmetros UTM
docs(readme): atualizar documentação da API
```

## Licença

Este projeto é propriedade da L0gic e é destinado apenas para uso interno e demonstração profissional.

## Contato

Para dúvidas sobre o projeto, entre em contato através dos canais oficiais da L0gic.