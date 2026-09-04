# Guia rápido para integração com o backend

## Rotas

### Cadastro

`POST /usuarios`

Request:

```json
{
  "nome": "Maria da Silva",
  "email": "maria@email.com",
  "dataNascimento": "2002-05-10",
  "senha": "123456"
}
```

Resposta sugerida:

```json
{
  "message": "Usuário criado com sucesso."
}
```

Status sugerido: `201`.

### Login

`POST /login`

Request:

```json
{
  "email": "maria@email.com",
  "senha": "123456"
}
```

Resposta sugerida:

```json
{
  "message": "Login realizado com sucesso.",
  "token": "TOKEN_GERADO_PELO_BACKEND"
}
```

Status sugerido: `200`.

## Erros

O frontend entende preferencialmente:

```json
{
  "message": "E-mail ou senha incorretos."
}
```

ou:

```json
{
  "error": "E-mail já cadastrado."
}
```

## CORS

Como o Vite normalmente roda em `http://localhost:5173` e o backend poderá rodar em `http://localhost:3000`, o backend deverá permitir requisições do frontend (CORS).

## O que não deve ser feito

- Não salvar senha em texto puro no banco.
- Não salvar a senha no `localStorage`.
- Não colocar senha ou credenciais reais no GitHub.
- Não colocar o arquivo `.env` real no GitHub se ele contiver informações sensíveis.

## Caso as rotas mudem

Altere somente:

`frontend/src/services/api.js`

Exemplo:

```js
return request('/api/auth/cadastro', {
  method: 'POST',
  body: JSON.stringify(dados)
});
```
