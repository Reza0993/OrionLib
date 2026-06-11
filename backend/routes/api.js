const express = require('express');
const router = express.Router();

// Import Controllers
const BookController = require('../controllers/BookController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

// Import Middlewares
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

const { body } = require('express-validator');

// Aturan validasi data buku (Pertemuan 8 / 9)
const bookValidationRules = [
    body('title').trim().notEmpty().withMessage('Judul buku wajib diisi'),
    body('author').trim().notEmpty().withMessage('Nama penulis wajib diisi'),
    body('publish_year')
        .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
        .withMessage('Tahun terbit harus berupa angka tahun yang valid'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stok harus berupa angka positif atau nol')
];

// ==========================================
// RUTE PERTEMUAN 7: AUTENTIKASI (PUBLIC)
// ==========================================
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// ==========================================
// RUTE PERTEMUAN 8: PROTECTED ROUTE & UPLOAD
// ==========================================
// Anggota biasa (member) & Admin bisa melihat daftar buku
router.get('/books', BookController.index);
router.get('/books/:id', BookController.show);

// Hanya Admin yang boleh memanipulasi data buku dan mengunggah gambar cover (upload.single)
router.post('/books', auth, authorize('admin'), upload.single('cover_img'), bookValidationRules, BookController.store);
router.put('/books/:id', auth, authorize('admin'), upload.single('cover_img'), bookValidationRules, BookController.update);
router.delete('/books/:id', auth, authorize('admin'), BookController.destroy);

// ==========================================
// RUTE USER (BORROW & SAVE)
// ==========================================
router.post('/books/:id/borrow', auth, UserController.borrowBook);
router.post('/books/:id/return', auth, UserController.returnBook);
router.post('/books/:id/save', auth, UserController.saveBook);
router.delete('/books/:id/save', auth, UserController.unsaveBook);
router.get('/user/library', auth, UserController.getLibrary);

module.exports = router;