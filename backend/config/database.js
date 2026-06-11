const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal: ' + err.stack);
        return;
    }
    console.log('Berhasil terhubung ke database MySQL.');
});

module.exports = connection;