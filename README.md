# API de Posts - Projeto FIAP

Projeto de uma API REST simples para gerenciar posts (tipo um blog básico). Foi desenvolvido usando Node.js, Express, PostgreSQL e Docker.

## Índice

- [Sobre](#sobre)
- [Como funciona](#como-funciona)
- [Tecnologias](#tecnologias)
- [Como rodar](#como-rodar)
- [Endpoints](#endpoints)
- [Docker](#docker)
- [Testes](#testes)

## Sobre

Basicamente é uma API que permite criar, listar, editar, buscar e deletar posts. Cada post tem título, conteúdo e autor. Os dados ficam salvos no PostgreSQL pra não perder nada quando reiniciar.

Também tem uma funcionalidade de busca por palavras-chave que procura tanto no título quanto no conteúdo dos posts.

## Como funciona

O projeto tá organizado seguindo o padrão MVC (separando as responsabilidades):

**Pastas principais:**
- `src/models/` - onde fica a lógica de acesso ao banco (Post.js)
- `src/app.js` - rotas da API (GET, POST, PUT, DELETE)
- `src/config/` - configuração do PostgreSQL
- `src/__tests__/` - testes com Jest

**Fluxo básico:**
1. Cliente faz requisição HTTP → `app.js`
2. Rotas validam os dados e chamam o Model
3. `Post.js` (model) faz as queries no PostgreSQL
4. Retorna os dados como JSON

**Tabela de posts no banco:**
- id (gerado automaticamente)
- titulo, conteudo, autor
- created_at, updated_at

Tem uns índices GIN configurados pra busca ficar mais rápida (principalmente na rota de search).

## Tecnologias

- Node.js + Express
- PostgreSQL
- Docker / Docker Compose
- Jest (pra testes)
- GitHub Actions (CI/CD)

## Como rodar

**Opção 1: Com Docker (mais fácil)**

```bash
docker-compose up -d
```

Pronto! A API vai estar em `http://localhost:3000` e o banco já configurado.

**Opção 2: Local (sem Docker)**

```bash
# instalar dependências
npm install

# copiar arquivo de configuração
cp .env.example .env

# editar o .env com suas configs do postgres

# rodar
npm start
```

## Endpoints

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/posts` | Criar post novo |
| GET | `/posts` | Listar todos |
| GET | `/posts/:id` | Pegar um post específico |
| GET | `/posts/search?q=termo` | Buscar por palavra-chave |
| PUT | `/posts/:id` | Atualizar post |
| DELETE | `/posts/:id` | Deletar post |

**Exemplo de body pra criar/atualizar:**
```json
{
  "titulo": "Título aqui",
  "conteudo": "Conteúdo do post",
  "autor": "Seu nome"
}
```

## Docker

Usar o docker-compose é mais fácil porque já sobe tudo (API + banco):

```bash
docker-compose up -d
```

Pra parar:
```bash
docker-compose down
```

Se quiser limpar o banco também:
```bash
docker-compose down -v
```

## Testes

Rodei testes usando Jest + Supertest. Testa todas as rotas (criar, listar, buscar, atualizar, deletar).

Pra rodar:
```bash
npm test
```

Se quiser ver a cobertura:
```bash
npm run test:coverage
```

**OBS:** Os testes precisam do banco rodando. Se tiver usando Docker, roda `docker-compose up -d postgres` antes.

## GitHub Actions

Tem um workflow configurado que roda os testes automaticamente toda vez que dá push. Bem útil pra garantir que nada quebrou.

O arquivo tá em `.github/workflows/ci.yml` - ele cria um banco temporário, roda os testes e faz o build do Docker.

---

Projeto desenvolvido para atividade da FIAP
