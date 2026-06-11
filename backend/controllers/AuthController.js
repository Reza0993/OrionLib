const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../utils/authValidator');

class AuthController {
    async register(req, res) {
        const error = validateRegister(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        try {
            const userExists = await User.findByEmail(req.body.email);
            if (userExists) {
                return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = {
                name: req.body.name || 'Member OrionLib',
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role || 'member'
            };

            await User.create(newUser);
            return res.status(201).json({ success: true, message: "Register berhasil" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }

    async login(req, res) {
        const error = validateLogin(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        try {
            const user = await User.findByEmail(req.body.email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }

            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return res.status(401).json({ success: false, message: "Password salah" });
            }

            // Generate Token membawa Payload (id, email, dan role)
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({
                success: true,
                message: "Login berhasil",
                token: token
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server Error", error: err.message });
        }
    }
}

module.exports = new AuthController();