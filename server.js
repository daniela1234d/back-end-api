// server.js
import express from "express";      // Requisição do pacote do express
import dotenv from "dotenv";        // Requisição do pacote dotenv para variáveis de ambiente
import { Pool } from "pg";          // Requisição do pacote pg para PostgreSQL

dotenv.config();                   // Carrega e processa o arquivo .env

const app = express();             // Instancia o Express
const port = process.env.PORT || 3000; // Usa a porta do Vercel ou 3000 localmente

app.use(express.json());           // Middleware para trabalhar com JSON (POST/PUT futuramente)

// Inicializa o Pool de conexão com o banco de dados
const db = new Pool({  
  connectionString: process.env.URL_BD,  // Conexão com o banco de dados via variáveis de ambiente
  ssl: {
    rejectUnauthorized: false, // Necessário em alguns provedores (Supabase, Neon, Render)
  },
});

// Rota raiz para teste
app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada");

  let dbStatus = "ok";  

  try {
    await db.query("SELECT 1"); 
  } catch (e) {
    dbStatus = e.message;  
  }

  res.json({
    message: "API para estudo de Node e Express",
    author: "Daniela Almeida Oliveira",  // Alteração do nome
    statusBD: dbStatus,
  });
});

// Rota para retornar todas as questões
app.get("/questoes", async (req, res) => {
  console.log("Rota GET /questoes solicitada");

  try {
    const resultado = await db.query("SELECT * FROM questoes ORDER BY id ASC"); // Consulta ordenada
    const data = resultado.rows;

    if (data.length === 0) {
      return res.status(404).json({ mensagem: "Nenhuma questão encontrada" });
    }

    res.json(data);
  } catch (e) {
    console.error("Erro ao buscar questões:", e);
    res.status(500).json({
      erro: "Erro interno do servidor",
      mensagem: "Não foi possível buscar as questões",
    });
  }
});

// ######
// Local onde o servidor irá escutar as requisições
// ######
app.listen(port, () => {
  // Inicia o servidor na porta definida
  // Um socket para "escutar" as requisições
  console.log(`Serviço rodando na porta:  ${port}`);
});