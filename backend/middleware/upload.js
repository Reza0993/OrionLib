const multer = require('multer');
const path = require('path');

// Konfigurasi media penyimpanan lokal (Disk Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Menyimpan berkas ke dalam direktori lokal bernama 'uploads/'
    },
    filename: (req, file, cb) => {
        // Melakukan penamaan ulang agar unik menggunakan timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Aturan filter ekstensi dan ukuran berkas (Pertemuan 8 Security Validation)
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format berkas harus berupa JPG, JPEG, atau PNG'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;