const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Loan = require('../models/Loan');
const SavedBook = require('../models/SavedBook');

class UserController {
    async borrowBook(req, res) {
        try {
            await Loan.borrowBook(req.user.id, req.params.id);
            return res.json({ success: true, message: "Buku berhasil dipinjam" });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    async returnBook(req, res) {
        try {
            await Loan.returnBook(req.user.id, req.params.id);
            return res.json({ success: true, message: "Buku berhasil dikembalikan" });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    async saveBook(req, res) {
        try {
            await SavedBook.save(req.user.id, req.params.id);
            return res.json({ success: true, message: "Buku ditambahkan ke Wishlist" });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    async unsaveBook(req, res) {
        try {
            await SavedBook.unsave(req.user.id, req.params.id);
            return res.json({ success: true, message: "Buku dihapus dari Wishlist" });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    async getLibrary(req, res) {
        try {
            const borrowed = await Loan.getUserLoans(req.user.id);
            const saved = await SavedBook.getUserSavedBooks(req.user.id);
            const history = await Loan.getUserLoanHistory(req.user.id);
            
            return res.json({ 
                success: true, 
                data: {
                    borrowed,
                    saved,
                    history
                }
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }

    async updateProfile(req, res) {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Nama dan email wajib diisi" });
        }

        try {
            // Check if email already registered by other user
            const emailExists = await User.findByEmail(email);
            if (emailExists && emailExists.id !== req.user.id) {
                return res.status(400).json({ success: false, message: "Email sudah digunakan oleh pengguna lain" });
            }

            await User.updateProfile(req.user.id, name, email);
            
            // Fetch updated user to generate new token
            const updatedUser = await User.findById(req.user.id);
            const token = jwt.sign(
                { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, name: updatedUser.name },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({ 
                success: true, 
                message: "Profil berhasil diperbarui", 
                token, 
                user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } 
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }

    async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Password saat ini dan password baru wajib diisi" });
        }

        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(401).json({ success: false, message: "Password saat ini salah" });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await User.updatePassword(req.user.id, hashedNewPassword);

            return res.json({ success: true, message: "Password berhasil diperbarui" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }
}

module.exports = new UserController();
