const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors()); // Mengizinkan semua akses domain luar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PERTEMUAN 8 TAMBAHAN: Menyajikan folder uploads sebagai aset statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Pendaftaran Router Utama
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Global Error Handling untuk file upload limit yang terlampaui
app.use((err, req, res, next) => {
    if (err instanceof require('multer').MulterError) {
        return res.status(400).json({ success: false, message: "Kesalahan upload berkas", error: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server OrionLib berjalan lancar di port ${PORT}`);
});