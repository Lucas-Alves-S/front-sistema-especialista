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

O arquivo [`mock/db.json`](mock/db.json) simula as respostas da API durante o desenvolvimento. O mock intercepta toda requisição `POST /api/questions` e roteia internamente com base no corpo da requisição.

### Estrutura do `db.json`

O arquivo é um mapa plano onde cada chave é o ID de um nó da árvore de decisão:

```json
{
  "root": {
    "question": "Texto da pergunta",
    "answers": ["Opção 1", "Opção 2"],
    "next_ids": ["id-proximo-1", "id-proximo-2"]
  },
  "id-proximo-1": {
    "question": "...",
    "answers": [],
    "next_ids": []
  }
}
```

- **`question`** — texto exibido ao usuário.
- **`answers`** — lista de textos das opções de resposta (mesma ordem que `next_ids`).
- **`next_ids`** — IDs dos nós para onde cada resposta leva. Nós folha (resultado final) têm ambas as listas vazias.

### Contrato da API

Único endpoint: `POST /api/questions`

**Primeira chamada** (enviada pelo Home ao descrever o sintoma):
```json
{ "symptom": "descrição do problema" }
```

**Chamadas subsequentes** (enviadas pelo Expert ao selecionar uma resposta):
```json
{ "meta": { "question_id": "root" }, "selected": 0 }
```

> `selected` é o índice da opção escolhida pelo usuário.

**Resposta em ambos os casos:**
```json
{
  "question": "Texto da pergunta",
  "answers": ["Opção 1", "Opção 2"],
  "meta": { "question_id": "root" }
}
```

> O campo `meta` deve ser enviado de volta na próxima requisição para que o backend (ou mock) saiba de qual nó partir.

O mock só está ativo no servidor de desenvolvimento (`pnpm dev`). No build de produção ele não é incluído.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento com hot-reload e mock ativo |
| `pnpm build` | Gera o build de produção em `dist/` |
| `pnpm preview` | Serve o build de produção localmente |

## Estrutura de telas

- **Home** — campo de texto para descrever o sintoma inicial. Ao enviar, chama `POST /api/questions` e navega para a tela Expert com a primeira pergunta.
- **Expert** — exibe a pergunta atual e as opções de resposta. Ao selecionar uma opção, chama `POST /api/questions` com o `meta` recebido e o índice selecionado para avançar no fluxo.
- **Adicionar Pergunta** — formulário para cadastrar uma nova pergunta com suas opções de resposta. Acessível pelo botão no canto superior esquerdo da Home.
