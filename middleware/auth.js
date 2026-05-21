const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = auth.slice(7);
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

function requireRole(...roles) {
    return [verifyToken, (req, res, next) => {
        const userRoles = req.user.roles || [];
        if (roles.some(r => userRoles.includes(r))) return next();
        res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }];
}

module.exports = { verifyToken, requireRole };
