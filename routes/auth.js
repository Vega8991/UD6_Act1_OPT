const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signAccess(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function signRefresh(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
    try {
        const { username, password, roles } = req.body;
        const user = new User({ username, password, roles });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado correctamente', username: user.username, roles: user.roles });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const payload = { id: user._id, username: user.username, roles: user.roles };
        res.json({
            accessToken: signAccess(payload),
            refreshToken: signRefresh(payload)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token no proporcionado' });
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const payload = { id: decoded.id, username: decoded.username, roles: decoded.roles };
        res.json({ accessToken: signAccess(payload) });
    } catch {
        res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }
});

module.exports = router;
