import express from "express"; 
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); 
const { Pool } = pkg; 
const app = express(); 
const port = 3000; 

// --- Conexão com o banco de dados (fora da rota) ---
const db = new Pool({
  connectionString: process.env.URL_BD,
});

let dbStatus = "ok";
try {
  // A 'await' só pode ser usada em uma função 'async'.
  // Para funcionar no nível superior, verifique se seu package.json tem "type": "module"
  await db.query("SELECT 1");
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
} catch (e) {
  dbStatus = e.message;
  console.error("Erro na conexão com o banco de dados:", dbStatus);
}
// --- Fim da conexão ---

app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");
  res.json({
    message: "API para atividade",
    author: "Daniela Almeida Oliveira",
    statusBD: dbStatus  });
});

app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});