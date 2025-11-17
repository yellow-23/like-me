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

// Modelo: getPosts (ejemplo con manejo de errores)
const getPosts = async () => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    return result.rows;
  } catch (error) {
    console.error("Error al obtener posts:", error);
    throw new Error("Error en la consulta SQL");
  }
};

app.get("/posts", async (req, res) => {
  try {
    const rows = await getPosts();
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

// PUT - actualizar un post en general
app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, img, descripcion, likes } = req.body;

    // Construir query dinámicamente basado en campos proporcionados
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (titulo !== undefined) {
      updates.push(`titulo = $${paramIndex++}`);
      values.push(titulo);
    }
    if (img !== undefined) {
      updates.push(`img = $${paramIndex++}`);
      values.push(img);
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramIndex++}`);
      values.push(descripcion);
    }
    if (likes !== undefined) {
      updates.push(`likes = $${paramIndex++}`);
      values.push(likes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `
      UPDATE posts 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} 
      RETURNING *;
    `;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Error en PUT /posts/:id:", error);
    res.status(500).json({ error: "Error al actualizar el post" });
  }
});

// DELETE - eliminar un post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM posts WHERE id = $1 RETURNING *;";
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json({ message: "Post eliminado correctamente" });

  } catch (error) {
    console.error("Error en DELETE /posts/:id:", error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
