const db = require('../config/database');

class Book {
    // 1. Ambil Semua Buku (Read All)
    static all() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT books.*, categories.category_name 
                FROM books 
                LEFT JOIN categories ON books.category_id = categories.id
            `;
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // 2. Ambil Buku Berdasarkan ID (Read Detail)
    static find(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM books WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    // 3. Tambah Buku Baru (Create)
    static create(data) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO books SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // 4. Update Data Buku (Update)
    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE books SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // 5. Hapus Buku (Delete)
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM books WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = Book;