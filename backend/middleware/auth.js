const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Token tidak ada, akses ditolak" });
    }

    const token = bearer.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data payload login ke objek request
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
    }
}

module.exports = auth;