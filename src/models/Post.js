import pool from '../config/database.js';

class Post {
  static async create({ titulo, conteudo, autor }) {
    const result = await pool.query(
      'INSERT INTO posts (titulo, conteudo, autor) VALUES ($1, $2, $3) RETURNING *',
      [titulo, conteudo, autor]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async search(query) {
    const result = await pool.query(
      `SELECT * FROM posts
       WHERE LOWER(titulo) LIKE $1 OR LOWER(conteudo) LIKE $1
       ORDER BY created_at DESC`,
      [`%${query.toLowerCase()}%`]
    );
    return result.rows;
  }

  static async update(id, { titulo, conteudo, autor }) {
    const result = await pool.query(
      'UPDATE posts SET titulo = $1, conteudo = $2, autor = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [titulo, conteudo, autor, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

export default Post;
