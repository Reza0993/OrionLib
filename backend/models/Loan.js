const db = require('../config/database');

class Loan {
    static borrowBook(userId, bookId) {
        return new Promise((resolve, reject) => {
            // Check stock first
            db.query("SELECT stock FROM books WHERE id = ?", [bookId], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error("Buku tidak ditemukan"));
                if (results[0].stock <= 0) return reject(new Error("Buku sedang tidak tersedia (habis dipinjam)"));

                // Insert into loans
                const query = "INSERT INTO loans (user_id, book_id, status) VALUES (?, ?, 'borrowed')";
                db.query(query, [userId, bookId], (err, insertRes) => {
                    if (err) return reject(err);

                    // Decrement stock
                    db.query("UPDATE books SET stock = stock - 1 WHERE id = ?", [bookId], (err) => {
                        if (err) return reject(err);
                        resolve(insertRes);
                    });
                });
            });
        });
    }

    static returnBook(userId, bookId) {
        return new Promise((resolve, reject) => {
            // Find active loan
            const query = "SELECT id FROM loans WHERE user_id = ? AND book_id = ? AND status = 'borrowed' LIMIT 1";
            db.query(query, [userId, bookId], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject(new Error("Anda tidak sedang meminjam buku ini"));

                const loanId = results[0].id;
                
                // Update loan status
                db.query("UPDATE loans SET status = 'returned', return_date = CURRENT_TIMESTAMP WHERE id = ?", [loanId], (err) => {
                    if (err) return reject(err);

                    // Increment stock
                    db.query("UPDATE books SET stock = stock + 1 WHERE id = ?", [bookId], (err) => {
                        if (err) return reject(err);
                        resolve({ success: true });
                    });
                });
            });
        });
    }

    static getUserLoans(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT l.*, b.title, b.author, b.cover_img, c.category_name 
                FROM loans l 
                JOIN books b ON l.book_id = b.id 
                LEFT JOIN categories c ON b.category_id = c.id
                WHERE l.user_id = ? AND l.status = 'borrowed'
            `;
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = Loan;
