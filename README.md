# VetAgenda Frontend — React + Vite

Interface web para o sistema de agendamentos veterinários VetAgenda API.

## Stack

- **React 19** + **Vite**
- **React Router DOM v7** — navegação client-side
- **CSS Modules** — estilos isolados por componente
- **Fetch API** — sem dependências externas de HTTP

## Estrutura de pastas

```
src/
├── api/
│   └── client.js              # Todas as chamadas à API (agendamentos, animais, tutores, vets)
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx      # Wrapper com sidebar + topbar
│   │   ├── Sidebar.jsx        # Menu lateral com navegação
│   │   └── Topbar.jsx         # Barra superior com título e data
│   └── ui/
│       ├── Badge.jsx          # StatusBadge e EspBadge
│       ├── Button.jsx         # Botão reutilizável (variants: primary/secondary/ghost/danger)
│       ├── EmptyState.jsx     # Estado vazio de tabelas
│       ├── Form.jsx           # FormGrid, FormGroup, Label, Input, Select, Textarea
│       ├── Modal.jsx          # Modal genérico com overlay + animação
│       └── Toast.jsx          # Notificações de feedback
├── hooks/
│   ├── ToastContext.jsx       # Context global para toast
│   └── useToast.js            # Hook de estado dos toasts
├── pages/
│   ├── Dashboard/             # Métricas, timeline, ações rápidas
│   ├── Agendamentos/          # CRUD completo com filtros e ações de status
│   ├── Animais/               # CRUD com data no formato DD/MM/YYYY (backend Java)
│   ├── Tutores/               # CRUD com CPF obrigatório
│   └── Veterinarios/          # CRUD com consultas ativas calculadas dinamicamente
├── styles/
│   └── globals.css            # Variáveis CSS e reset global
└── utils/
    └── helpers.js             # formatDate, toBackendDate, animalEmoji, getInitials...
```

## Como rodar

**Pré-requisito:** API rodando em `http://localhost:8080`

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Correções do backend aplicadas

| Ponto | Correção |
|---|---|
| `a.nomeAnimal` / `a.nomeVeterinario` / `a.nomeTutor` | Campos corretos dos DTOs de response |
| `dataNascimento` → `DD/MM/AAAA` | Função `toBackendDate()` converte antes do POST |
| `status: 'AGENDADO'` fixo no POST | Campo não editável pelo usuário na criação |
| `cpf` obrigatório no tutor | Campo presente e validado no front |
| Consultas ativas do vet | Calculadas via `a.nomeVeterinario === v.name` |
