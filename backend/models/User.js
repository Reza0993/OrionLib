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

    // 3. Mencari user berdasarkan ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE id = ?";
            db.query(sql, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    // 4. Memperbarui profil user (Nama & Email)
    static updateProfile(id, name, email) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            db.query(sql, [name, email, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // 5. Memperbarui password user
    static updatePassword(id, hashedPassword) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET password = ? WHERE id = ?";
            db.query(sql, [hashedPassword, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = User;