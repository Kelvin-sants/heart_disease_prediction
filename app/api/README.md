# API

Instale as dependências e inicie o servidor dentro desta pasta:

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

A rota de verificação está em `http://127.0.0.1:8000/health`.

Para executar os testes:

```bash
python -m unittest discover -s tests -v
```
