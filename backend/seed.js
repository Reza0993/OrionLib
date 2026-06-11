const db = require('./config/database');

const seed = async () => {
    console.log("🌱 Starting database seed...");

    try {
        // 1. Add more categories
        await query(`
            INSERT INTO categories (id, category_name) VALUES 
            (1, 'Novel'),
            (2, 'Teknologi'),
            (3, 'Sains'),
            (4, 'Sejarah'),
            (5, 'Biografi'),
            (6, 'Fisika'),
            (7, 'Ekonomi'),
            (8, 'Sastra'),
            (9, 'Teknik'),
            (10, 'Kedokteran'),
            (11, 'Hukum'),
            (12, 'Matematika'),
            (13, 'Sosiologi'),
            (14, 'Etika'),
            (15, 'Psikologi')
            ON DUPLICATE KEY UPDATE category_name=VALUES(category_name)
        `);
        console.log("✅ Categories seeded.");

        // 2. Delete existing books (to avoid conflicts) then re-insert
        await query(`DELETE FROM loans`);
        await query(`DELETE FROM saved_books`);
        await query(`DELETE FROM books`);
        console.log("🗑️  Cleared old book data.");

        // 3. Insert books with covers matching frontend data
        await query(`
            INSERT INTO books (id, category_id, title, author, publisher, publish_year, isbn, stock, cover_img) VALUES
            -- Original 3 books (updated with covers)
            (1, 1, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '979-3062-79-7', 5, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80&auto=format&fit=crop'),
            (2, 2, 'Pemrograman Javascript Modern', 'Andrea Hirata', 'Informatika', 2023, '978-602-6232-94-6', 3, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80&auto=format&fit=crop'),
            (3, 3, 'Kosmos', 'Carl Sagan', 'Kepustakaan Populer Gramedia', 2016, '978-602-424-219-0', 5, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&auto=format&fit=crop'),
            
            -- Recommended Books (from Dashboard)
            (4, 6, 'Advanced Quantum Mechanics', 'John Doe', 'Cambridge University Press', 2022, '978-0-521-76726-2', 4, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80&auto=format&fit=crop'),
            (5, 7, 'Principles of Economics', 'Jane Smith', 'Pearson Education', 2021, '978-0-13-446209-8', 7, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80&auto=format&fit=crop'),
            (6, 8, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, '978-0-7432-7356-5', 10, 'https://images.unsplash.com/photo-1532094349884-543559a55ebe?w=400&q=80&auto=format&fit=crop'),
            (7, 9, 'Digital Signal Processing', 'Michael Blum', 'MIT Press', 2020, '978-0-262-04630-3', 3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop'),
            
            -- Popular Books (from Dashboard)
            (8, 6, 'Quantum Computing', 'Dana Labs', 'O Reilly Media', 2023, '978-1-492-03899-8', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop'),
            (9, 7, 'Macroeconomics', 'Brett Benson', 'McGraw-Hill', 2022, '978-1-264-11257-7', 6, 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80&auto=format&fit=crop'),
            (10, 3, 'Organic Chemistry', 'Dr. Monica K.', 'Wiley', 2021, '978-1-119-65988-5', 8, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80&auto=format&fit=crop'),
            (11, 4, 'World War II: A Complete History', 'Sabrina Vine', 'Penguin Books', 2019, '978-0-14-313573-2', 4, 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&q=80&auto=format&fit=crop'),
            
            -- Similar Books (from Book Details)
            (12, 15, 'Cognitive Science: Neural Foundations', 'L. Fitzgerald', 'Academic Press', 2023, '978-0-12-820480-1', 3, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80&auto=format&fit=crop'),
            (13, 14, 'Algorithmic Ethics', 'Sarah Chen', 'Stanford University Press', 2022, '978-1-503-63144-9', 5, 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&q=80&auto=format&fit=crop'),
            (14, 13, 'Digital Societies', 'Professor Omar K.', 'Routledge', 2021, '978-0-367-56218-2', 6, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80&auto=format&fit=crop'),
            (15, 12, 'Emergent Systems in Mathematics', 'Dr. Julia Ortiz', 'Springer', 2022, '978-3-030-89394-0', 2, 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=400&q=80&auto=format&fit=crop'),
            
            -- Extra Books for a rich catalog
            (16, 10, 'The Human Anatomy', 'Dr. Morrington', 'Elsevier', 2020, '978-0-323-39325-1', 4, 'https://images.unsplash.com/photo-1530497610245-b1acb23b4e94?w=400&q=80&auto=format&fit=crop'),
            (17, 11, 'Principles of Modern Law', 'Banick J. Wellington', 'Oxford University Press', 2021, '978-0-19-884807-3', 6, 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&q=80&auto=format&fit=crop'),
            (18, 15, 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Penguin Books', 2011, '978-0-14-103357-0', 8, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80&auto=format&fit=crop'),
            (19, 5, 'Steve Jobs: The Biography', 'Walter Isaacson', 'Simon & Schuster', 2011, '978-1-4516-4853-9', 5, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80&auto=format&fit=crop'),
            (20, 4, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Vintage Books', 2015, '978-0-09-959008-8', 10, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80&auto=format&fit=crop')
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
