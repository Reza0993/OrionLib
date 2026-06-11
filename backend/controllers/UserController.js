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
            
            return res.json({ 
                success: true, 
                data: {
                    borrowed,
                    saved
                }
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }
}

module.exports = new UserController();
