import express from "express";
import Post from "./models/Post.js";

const app = express();

app.use(express.json());

app.post("/posts", async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;

    if (!titulo || !conteudo || !autor) {
      return res.status(400).json({
        error: "Título, conteúdo e autor são obrigatórios",
      });
    }

    const post = await Post.create({ titulo, conteudo, autor });
    res.status(201).json(post);
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

app.get("/posts/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query string "q" é obrigatória' });
    }

    const posts = await Post.search(q);
    res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    res.status(500).json({ error: "Erro ao listar posts" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    res.json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    res.status(500).json({ error: "Erro ao buscar post" });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, autor } = req.body;

    if (!titulo || !conteudo || !autor) {
      return res.status(400).json({
        error: "Título, conteúdo e autor são obrigatórios",
      });
    }

    const post = await Post.update(id, { titulo, conteudo, autor });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    res.json(post);
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.delete(id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

export default app;
