/**
 * Middleware Otorisasi Hak Akses Berdasarkan Role Pengguna
 * Sesuai dengan materi Modul Pertemuan 6 & 7.
 * * Middleware ini bertugas memeriksa apakah 'role' pengguna yang dikirimkan
 * melalui token JWT cocok dengan tingkat hak akses yang diperlukan oleh route tertentu.
 */

function authorize(requiredRole) {
    return (req, res, next) => {
        try {
            // 1. Validasi awal: Memastikan data user hasil dekripsi token JWT di auth.js sudah ada
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Akses ditolak: Informasi pengguna tidak ditemukan, silakan login kembali."
                });
            }

            // 2. Pemeriksaan Hak Akses (Role-Based Access Control)
            // Mengecek apakah role di dalam token (req.user.role) sama dengan role yang diwajibkan (requiredRole)
            if (req.user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Akses ditolak: Fitur ini hanya dapat diakses oleh pengguna dengan peran [${requiredRole}]!`
                });
            }

            // 3. Jika lolos validasi role, instruksikan Express untuk melanjutkan request ke Controller
            next();

        } catch (error) {
            // Error handling global jika terjadi kesalahan sistem internal (Pertemuan 5)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error pada sistem otorisasi",
                error: error.message
            });
        }
    };
}

module.exports = authorize;