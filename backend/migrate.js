const db = require('./config/database');

const migrate = async () => {
    console.log("Starting database migration...");

    try {
        // Create Loans table
        await new Promise((resolve, reject) => {
            db.query(`
                CREATE TABLE IF NOT EXISTS loans (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    book_id INT NOT NULL,
                    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    return_date TIMESTAMP NULL,
                    status ENUM('borrowed', 'returned', 'pending', 'denied') DEFAULT 'pending',
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log("Table 'loans' created or already exists.");
                    // Alter status column to ensure existing tables have the new enum values
                    db.query(`
                        ALTER TABLE loans 
                        MODIFY COLUMN status ENUM('borrowed', 'returned', 'pending', 'denied') DEFAULT 'pending'
                    `, (alterErr) => {
                        if (alterErr) {
                            console.warn("Warning: Could not alter status column (it might already be correct):", alterErr.message);
                        } else {
                            console.log("Column 'status' altered successfully to support pending/denied.");
                        }
                        resolve();
                    });
                }
            });
        });

        // Create Saved Books table
        await new Promise((resolve, reject) => {
            db.query(`
                CREATE TABLE IF NOT EXISTS saved_books (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    book_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_user_book (user_id, book_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log("Table 'saved_books' created or already exists.");
                    resolve();
                }
            });
        });

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
