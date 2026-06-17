const express = require('express');
const router = express.Router();

// Import Controllers
const BookController = require('../controllers/BookController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');

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
router.get('/categories', BookController.getCategories);

// Hanya Admin yang boleh memanipulasi data buku dan mengunggah gambar cover (upload.single)
router.post('/books', auth, authorize('admin'), upload.single('cover_img'), bookValidationRules, BookController.store);
router.put('/books/:id', auth, authorize('admin'), upload.single('cover_img'), bookValidationRules, BookController.update);
router.delete('/books/:id', auth, authorize('admin'), BookController.destroy);
router.post('/books/bulk', auth, authorize('admin'), BookController.bulkStore);

// ==========================================
// RUTE USER (BORROW & SAVE)
// ==========================================
router.post('/books/:id/borrow', auth, UserController.borrowBook);
router.post('/books/:id/return', auth, UserController.returnBook);
router.post('/books/:id/save', auth, UserController.saveBook);
router.delete('/books/:id/save', auth, UserController.unsaveBook);
router.get('/user/library', auth, UserController.getLibrary);
router.put('/user/profile', auth, UserController.updateProfile);
router.put('/user/password', auth, UserController.changePassword);

// ==========================================
// RUTE ADMIN (DASHBOARD & USER MANAGEMENT)
// ==========================================
router.get('/admin/stats', auth, authorize('admin'), AdminController.getDashboardStats);
router.post('/admin/loans/:id/approve', auth, authorize('admin'), AdminController.approveLoan);
router.post('/admin/loans/:id/deny', auth, authorize('admin'), AdminController.denyLoan);
router.get('/admin/users', auth, authorize('admin'), AdminController.getUsers);
router.post('/admin/users', auth, authorize('admin'), AdminController.createUser);
router.get('/admin/users/:id', auth, authorize('admin'), AdminController.getUser);
router.put('/admin/users/:id', auth, authorize('admin'), AdminController.updateUser);
router.delete('/admin/users/:id', auth, authorize('admin'), AdminController.deleteUser);

module.exports = router;