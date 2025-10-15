CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  autor VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_titulo ON posts USING gin(to_tsvector('portuguese', titulo));
CREATE INDEX IF NOT EXISTS idx_posts_conteudo ON posts USING gin(to_tsvector('portuguese', conteudo));
