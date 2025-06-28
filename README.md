# Itaú Challenge - API de Transações

Este projeto é uma implementação do desafio de programação do Itaú Unibanco, desenvolvido em **Node.js com TypeScript** seguindo princípios de Clean Architecture e boas práticas de desenvolvimento. Você pode conferir o desafio em [CHALLENGE](CHALLENGE.md)

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── config/          # Configurações da aplicação
│   ├── env.ts       # Validação e configuração de variáveis de ambiente
│   └── prisma-client.ts
├── controller/      # Controllers da API
│   └── transaction.controller.ts
├── errors/          # Classes de erro customizadas
│   ├── future-transaction-error.ts
│   ├── invalid-fields-values.error.ts
│   └── negative-value-error.ts
├── repositories/    # Interfaces de repositórios
│   └── in-memory-transaction-repository.ts
├── services/        # Serviços de negócio
│   └── transaction.service.ts
├── types/           # Tipagens
│   └── index.ts
├── use-cases/       # Casos de uso da aplicação
│   ├── create-transaction.ts
│   ├── delete-transactions.ts
│   ├── get-statistic.ts
│   └── *.spec.ts    # Testes unitários
└── server.ts        # Configuração do servidor Express
```

### Princípios Arquiteturais Aplicados

#### 1. **Clean Architecture**
- **Controllers**: Responsáveis apenas por receber requests e retornar responses
- **Use Cases**: Contêm a lógica de negócio específica de cada operação
- **Services**: Implementam regras de negócio e coordenam operações
- **Repositories**: Abstração para acesso aos dados (in-memory)

#### 2. **Separation of Concerns**
- Cada camada tem uma responsabilidade específica
- Validações de entrada no controller
- Regras de negócio nos use cases
- Manipulação de dados nos services

#### 3. **Dependency Injection**
- Use cases recebem services via construtor
- Controllers instanciam e coordenam dependências
- Facilita testes e manutenibilidade

## 🚀 Implementação dos Endpoints

### POST /transacao
**Arquivo**: `src/use-cases/create-transaction.ts`

**Validações implementadas**:
- ✅ Campos obrigatórios (`valor` e `dataHora`)
- ✅ Valor não pode ser negativo (`valor >= 0`)
- ✅ Data não pode ser no futuro
- ✅ Validação de formato JSON com Zod

**Responses**:
- `201 Created`: Transação criada com sucesso
- `400 Bad Request`: JSON inválido
- `422 Unprocessable Entity`: Dados inválidos

### DELETE /transacao
**Arquivo**: `src/use-cases/delete-transactions.ts`

**Funcionalidade**:
- ✅ Remove todas as transações da memória

**Response**:
- `200 OK`: Transações removidas com sucesso

### GET /estatistica
**Arquivo**: `src/use-cases/get-statistic.ts`

**Funcionalidades**:
- ✅ Calcula estatísticas dos últimos 60 segundos (configurável)
- ✅ Retorna: `count`, `sum`, `avg`, `min`, `max`
- ✅ Retorna zeros quando não há transações recentes
- ✅ Suporte a janela de tempo customizada via variável de ambiente

**Response**:
- `200 OK`: Estatísticas calculadas

## 🔧 Tecnologias
- **Node.js** + **TypeScript**: Base da aplicação
- **Express**: Framework web
- **Zod**: Validação de schemas e tipos
- **Day.js**: Manipulação de datas
- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Vitest**: Framework de testes

### Execução dos Testes
```bash
# Todos os testes
npm test

# Testes específicos
npm test -- create-transaction.spec.ts
npm test -- delete-transactions.spec.ts
npm test -- get-statistic.spec.ts

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

## ⚙️ Configuração e Variáveis de Ambiente

### Arquivo .env
```bash
NODE_ENV=development
PORT=3333
STATISTICS_TIME_WINDOW_SECONDS=60  # Configurável: 60, 120, etc.
```

## 🎯 Funcionalidades Extras Implementadas

1. **Testes Automatizados**: Unitários completos com casos de sucesso, erro e edge cases
2. **Logs**: Estruturados para desenvolvimento e debug
3. **Tratamento de Erros**: Classes customizadas com mapeamento específico para status HTTP
4. **Configurações**: Janela de tempo configurável via variável de ambiente
5. **Documentação**: README e arquitetura documentada
6. **Qualidade de Código**: Linting, tipagem forte e estrutura modular
7. **Containerização**: Aplicação totalmente containerizada com Docker


## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (opcional)
cp .env.example .env

# 3. Executar em desenvolvimento
npm run dev

# 4. Executar testes
npm test

# 5. Build para produção
npm run build
npm start
```

#### Como executar com Docker:

```bash
# 1. Fazer build da imagem
docker build -t itau-challenge .

# 2. Executar o container
docker run -p 3333:3333 itau-challenge
```

---

**Made with❤️ by [nahtanPNG](https://github.com/nahtanPNG)**

