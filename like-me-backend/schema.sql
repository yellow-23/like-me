DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(25),
  img VARCHAR(1000),
  descripcion VARCHAR(255),
  likes INT DEFAULT 0
);

INSERT INTO posts (titulo, img, descripcion, likes) VALUES
  ('Mi primer post', 'https://picsum.photos/200/150?random=1', 'Este es un post de ejemplo', 5),
  ('Naturaleza', 'https://picsum.photos/200/150?random=2', 'Hermoso paisaje natural', 12),
  ('Tecnología', 'https://picsum.photos/200/150?random=3', 'Las últimas novedades tech', 8);
