# Atlas — Gerenciador de Projetos Kanban

Aplicação completa de gerenciamento de projetos no estilo Kanban, inspirada no Trello. Desenvolvida como projeto de portfólio para demonstrar habilidades em desenvolvimento full-stack moderno com Next.js e React.

## Funcionalidades

- **Boards** — Crie e gerencie múltiplos quadros de projetos com visibilidade pessoal ou em equipe
- **Colunas Kanban** — Colunas com arrastar e soltar, nomes, cores e posições personalizáveis
- **Cartões** — Cartões completos com título, descrição, etiquetas, prioridade, responsável, datas e comentários
- **Etiquetas** — Crie e gerencie etiquetas coloridas por board; atribua múltiplas etiquetas aos cartões
- **Arrastar e Soltar** — Reordenação suave de cartões e colunas com `@dnd-kit`
- **Notificações** — Dropdown de notificações com contador de não lidas no cabeçalho
- **Autenticação** — Fluxo de login e cadastro com JWT
- **Modo Escuro / Claro** — Alternância de tema completa com preferência persistente via `next-themes`
- **Membros** — Convide e gerencie membros do board
- **Log de Atividades** — Rastreamento de todas as ações nos cartões (criação, edições, movimentações, comentários)
- **Comentários** — Comentários por cartão com suporte a exclusão

## Tecnologias

### Frontend
- **Next.js 15** (App Router, React 19, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — estilização com modo escuro baseado em classe
- **@dnd-kit/core + @dnd-kit/sortable** — drag-and-drop acessível
- **React Hook Form + Zod** — validação de formulários
- **Lucide React** — biblioteca de ícones
- **next-themes** — gerenciamento de tema claro/escuro
- **Sonner** — notificações toast
- **Axios** — cliente HTTP

### Backend
- **Ruby on Rails API** (repositório separado)
- API JSON RESTful com autenticação JWT
- Banco de dados PostgreSQL

## Estrutura do Projeto

```
atlas_clone_trello/
├── app/
│   ├── (auth)/           # Páginas de login e cadastro
│   └── (dashboard)/      # Rotas protegidas do dashboard
│       ├── boards/       # Lista de boards
│       └── boards/[id]/  # Visualização do board kanban
├── components/
│   ├── board/            # Cards de board, modal de configurações, modal de membros
│   ├── card/             # Modal de detalhes, comentários, atividade, etiquetas
│   ├── kanban/           # KanbanBoard, KanbanColumn, KanbanCard
│   ├── layout/           # Sidebar, Header, DashboardHeader, DashboardShell
│   └── ui/               # Componentes UI reutilizáveis (Button, Input, Modal, Avatar...)
├── contexts/             # Contextos React (Auth, Board, Notificações, Tema)
├── actions/              # Wrappers de ações de API do lado do cliente
├── services/             # Camada de serviços com Axios
├── models/               # Interfaces TypeScript
└── utils/                # Utilitários (cn, formatação de datas, constantes)
```

## Como Rodar

### Pré-requisitos

- Node.js 18+
- Servidor da API Rails em execução

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd atlas_clone_trello

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Variáveis de Ambiente

Crie um arquivo `.env.local` para configurar a URL base da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```