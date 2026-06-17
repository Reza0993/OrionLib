const db = require('../config/database');

class Loan {
    static borrowBook(userId, bookId) {
        return new Promise((resolve, reject) => {
            // Check if user already has a pending or active loan for this book
            db.query("SELECT id FROM loans WHERE user_id = ? AND book_id = ? AND status IN ('borrowed', 'pending') LIMIT 1", [userId, bookId], (err, loanCheck) => {
                if (err) return reject(err);
                if (loanCheck.length > 0) {
                    return reject(new Error("Anda sudah meminjam atau meminta peminjaman untuk buku ini"));
                }

                // Check stock first
                db.query("SELECT stock FROM books WHERE id = ?", [bookId], (err, results) => {
                    if (err) return reject(err);
                    if (results.length === 0) return reject(new Error("Buku tidak ditemukan"));
                    if (results[0].stock <= 0) return reject(new Error("Buku sedang tidak tersedia (habis dipinjam)"));

                    // Insert into loans with status 'pending' ( stock is decremented ONLY when approved by admin )
                    const query = "INSERT INTO loans (user_id, book_id, status) VALUES (?, ?, 'pending')";
                    db.query(query, [userId, bookId], (err, insertRes) => {
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
                WHERE l.user_id = ? AND l.status IN ('borrowed', 'pending')
            `;
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static getUserLoanHistory(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT l.*, b.title, b.author, b.cover_img, c.category_name 
                FROM loans l 
                JOIN books b ON l.book_id = b.id 
                LEFT JOIN categories c ON b.category_id = c.id
                WHERE l.user_id = ? AND l.status IN ('returned', 'denied')
                ORDER BY l.return_date DESC
            `;
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

module.exports = Loan;
