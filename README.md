# Front - Sistema Especialista

Interface Vue 3 para um sistema especialista baseado em perguntas e respostas dinâmicas.

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL base da API de backend (sem barra no final)
# Exemplo real:
VITE_API_BASE=http://localhost:3000

# Deixe vazio para usar o mock local (modo de desenvolvimento sem backend):
# VITE_API_BASE=
```

> Quando `VITE_API_BASE` está vazio, as chamadas são feitas para o mesmo host do servidor de desenvolvimento (`/api/...`), onde o plugin de mock do Vite intercepta as requisições.

## Mock local (sem backend)

O arquivo [`mock/db.json`](mock/db.json) simula as respostas da API durante o desenvolvimento. Edite-o para adicionar ou alterar perguntas e fluxos do sistema especialista.

O mock intercepta requisições `POST` cujo path corresponda a uma chave no `db.json`. O formato esperado de cada entrada é:

```json
{
  "/api/symptom": {
    "question": "Texto da pergunta gerada pelo sistema",
    "answers": [
      { "answer": "Opção 1", "api_url": "/api/proxima-pergunta-1" },
      { "answer": "Opção 2", "api_url": "/api/proxima-pergunta-2" }
    ]
  },
  "/api/proxima-pergunta-1": {
    "question": "...",
    "answers": [...]
  }
}
```

O mock só está ativo no servidor de desenvolvimento (`pnpm dev`). No build de produção ele não é incluído.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento com hot-reload e mock ativo |
| `pnpm build` | Gera o build de produção em `dist/` |
| `pnpm preview` | Serve o build de produção localmente |

## Estrutura de telas

- **Home** — campo de texto para descrever o sintoma inicial e iniciar o diagnóstico.
- **Expert** — tela dinâmica que exibe a pergunta retornada pela API e as opções de resposta. Cada opção chama o endpoint definido em `api_url` para avançar no fluxo.
