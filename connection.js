const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'Avatar',
    ssl: true
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};