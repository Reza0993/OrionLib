const db = require('../config/database');

class User {
    // 1. Mencari user berdasarkan email (Dipakai saat Login & Cek Register)
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ?";
            db.query(sql, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]); // Mengembalikan data user pertama jika ada
            });
        });
    }

    // 2. Membuat user baru ke database (Dipakai saat Register)
    static create(data) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
            db.query(sql, [data.name, data.email, data.password, data.role || 'member'], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = User;