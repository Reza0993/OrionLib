const db = require('./config/database');

const seed = async () => {
    console.log("🌱 Starting database seed...");

    try {
        // 1. Add more categories
        await query(`
            INSERT INTO categories (id, category_name) VALUES 
            (1, 'Novel'),
            (2, 'Technology'),
            (3, 'Science'),
            (4, 'History'),
            (5, 'Biography'),
            (6, 'Physics'),
            (7, 'Business'),
            (8, 'Literature'),
            (9, 'Engineering'),
            (10, 'Medicine'),
            (11, 'Law'),
            (12, 'Mathematics'),
            (13, 'Sociology'),
            (14, 'Ethics'),
            (15, 'Psychology'),
            (16, 'Management'),
            (17, 'Religion')
            ON DUPLICATE KEY UPDATE category_name=VALUES(category_name)
        `);
        console.log("✅ Categories seeded.");

        // 2. Delete existing books (to avoid conflicts) then re-insert
        await query(`DELETE FROM loans`);
        await query(`DELETE FROM saved_books`);
        await query(`DELETE FROM books`);
        console.log("🗑️  Cleared old book data.");

        // 3. Insert books with covers matching frontend data exactly
        await query(`
            INSERT INTO books (id, category_id, title, author, publisher, publish_year, isbn, stock, cover_img) VALUES
            -- Original 3 books
            (1, 1, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '979-3062-79-7', 5, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80&auto=format&fit=crop'),
            (2, 2, 'Pemrograman Javascript Modern', 'Andrea Hirata', 'Informatika', 2023, '978-602-6232-94-6', 3, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80&auto=format&fit=crop'),
            (3, 3, 'Kosmos', 'Carl Sagan', 'Kepustakaan Populer Gramedia', 2016, '978-602-424-219-0', 5, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&auto=format&fit=crop'),
            
            -- Recommended Books (from Dashboard)
            (4, 2, 'Advanced Quantum Mechanics', 'Dr. Julian Thorne', 'Cambridge University Press', 2022, '978-0-521-76726-2', 4, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80&auto=format&fit=crop'),
            (5, 7, 'Principles of Economics', 'Sarah J. Miller', 'Pearson Education', 2021, '978-0-13-446209-8', 0, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80&auto=format&fit=crop'),
            (6, 8, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, '978-0-7432-7356-5', 10, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80&auto=format&fit=crop'),
            (7, 3, 'Digital Signal Processing', 'Preston & Mandalas', 'MIT Press', 2020, '978-0-262-04630-3', 3, 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&q=80&auto=format&fit=crop'),
            
            -- New Arrivals (from Dashboard)
            (8, 2, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell & Peter Norvig', 'Pearson', 2021, '978-0-13-461099-3', 5, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80&auto=format&fit=crop'),
            (9, 16, 'Strategic Management', 'John Doe', 'Harvard Business Review', 2020, '978-1-633-69389-0', 2, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80&auto=format&fit=crop'),
            (10, 4, 'The Roman Empire', 'Mary Beard', 'W. W. Norton', 2015, '978-0-393-35396-9', 3, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80&auto=format&fit=crop'),
            (11, 17, 'Philosophy of Logic', 'S. Wittgenstein', 'Routledge', 1921, '978-0-415-11982-5', 4, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80&auto=format&fit=crop'),

            -- Popular Books (from Dashboard)
            (12, 2, 'Quantum Computing', 'Dr. Neil T.', 'O Reilly Media', 2023, '978-1-492-03899-8', 5, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop'),
            (13, 7, 'Macroeconomics', 'Prof. Richards', 'McGraw-Hill', 2022, '978-1-264-11257-7', 0, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&auto=format&fit=crop'),
            (14, 3, 'Organic Chemistry', 'L. Pasteur', 'Wiley', 2021, '978-1-119-65988-5', 8, 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=400&q=80&auto=format&fit=crop'),
            (15, 4, 'World War II', 'Antony Beevor', 'Penguin Books', 2012, '978-0-14-312332-2', 4, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80&auto=format&fit=crop'),
            (16, 8, 'Modern Poetry', 'T.S. Eliot', 'Faber & Faber', 1930, '978-0-571-31638-0', 0, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80&auto=format&fit=crop'),
            (17, 2, 'Computer Vision', 'G. Hinton', 'MIT Press', 2018, '978-0-262-03759-4', 6, 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80&auto=format&fit=crop'),
            (18, 2, 'Data Structures', 'M. Weiss', 'Pearson', 2019, '978-0-13-516030-5', 5, 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80&auto=format&fit=crop'),
            (19, 4, 'The Art of War', 'Sun Tzu', 'Shambhala', 2005, '978-1-590-30225-5', 12, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80&auto=format&fit=crop')
        `);
        console.log("✅ 20 books seeded successfully with cover images!");

        console.log("\n🎉 Database seed completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
};

function query(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

seed();
