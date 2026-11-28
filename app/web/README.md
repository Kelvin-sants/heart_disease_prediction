# Web

Projeto React com Vite. Execute os comandos dentro de `app/web`:

```bash
npm install
npm run dev
```

O endereço local será informado pelo Vite no terminal.

Para gerar a versão de produção:

```bash
npm run build
```

## Docker Compose

Na raiz do projeto, execute `docker compose up --build`. O front ficará em
`http://localhost:5173` e encaminhará chamadas feitas para `/api/*` à API.
Por exemplo, `http://localhost:5173/api/health` acessa a rota `/health` da API.
