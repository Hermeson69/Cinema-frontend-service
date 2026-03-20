# Cinema Frontend Service

<div align="center">
  <img src="src/assets/logocine.png" alt="Cinema Logo" width="150" height="150" />
</div>

Interface web para gerenciamento de clientes e reservas de assentos em um sistema de cinema.

## Resumo rápido

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Shadcn/ui (Radix + Nova preset)
- Zod (validação de schemas)
- React Router v7 (navegação)
- React Hooks (state management)

## Instalação

Instale dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz com as variáveis mínimas:

```
VITE_BACKEND_URL=
```

> **Nota**: Se deixar vazio, o Vite proxy interceptará `/api` e redirecionará para `http://localhost:3000` (configurado em `vite.config.ts`).

## Scripts úteis

- `npm run dev` — Inicia servidor de desenvolvimento (porta 5173)
- `npm run build` — Compila TypeScript e otimiza para produção
- `npm run lint` — Executa ESLint
- `npm run preview` — Preview da build de produção

## Configuração de ambiente

### Variáveis de ambiente

```bash
# .env (deve ficar na raiz do projeto)
VITE_BACKEND_URL=
```

Se o backend está em outra porta/máquina, configure:

```bash
VITE_BACKEND_URL=http://api.seu-dominio.com:3000
```

### Proxy (Vite Dev Server)

O arquivo `vite.config.ts` já contém proxy configurado:

```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      changeOrigin: true,
      rewrite: (path) => path,
    },
  },
}
```

Isso significa que em desenvolvimento, requisições para `/api/*` são redirecionadas automaticamente para o backend, evitando problemas de CORS.

## Como rodar localmente

1. **Configure .env** (veja acima).

2. **Certifique-se de que o backend está rodando**:

   ```bash
   cd ../Cinema-Backend-Api
   npm run dev
   ```

3. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

   O app estará disponível em `http://localhost:5173`.

## Estrutura de pastas

```
src/
├── api/              # Endpoints centralizados
├── components/       # Componentes React (UI + shadcn)
├── hooks/            # Custom hooks (useAuth, etc.)
├── pages/            # Páginas/Views (rotas)
├── services/         # Services (auth, seats, clients)
├── types/            # Tipos & Schemas Zod
├── utils/            # Utilitários (requests, error handling)
├── App.tsx           # Configuração de rotas
└── main.tsx          # Entry point
```

## Rotas principais

- `/` — Página de login
- `/signup` — Página de cadastro
- `/reservas` — Mapa de assentos (reserva/cancelamento)

## Endpoints utilizados

### Auth

- `POST /api/auth/register/` — Registro de novo cliente
- `POST /api/auth/login/` — Login de cliente

### Seats

- `GET /api/seats/` — Lista todos os assentos (ordenados naturalmente: A1, A2, ..., A10...)
- `PUT /api/seats/{publicId}/` — Atualiza assento (reserva/cancela via header `x-client-id`)

## Tipos & Validação

Todos os tipos e schemas Zod estão em `src/types/schemas.ts`:

- `LoginData` — Email + password
- `ClientCreate` — Name + email + password
- `AuthResponse` — Token + client info
- `CreateSeatData`, `UpdateSeatData` — Validações para assentos
- `SeatResponse` — Resposta de assento

Use-os para tipagem TypeScript e validação em tempo de execução.

## Services

Cada serviço centraliza chamadas HTTP para um recurso:

- `src/services/auth.service.ts` — Login, registro
- `src/services/seats.service.ts` — Listar, reservar, cancelar assentos

**Exemplo de uso**:

```typescript
import { SeatService } from "@/services/seats.service";

const seats = await SeatService.list(token);
await SeatService.reserve(seatId, clientId, token);
await SeatService.cancel(seatId, token);
```

## Hooks

- `useAuth()` — Gerencia autenticação (login, logout, estado do usuário)

## Observações importantes

- O proxy do Vite é apenas para **desenvolvimento**. Em produção, configure CORS no backend ou use um reverse proxy (nginx, etc.).
- Todas as validações de entrada usam schemas Zod (`src/types/schemas.ts`).
- Token JWT é armazenado em `localStorage` após login.
- Headers customizados (como `x-client-id`) são adicionados em `src/services/seats.service.ts`.

## Troubleshooting

### Erro: "NetworkError when attempting to fetch resource"

- Verifique se o backend está rodando em `http://localhost:3000`
- Verifique se `VITE_BACKEND_URL` está vazio ou correto em `.env`
- Reinicie o servidor dev: `npm run dev`

### CORS bloqueando requisições

- O proxy do Vite resolve isso em desenvolvimento
- Em produção, ative CORS no backend ou use reverse proxy

## Contribuição

- Abra uma issue descrevendo o problema ou feature
- Faça um branch com mudanças claras e um PR com descrição
- Mantenha a estrutura de pastas e o padrão de tipos Zod

## Contato

- **Repositório**: [Hermeson69/Cinema-frontend-service](https://github.com/Hermeson69/Cinema-frontend-service)
- **Backend**: [Hermeson69/Cinema-Backend-Api](https://github.com/Hermeson69/Cinema-Backend-Api)

## Screenshots

<div align="center">

### _ Tela de Login _

![Login](<src/assets/images.readme/Captura de tela de 2026-03-19 21-03-47.png>)

### _ Mapa de Assentos _

![Assentos](<src/assets/images.readme/Captura de tela de 2026-03-19 21-03-52.png>)

### _ Detalhes da Reserva _

![Reserva](<src/assets/images.readme/Captura de tela de 2026-03-19 21-04-31.png>)

</div>

---

**Grupo**: Hermeson, Gustavo, Raildom, Rayssa
