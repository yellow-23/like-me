import { useEffect, useState } from "react";

const API = "http://localhost:3000/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [img, setImg] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarPosts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar posts:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    cargarPosts();
  }, []);
  

  const crearPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, img, descripcion }),
      });
      if (res.ok) {
        setTitulo("");
        setImg("");
        setDescripcion("");
        cargarPosts();
      }
    } catch (error) {
      console.error("Error al crear post:", error);
      alert("Error al crear el post. Verifica que el backend esté corriendo.");
    }
  };

  const darLike = async (id) => {
    try {
      const res = await fetch(`${API}/like/${id}`, {
        method: "PUT",
      });
      if (res.ok) {
        cargarPosts();
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <form
        onSubmit={crearPost}
        style={{ background: "#0B4F9E", padding: "1rem", width: "280px", color: "#fff" }}
      >
        <h3>Agregar post</h3>
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} />
        <label>URL de la imagen</label>
        <input value={img} onChange={(e) => setImg(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} />
        <label>Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }} />
        <button type="submit" style={{ width: "100%" }}>
          Agregar
        </button>
      </form>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {posts.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", width: "230px" }}>
            {p.img ? (
              <img src={p.img} alt={p.titulo} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            ) : null}
            <div style={{ padding: "0.5rem" }}>
              <h4>{p.titulo}</h4>
              <p>{p.descripcion}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => darLike(p.id)}
                  style={{ 
                    fontSize: "1.2rem", 
                    padding: "0.2rem 0.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  ❤️
                </button>
                <span style={{ fontSize: "0.9rem" }}>{p.likes || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
