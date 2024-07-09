const { Pool } = require('pg');

const pool = new Pool ({
  user: 'nhiwju_integra',
  host: 'postgres-ag-br1-4.hospedagemelastica.com.br',
  database: 'nhiwju_integra',
  password: 'aim6pyxqRT',
  port: 54228,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}
