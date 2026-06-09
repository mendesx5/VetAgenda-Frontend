# 🐾 VetAgenda Frontend

> Interface web do sistema de gestão para clínicas veterinárias — construída com React 19, Vite e CSS Modules.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=reactrouter)](https://reactrouter.com/)
[![Status](https://img.shields.io/badge/Status-v1.1-brightgreen?style=flat-square)]()

---

## 📋 Sobre o Projeto

Interface do **VetAgenda**, consumindo a [VetAgenda API](https://github.com/mendesx5/VetAgenda-api). O frontend cobre login autenticado com JWT, controle de acesso por roles na interface, e CRUD completo das entidades do sistema.

> **Nota:** o foco do projeto é o backend. O frontend foi desenvolvido com vibecoding (React + AI) para validar a integração do sistema de ponta a ponta.

---

## ⚙️ Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Roteamento | React Router DOM v7 |
| Estilização | CSS Modules + variáveis CSS globais |
| HTTP | Fetch API nativa |
| Autenticação | JWT via `localStorage` + `AuthContext` |

---

## 🔐 Autenticação e Controle de Acesso

O sistema implementa autenticação completa integrada com o backend Spring Security + JWT.

**Fluxo:**
1. Usuário faz login em `/login` → API retorna `{ token, role }`
2. Token e role são salvos no `localStorage` (`vetagenda_token`, `vetagenda_role`)
3. Todas as requisições incluem `Authorization: Bearer <token>` automaticamente
4. Em qualquer resposta `401` ou `403`, o sistema desloga e redireciona para `/login`
5. `ProtectedRoute` bloqueia acesso a rotas autenticadas sem token válido

**Roles e visibilidade na interface:**

| Role | O que vê na sidebar |
|---|---|
| `ADMIN` | Dashboard, Agendamentos, Animais, Tutores, Veterinários + **Gerenciar Equipe** |
| `VETERINARIO` | Dashboard, Agendamentos, Animais, Tutores, Veterinários |
| `RECEPCIONISTA` | Dashboard, Agendamentos, Animais, Tutores, Veterinários |

A sidebar exibe o nível de acesso do usuário logado com cor dinâmica por role.

---

## 📱 Telas

| Tela | Descrição |
|---|---|
| **Login** | Formulário dual (entrar / criar conta), integrado com `/auth/login` e `/auth/register` |
| **Dashboard** | 5 métricas em tempo real, timeline de próximos agendamentos ativos, resumo geral, ações rápidas |
| **Agendamentos** | Tabela com filtros por status (Todos / Agendados / Confirmados / Concluídos / Cancelados), busca, e ações de confirmar → concluir → cancelar → excluir |
| **Animais** | Listagem com emoji por espécie, cadastro completo |
| **Tutores** | Listagem com avatar de iniciais, cadastro com CPF |
| **Veterinários** | Listagem com badge de especialidade e contador de consultas ativas |
| **Gerenciar Equipe** | Visível apenas para `ADMIN` — gerenciamento de usuários do sistema |

---

## 🏗️ Estrutura de Pastas

```
src/
├── api/
│   └── client.js                  # Requisições à API com JWT automático + redirect em 401/403
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx     # Guard de rotas autenticadas (suporta allowedRoles)
│   ├── layout/
│   │   ├── AppLayout.jsx          # Wrapper: sidebar + topbar + <Outlet>
│   │   ├── Sidebar.jsx            # Navegação com perfil do usuário e seção ADMIN condicional
│   │   └── Topbar.jsx             # Barra superior com título da página e data atual
│   └── ui/
│       ├── Badge.jsx              # StatusBadge (AGENDADO/CONFIRMADO/CONCLUIDO/CANCELADO) e EspBadge
│       ├── Button.jsx             # Variantes: primary / secondary / ghost / danger; tamanhos: md / sm / icon
│       ├── EmptyState.jsx         # Estado vazio de tabelas
│       ├── Form.jsx               # FormGrid, FormGroup, Label, Input, Select, Textarea, FormHint
│       ├── Modal.jsx              # Modal genérico com overlay, fechar por ESC e click fora
│       └── Toast.jsx              # Notificações de feedback (success / error)
├── context/
│   └── AuthContext.jsx            # Estado global de autenticação: login(), logout(), user, authenticated
├── hooks/
│   ├── ToastContext.jsx           # Provider global do Toast
│   └── useToast.js                # Hook interno de gerenciamento de toasts
├── pages/
│   ├── Login/                     # Tela de login e cadastro de conta
│   ├── Dashboard/                 # Métricas, timeline de agendamentos, resumo e ações rápidas
│   ├── Agendamentos/              # CRUD com filtros, busca e fluxo completo de status
│   ├── Animais/                   # Listagem e cadastro de animais
│   ├── Tutores/                   # Listagem e cadastro de tutores
│   ├── Veterinarios/              # Listagem e cadastro de veterinários
│   └── Usuarios/                  # Gerenciamento de equipe (exclusivo ADMIN)
├── services/
│   └── api.js                     # Utilitário genérico de requisições com JWT
├── styles/
│   └── globals.css                # Design system: variáveis CSS de cor, tipografia, sombra e espaçamento
└── utils/
    └── helpers.js                 # formatDate, toBackendDate (YYYY-MM-DD → DD/MM/YYYY), animalEmoji, getInitials
```

---

## 🚀 Como Rodar

**Pré-requisito:** [VetAgenda API](https://github.com/mendesx5/VetAgenda-api) rodando em `http://localhost:8080`

```bash
# 1. Clone o repositório
git clone https://github.com/mendesx5/VetAgenda-Frontend.git
cd VetAgenda-Frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

### Primeiro acesso

Com a API rodando, crie um usuário ADMIN pela tela de login clicando em **"Criar Conta (Dev)"**:

```
Login: admin@vetagenda.com
Senha: sua_senha
Role: ADMIN
```

---

## 🔗 Integração com o Backend

O arquivo `src/api/client.js` centraliza todas as chamadas à API:

- Header `Authorization: Bearer <token>` injetado automaticamente em toda requisição
- Redirect automático para `/login` ao receber `401` ou `403`
- Conversão de data: `toBackendDate()` converte `YYYY-MM-DD` (input HTML) → `DD/MM/YYYY` (`@JsonFormat` do Java)
- Status inicial dos agendamentos fixado como `AGENDADO` no POST (conforme regra do backend)

---

## 👨‍💻 Autor

**Gabriel Mendes**

[![GitHub](https://img.shields.io/badge/GitHub-mendesx5-181717?style=flat-square&logo=github)](https://github.com/mendesx5)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-gabrielmendes06-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/gabrielmendes06)