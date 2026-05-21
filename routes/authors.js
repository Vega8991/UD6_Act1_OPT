const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!author) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', ...requireRole('JUNIOR_DEV', 'SENIOR_DEV', 'ADMIN'), async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json({ message: 'Autor eliminado correctamente', author });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
