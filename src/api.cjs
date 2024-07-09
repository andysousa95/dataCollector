require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');
const cors = require('cors');
const express = require('express');
const appApi = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

appApi.use(cors(corsOptions));
appApi.use(express.json());

appApi.get('/', (req, res) => {
  res.send('Bem-vindo(a) a esta API.');
});

const PORT = 3001;
const HOST = 'http://localhost';

appApi.listen(PORT, () => {
  console.log(`API rodando em ${HOST}:${PORT}/clientes`);
});

async function criarTabelaClientes() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        URLpesquisa VARCHAR(255) NOT NULL,
        dataehora TIMESTAMP NOT NULL,
        localidade VARCHAR(255),
        ip VARCHAR(255),
        tipo_dispositivo VARCHAR(255)
      );
    `);
    console.log('Tabela "clientes" criada com sucesso.');
  } catch (error) {
    console.error('Erro ao criar tabela "clientes":', error);
  } finally {
    client.release();
  }
}

criarTabelaClientes();

appApi.get('/clientes', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

appApi.post('/clientes', async (req, res) => {
  const { URLpesquisa, localidade, ip, tipo_dispositivo } = req.body;
  const client = await pool.connect();
  try {
    await client.query('INSERT INTO clientes (URLpesquisa, dataehora, localidade, ip, tipo_dispositivo) VALUES ($1, NOW(), $2, $3, $4)',
    [URLpesquisa, localidade, ip, tipo_dispositivo]);
    res.json( { message: 'Cliente criado com sucesso! '});
  } catch (error) {
    console.error('Erro ao criar cliente', error);
    res.status(500).json( {error: 'Erro interno do servidor '});
  } finally {
    client.release();
  }
});
