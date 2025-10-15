import request from "supertest";
import app from "../app.js";
import pool from "../config/database.js";

describe("Posts API", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM posts");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /posts", () => {
    it("deve criar um novo post", async () => {
      const newPost = {
        titulo: "Post de Teste",
        conteudo: "Conteúdo do teste",
        autor: "Testador",
      };

      const response = await request(app)
        .post("/posts")
        .send(newPost)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.titulo).toBe(newPost.titulo);
      expect(response.body.conteudo).toBe(newPost.conteudo);
      expect(response.body.autor).toBe(newPost.autor);
    });

    it("deve retornar erro 400 quando faltam campos obrigatórios", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ titulo: "Sem conteúdo" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /posts", () => {
    it("deve listar todos os posts", async () => {
      const response = await request(app).get("/posts").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /posts/:id", () => {
    it("deve retornar um post por ID", async () => {
      const result = await pool.query(
        "INSERT INTO posts (titulo, conteudo, autor) VALUES ($1, $2, $3) RETURNING id",
        ["Teste GET", "Conteúdo", "Autor"]
      );
      const postId = result.rows[0].id;

      const response = await request(app).get(`/posts/${postId}`).expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.titulo).toBe("Teste GET");
    });

    it("deve retornar 404 para post inexistente", async () => {
      const response = await request(app).get("/posts/99999").expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /posts/search", () => {
    it("deve buscar posts por palavra-chave", async () => {
      await pool.query(
        "INSERT INTO posts (titulo, conteudo, autor) VALUES ($1, $2, $3)",
        ["JavaScript", "Conteúdo sobre JS", "Dev"]
      );

      const response = await request(app)
        .get("/posts/search?q=javascript")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar erro 400 sem query string", async () => {
      const response = await request(app).get("/posts/search").expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /posts/:id", () => {
    it("deve atualizar um post", async () => {
      const result = await pool.query(
        "INSERT INTO posts (titulo, conteudo, autor) VALUES ($1, $2, $3) RETURNING id",
        ["Antes", "Conteúdo antes", "Autor"]
      );
      const postId = result.rows[0].id;

      const updatedData = {
        titulo: "Depois",
        conteudo: "Conteúdo depois",
        autor: "Autor Atualizado",
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.titulo).toBe("Depois");
      expect(response.body.conteudo).toBe("Conteúdo depois");
    });
  });

  describe("DELETE /posts/:id", () => {
    it("deve deletar um post", async () => {
      const result = await pool.query(
        "INSERT INTO posts (titulo, conteudo, autor) VALUES ($1, $2, $3) RETURNING id",
        ["Para deletar", "Conteúdo", "Autor"]
      );
      const postId = result.rows[0].id;

      await request(app).delete(`/posts/${postId}`).expect(204);

      const checkResult = await pool.query(
        "SELECT * FROM posts WHERE id = $1",
        [postId]
      );
      expect(checkResult.rows.length).toBe(0);
    });
  });
});
