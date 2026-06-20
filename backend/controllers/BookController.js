const Book = require('../models/Book');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

class BookController {
    
    // 1. GET ALL BOOKS (Menampilkan Semua Buku)
    async index(req, res) {
        try {
            const books = await Book.all();
            return res.status(200).json({
                success: true,
                message: "Berhasil menampilkan semua buku dari OrionLib",
                data: books
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error saat mengambil data",
                error: error.message
            });
        }
    }

    // 2. GET BOOK BY ID (Menampilkan Detail Satu Buku)
    async show(req, res) {
        const { id } = req.params;
        try {
            const book = await Book.find(id);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: `Buku dengan ID ${id} tidak ditemukan`
                });
            }
            return res.status(200).json({
                success: true,
                message: "Detail data buku ditemukan",
                data: book
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error saat mengambil detail buku",
                error: error.message
            });
        }
    }

    // 3. CREATE BOOK WITH COVER IMAGE (Menambahkan Buku Baru + Upload Cover)
    async store(req, res) {
        // Validasi input teks menggunakan express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // JIKA VALIDASI GAGAL: Dan user telanjur upload file, hapus kembali file tersebut dari lokal server
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(422).json({
                success: false,
                message: "Validasi data gagal",
                errors: errors.array()
            });
        }

        const { category_id, title, author, publisher, publish_year, isbn, stock } = req.body;
        
        // Validasi category_id exists di database jika diberikan
        if (category_id) {
            const db = require('../config/database');
            const [catCheck] = await db.promise().query("SELECT id FROM categories WHERE id = ?", [category_id]);
            if (catCheck.length === 0) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(422).json({
                    success: false,
                    message: "Kategori tidak ditemukan"
                });
            }
        }

        // Mempersiapkan objek data yang akan dikirim ke MySQL
        const dataBook = {
            category_id: category_id || null,
            title,
            author,
            publisher: publisher || null,
            publish_year,
            isbn: isbn || null,
            stock: stock || 0,
            cover_img: req.file ? req.file.filename : null
        };

        try {
            const result = await Book.create(dataBook);
            return res.status(201).json({
                success: true,
                message: "Buku baru berhasil didaftarkan ke OrionLib",
                data: {
                    id: result.insertId,
                    ...dataBook
                }
            });
        } catch (error) {
            // Hapus file jika database menolak query INSERT (misal: ISBN duplikat)
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({
                success: false,
                message: "Gagal menyimpan buku baru ke database",
                error: error.message
            });
        }
    }

    // 4. UPDATE BOOK WITH COVER IMAGE (Memperbarui Data Buku + Update Cover)
    async update(req, res) {
        const { id } = req.params;

        // Validasi input teks
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(422).json({
                success: false,
                message: "Validasi pembaruan data gagal",
                errors: errors.array()
            });
        }

        try {
            // Pastikan buku yang akan diubah datanya memang eksis di database
            const currentBook = await Book.find(id);
            if (!currentBook) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({
                    success: false,
                    message: "Data buku tidak ditemukan"
                });
            }

            const { category_id, title, author, publisher, publish_year, isbn, stock } = req.body;
            
            const dataUpdate = {
                category_id: category_id || null,
                title,
                author,
                publisher: publisher || null,
                publish_year,
                isbn: isbn || null,
                stock: stock || 0
            };

            // JIKA USER MENGUNGGAH COVER BARU:
            if (req.file) {
                dataUpdate.cover_img = req.file.filename;

                // Hapus cover lama dari folder 'uploads' agar tidak menjadi sampah server (jika ada cover lama)
                if (currentBook.cover_img) {
                    const oldImagePath = path.join(__dirname, '../uploads/', currentBook.cover_img);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            await Book.update(id, dataUpdate);
            return res.status(200).json({
                success: true,
                message: "Data buku berhasil diperbarui",
                data: {
                    id,
                    ...dataUpdate,
                    cover_img: req.file ? req.file.filename : currentBook.cover_img
                }
            });

        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(500).json({
                success: false,
                message: "Gagal memperbarui data buku",
                error: error.message
            });
        }
    }

    // 5. DELETE BOOK & REMOVE ASSET (Menghapus Buku beserta Berkas Gambarnya)
    async destroy(req, res) {
        const { id } = req.params;
        try {
            const book = await Book.find(id);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Data buku tidak ditemukan"
                });
            }

            // Hapus file fisik gambar cover dari server local sebelum menghapus baris data di MySQL
            if (book.cover_img) {
                const imagePath = path.join(__dirname, '../uploads/', book.cover_img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Eksekusi hapus baris data di MySQL
            await Book.delete(id);
            return res.status(200).json({
                success: true,
                message: `Buku dengan ID ${id} dan berkas covernya berhasil dihapus permanen`
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengeksekusi penghapusan data buku",
                error: error.message
            });
        }
    }
    // 6. GET ALL CATEGORIES (Menampilkan Semua Kategori)
    async getCategories(req, res) {
        try {
            const db = require('../config/database');
            db.query("SELECT * FROM categories ORDER BY category_name ASC", (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Gagal mengambil kategori", error: err.message });
                }
                return res.status(200).json({ success: true, data: results });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error saat mengambil kategori", error: error.message });
        }
    }

    // 7. BULK STORE BOOKS (Menambahkan Banyak Buku Sekaligus)
    async bulkStore(req, res) {
        const { books } = req.body;
        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ success: false, message: "Data buku tidak valid. Harus berupa array." });
        }
        try {
            const db = require('../config/database');
            const promises = books.map(book => {
                return new Promise((resolve, reject) => {
                    if (!book.title || !book.author) {
                        return reject(new Error("Judul dan penulis wajib diisi untuk setiap buku"));
                    }
                    const dataBook = {
                        category_id: book.category_id || null,
                        title: book.title,
                        author: book.author,
                        publisher: book.publisher || null,
                        publish_year: parseInt(book.publish_year) || new Date().getFullYear(),
                        isbn: book.isbn || null,
                        stock: parseInt(book.stock) || 0,
                        cover_img: book.cover_img || null
                    };
                    db.query("INSERT INTO books SET ?", dataBook, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            });
            await Promise.all(promises);
            return res.status(201).json({ success: true, message: `${books.length} buku berhasil diunggah secara bulk.` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Gagal mengunggah buku secara bulk", error: error.message });
        }
    }
}

// Mengekspor instance objek yang sudah siap pakai langsung di routing
module.exports = new BookController();