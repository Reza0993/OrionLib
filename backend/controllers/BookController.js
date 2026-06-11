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
        
        // Mempersiapkan objek data yang akan dikirim ke MySQL
        const dataBook = {
            category_id: category_id || null,
            title,
            author,
            publisher: publisher || null,
            publish_year,
            isbn: isbn || null,
            stock: stock || 0,
            cover_img: req.file ? req.file.filename : null // Menyimpan nama berkas baru hasil rename multer
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
}

// Mengekspor instance objek yang sudah siap pakai langsung di routing
module.exports = new BookController();