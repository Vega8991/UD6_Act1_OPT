require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { initialize } = require('@oas-tools/core');
const logger = require('./logger');

const app = express();

app.use(express.json());
app.use(logger.requestLogger);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca';
mongoose.connect(MONGODB_URI)
    .then(() => logger.info('mongodb_connected', { uri: MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@') }))
    .catch(err => logger.error('mongodb_connection_failed', { message: err.message }));

const authRoutes   = require('./routes/auth');
const authorsRoutes = require('./routes/authors');
const booksRoutes  = require('./routes/books');
const reviewsRoutes = require('./routes/reviews');
const healthRoutes  = require('./routes/health');

const oasConfig = {
    oasFile: './openapi-authors-entrega.yaml',
    middleware: { router: { disable: true } },
};

const PORT = process.env.PORT || 3000;
initialize(app, oasConfig)
    .then(() => {
        app.use('/api/health',  healthRoutes);
        app.use('/api/auth',    authRoutes);
        app.use('/api/authors', authorsRoutes);
        app.use('/api/books',   booksRoutes);
        app.use('/api/reviews', reviewsRoutes);
        app.listen(PORT, () => logger.info('server_started', { port: PORT }));
    })
    .catch(err => logger.error('oas_init_failed', { message: err.message }));
