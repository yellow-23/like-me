// server.js
import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "likeme",
  port: 5432,
});

app.get("/posts", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error en GET /posts:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const query = `
      INSERT INTO posts (titulo, img, descripcion, likes)
      VALUES ($1, $2, $3, 0)
      RETURNING *;
    `;
    const values = [titulo, img, descripcion];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error en POST /posts:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      UPDATE posts 
      SET likes = likes + 1 
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Post no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error en PUT /posts/like/:id:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
