const db = require('../config/database');

class SavedBook {
    static save(userId, bookId) {
        return new Promise((resolve, reject) => {
            const query = "INSERT IGNORE INTO saved_books (user_id, book_id) VALUES (?, ?)";
            db.query(query, [userId, bookId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static unsave(userId, bookId) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM saved_books WHERE user_id = ? AND book_id = ?";
            db.query(query, [userId, bookId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static getUserSavedBooks(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.id as saved_id, b.*, c.category_name 
                FROM saved_books s 
                JOIN books b ON s.book_id = b.id 
                LEFT JOIN categories c ON b.category_id = c.id
                WHERE s.user_id = ?
            `;
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = SavedBook;
