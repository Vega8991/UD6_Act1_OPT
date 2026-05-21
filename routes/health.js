const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbOk = dbState === 1;

    const payload = {
        status: dbOk ? 'ok' : 'degraded',
        uptime_s: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        services: {
            api: 'ok',
            database: dbOk ? 'connected' : 'disconnected',
        },
    };

    res.status(dbOk ? 200 : 503).json(payload);
});

module.exports = router;
