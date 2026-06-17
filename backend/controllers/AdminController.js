const db = require('../config/database');

class AdminController {
    // 1. Get dashboard statistics and components data
    async getDashboardStats(req, res) {
        try {
            // A. Get Total Members
            const totalMembers = await new Promise((resolve, reject) => {
                db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'member'", (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].count);
                });
            });

            // B. Get Active Loans
            const activeLoans = await new Promise((resolve, reject) => {
                db.query("SELECT COUNT(*) AS count FROM loans WHERE status = 'borrowed'", (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].count);
                });
            });

            // C. Get New Acquisitions (added in the last 30 days)
            const newAcquisitions = await new Promise((resolve, reject) => {
                db.query("SELECT COUNT(*) AS count FROM books WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)", (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].count);
                });
            });

            // D. Get Resource Utilization (Book count distribution by category)
            const categoryStats = await new Promise((resolve, reject) => {
                const query = `
                    SELECT c.category_name, COUNT(b.id) AS book_count 
                    FROM categories c 
                    LEFT JOIN books b ON b.category_id = c.id 
                    GROUP BY c.id 
                    ORDER BY book_count DESC 
                    LIMIT 3
                `;
                db.query(query, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            // Get total book count to compute percentage
            const totalBooks = await new Promise((resolve, reject) => {
                db.query("SELECT COUNT(*) AS count FROM books", (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].count || 1);
                });
            });

            // Format resource utilization data
            const utilization = categoryStats.map(cat => ({
                name: cat.category_name,
                count: cat.book_count,
                percentage: Math.round((cat.book_count / totalBooks) * 100)
            }));

            // E. Get Live Activity Feed
            // Fetch recent users
            const recentUsers = await new Promise((resolve, reject) => {
                db.query("SELECT id, name, created_at FROM users WHERE role = 'member' ORDER BY created_at DESC, id DESC LIMIT 5", (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            // Fetch recent loans
            const recentLoans = await new Promise((resolve, reject) => {
                const query = `
                    SELECT l.id, u.name AS user_name, b.title AS book_title, l.borrow_date, l.return_date, l.status 
                    FROM loans l 
                    JOIN users u ON l.user_id = u.id 
                    JOIN books b ON l.book_id = b.id 
                    ORDER BY l.borrow_date DESC, l.id DESC 
                    LIMIT 10
                `;
                db.query(query, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            // Merge activities
            const activities = [];
            
            // Add user registration activities
            recentUsers.forEach(u => {
                activities.push({
                    type: 'user',
                    message: `${u.name} registered as a new member.`,
                    timestamp: u.created_at,
                    meta: `ID: MB-${1000 + u.id}`
                });
            });

            // Add loan activities
            recentLoans.forEach(l => {
                let msg = '';
                let meta = '';
                if (l.status === 'pending') {
                    msg = `Borrow request for "${l.book_title}" submitted by ${l.user_name}.`;
                    meta = 'Status: Awaiting Approval';
                } else if (l.status === 'borrowed') {
                    msg = `"${l.book_title}" was borrowed by ${l.user_name}.`;
                    meta = 'Status: Active Loan';
                } else if (l.status === 'returned') {
                    msg = `"${l.book_title}" was returned by ${l.user_name}.`;
                    meta = 'Status: Inspected & Returned';
                } else if (l.status === 'denied') {
                    msg = `Borrow request for "${l.book_title}" by ${l.user_name} was Denied.`;
                    meta = 'Status: Rejected';
                }

                activities.push({
                    type: l.status === 'returned' ? 'return' : l.status === 'pending' ? 'pending' : l.status === 'denied' ? 'denied' : 'borrow',
                    message: msg,
                    timestamp: l.status === 'returned' && l.return_date ? l.return_date : l.borrow_date,
                    meta: meta
                });
            });

            // Sort by timestamp descending and take top 6
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const liveFeed = activities.slice(0, 6);

            // F. Get Pending Approvals
            const pendingApprovals = await new Promise((resolve, reject) => {
                const query = `
                    SELECT l.id AS loan_id, u.name AS requester_name, b.title AS book_title, l.borrow_date AS date_submitted 
                    FROM loans l 
                    JOIN users u ON l.user_id = u.id 
                    JOIN books b ON l.book_id = b.id 
                    WHERE l.status = 'pending' 
                    ORDER BY l.borrow_date DESC
                `;
                db.query(query, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            return res.json({
                success: true,
                data: {
                    stats: {
                        totalMembers,
                        activeLoans,
                        newAcquisitions,
                        systemUptime: "99.98%"
                    },
                    utilization,
                    liveFeed,
                    pendingApprovals
                }
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            return res.status(500).json({ success: false, message: "Gagal mengambil statistik dashboard", error: err.message });
        }
    }

    // 2. Approve a pending loan request
    async approveLoan(req, res) {
        const loanId = req.params.id;
        try {
            // Get loan details to find book_id and stock check
            const loan = await new Promise((resolve, reject) => {
                db.query("SELECT * FROM loans WHERE id = ? AND status = 'pending'", [loanId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                });
            });

            if (!loan) {
                return res.status(404).json({ success: false, message: "Permintaan peminjaman tidak ditemukan atau sudah diproses." });
            }

            const bookId = loan.book_id;

            // Check book stock
            const book = await new Promise((resolve, reject) => {
                db.query("SELECT stock FROM books WHERE id = ?", [bookId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                });
            });

            if (!book) {
                return res.status(404).json({ success: false, message: "Buku tidak ditemukan." });
            }

            if (book.stock <= 0) {
                return res.status(400).json({ success: false, message: "Stok buku habis. Tidak dapat menyetujui peminjaman." });
            }

            // Decrement book stock and update loan status
            await new Promise((resolve, reject) => {
                db.query("UPDATE books SET stock = stock - 1 WHERE id = ?", [bookId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            await new Promise((resolve, reject) => {
                db.query("UPDATE loans SET status = 'borrowed', borrow_date = CURRENT_TIMESTAMP WHERE id = ?", [loanId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            return res.json({ success: true, message: "Permintaan peminjaman berhasil disetujui." });
        } catch (err) {
            console.error('Error approving loan:', err);
            return res.status(500).json({ success: false, message: "Gagal menyetujui peminjaman", error: err.message });
        }
    }

    // 3. Deny a pending loan request
    async denyLoan(req, res) {
        const loanId = req.params.id;
        try {
            const result = await new Promise((resolve, reject) => {
                db.query("UPDATE loans SET status = 'denied' WHERE id = ? AND status = 'pending'", [loanId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Permintaan peminjaman tidak ditemukan atau sudah diproses." });
            }

            return res.json({ success: true, message: "Permintaan peminjaman berhasil ditolak." });
        } catch (err) {
            console.error('Error denying loan:', err);
            return res.status(500).json({ success: false, message: "Gagal menolak peminjaman", error: err.message });
        }
    }

    // 4. Get all users with enriched data for user management page
    async getUsers(req, res) {
        try {
            const users = await new Promise((resolve, reject) => {
                const query = `
                    SELECT 
                        u.id, u.name, u.email, u.role, u.created_at,
                        COUNT(CASE WHEN l.status = 'borrowed' THEN 1 END) AS active_loans,
                        COUNT(CASE WHEN l.status = 'pending' THEN 1 END) AS pending_loans,
                        COUNT(l.id) AS total_loans
                    FROM users u
                    LEFT JOIN loans l ON l.user_id = u.id
                    GROUP BY u.id
                    ORDER BY u.created_at DESC
                `;
                db.query(query, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            // Get user management stats
            const totalUsers = users.length;
            const activeMembers = users.filter(u => u.role === 'member' && (u.active_loans > 0 || u.pending_loans > 0)).length;
            const pendingApprovalCount = await new Promise((resolve, reject) => {
                db.query("SELECT COUNT(*) AS count FROM loans WHERE status = 'pending'", (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].count);
                });
            });
            const adminCount = users.filter(u => u.role === 'admin').length;

            return res.json({ 
                success: true, 
                data: users,
                userStats: {
                    totalUsers,
                    activeMembers,
                    pendingApprovals: pendingApprovalCount,
                    adminCount
                }
            });
        } catch (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: "Gagal mengambil daftar pengguna", error: err.message });
        }
    }

    // 5. Get a single user's details + loan history
    async getUser(req, res) {
        const userId = req.params.id;
        try {
            // Basic user info
            const user = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
                    [userId], (err, results) => {
                        if (err) reject(err);
                        else resolve(results[0]);
                    }
                );
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
            }

            // Loan history
            const loans = await new Promise((resolve, reject) => {
                const query = `
                    SELECT l.id, b.title AS book_title, b.author, b.cover_img,
                           l.borrow_date, l.return_date, l.status
                    FROM loans l
                    JOIN books b ON l.book_id = b.id
                    WHERE l.user_id = ?
                    ORDER BY l.borrow_date DESC
                    LIMIT 20
                `;
                db.query(query, [userId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            return res.json({ success: true, data: { user, loans } });
        } catch (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ success: false, message: 'Gagal mengambil detail pengguna', error: err.message });
        }
    }

    // 6. Update a user's info
    async updateUser(req, res) {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ success: false, message: 'Nama, email, dan role wajib diisi.' });
        }

        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Role tidak valid.' });
        }

        try {
            // Check email is not taken by another user
            const existing = await new Promise((resolve, reject) => {
                db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                });
            });

            if (existing) {
                return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh pengguna lain.' });
            }

            const result = await new Promise((resolve, reject) => {
                db.query(
                    'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
                    [name.trim(), email.trim(), role, userId],
                    (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    }
                );
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
            }

            return res.json({ success: true, message: 'Data pengguna berhasil diperbarui.' });
        } catch (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna', error: err.message });
        }
    }

    // 7. Create a new user (admin portal)
    async createUser(req, res) {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
        }
        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Role tidak valid.' });
        }
        try {
            const bcrypt = require('bcryptjs');
            const existing = await new Promise((resolve, reject) => {
                db.query('SELECT id FROM users WHERE email = ?', [email], (err, r) => {
                    if (err) reject(err); else resolve(r[0]);
                });
            });
            if (existing) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });

            const hash = await bcrypt.hash(password, 10);
            await new Promise((resolve, reject) => {
                db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name.trim(), email.trim(), hash, role],
                    (err, r) => { if (err) reject(err); else resolve(r); });
            });
            return res.status(201).json({ success: true, message: 'Pengguna baru berhasil dibuat.' });
        } catch (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ success: false, message: 'Gagal membuat pengguna', error: err.message });
        }
    }

    // 8. Delete a user
    async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const result = await new Promise((resolve, reject) => {
                db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
            }

            return res.json({ success: true, message: "Pengguna berhasil dihapus." });
        } catch (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ success: false, message: "Gagal menghapus pengguna", error: err.message });
        }
    }
}

module.exports = new AdminController();
