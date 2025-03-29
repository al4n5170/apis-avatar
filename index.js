const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');

// Conexión a la base de datos PostgreSQL
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'avatar',
  password: '123',
  port: 5432,
});

app.use(express.json());
app.use(cors());

// Obtener todos los clanes
app.get("/api/clanes", async (req, res) => {
  try {
    const clanes = await db.query("SELECT * FROM clanes");
    res.status(200).json(clanes.rows); // ✅ Devuelve solo el array de los clanes
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los registros de clanes", error: error.message });
  }
});

// Obtener todas las criaturas
app.get("/api/criaturas", async (req, res) => {
  try {
    const criaturas = await db.query("SELECT * FROM criaturas");
    res.status(200).json(criaturas.rows); // ✅ Devuelve solo el array de las criaturas
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los registros de criaturas", error: error.message });
  }
});

// Obtener un clan por ID
app.get("/api/clanes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT * FROM clanes WHERE id = $1", [id]);
    if (resultado.rows.length > 0) {
      res.status(200).json(resultado.rows[0]); // ✅ Devuelve solo el clan encontrado
    } else {
      res.status(404).json({ mensaje: "Clan no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el clan", error: error.message });
  }
});

// Obtener una criatura por ID
app.get("/api/criaturas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT * FROM criaturas WHERE id = $1", [id]);
    if (resultado.rows.length > 0) {
      res.status(200).json(resultado.rows[0]); // ✅ Devuelve solo la criatura encontrada
    } else {
      res.status(404).json({ mensaje: "Criatura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la criatura", error: error.message });
  }
});

// Crear un nuevo clan
app.post("/api/clanes", async (req, res) => {
  const { nombre, region, lider } = req.body;
  try {
    const resultado = await db.query(
      "INSERT INTO clanes (nombre, region, lider) VALUES ($1, $2, $3) RETURNING *",
      [nombre, region, lider]
    );
    res.status(201).json(resultado.rows[0]); // Devuelve el clan recién creado
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el clan", error: error.message });
  }
});

// Crear una nueva criatura
app.post("/api/criaturas", async (req, res) => {
  const { nombre, tipo, habitat } = req.body;
  try {
    const resultado = await db.query(
      "INSERT INTO criaturas (nombre, tipo, habitat) VALUES ($1, $2, $3) RETURNING *",
      [nombre, tipo, habitat]
    );
    res.status(201).json(resultado.rows[0]); // Devuelve la criatura recién creada
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la criatura", error: error.message });
  }
});

// Actualizar un clan
app.put("/api/clanes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, region, lider } = req.body;
  try {
    const resultado = await db.query(
      "UPDATE clanes SET nombre = $1, region = $2, lider = $3 WHERE id = $4 RETURNING *",
      [nombre, region, lider, id]
    );
    if (resultado.rows.length > 0) {
      res.status(200).json(resultado.rows[0]); // Devuelve el clan actualizado
    } else {
      res.status(404).json({ mensaje: "Clan no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el clan", error: error.message });
  }
});

// Actualizar una criatura
app.put("/api/criaturas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, habitat } = req.body;
  try {
    const resultado = await db.query(
      "UPDATE criaturas SET nombre = $1, tipo = $2, habitat = $3 WHERE id = $4 RETURNING *",
      [nombre, tipo, habitat, id]
    );
    if (resultado.rows.length > 0) {
      res.status(200).json(resultado.rows[0]); // Devuelve la criatura actualizada
    } else {
      res.status(404).json({ mensaje: "Criatura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la criatura", error: error.message });
  }
});

// Eliminar un clan
app.delete("/api/clanes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("DELETE FROM clanes WHERE id = $1 RETURNING *", [id]);
    if (resultado.rows.length > 0) {
      res.status(200).json({ mensaje: "Clan eliminado", clan: resultado.rows[0] });
    } else {
      res.status(404).json({ mensaje: "Clan no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el clan", error: error.message });
  }
});

// Eliminar una criatura
app.delete("/api/criaturas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("DELETE FROM criaturas WHERE id = $1 RETURNING *", [id]);
    if (resultado.rows.length > 0) {
      res.status(200).json({ mensaje: "Criatura eliminada", criatura: resultado.rows[0] });
    } else {
      res.status(404).json({ mensaje: "Criatura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la criatura", error: error.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
