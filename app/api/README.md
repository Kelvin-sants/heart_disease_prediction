# API

Instale as dependências e inicie o servidor dentro desta pasta:

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

A rota de verificação está em `http://127.0.0.1:8000/health`.

Para iniciar com Docker Compose a partir da raiz do projeto:

```bash
docker compose up --build
```

Para executar os testes:

```bash
python -m unittest discover -s tests -v
```
