const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const books = await Book.find().populate('author');
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        if (!book) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('author');
        if (!book) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', ...requireRole('JUNIOR_DEV', 'SENIOR_DEV', 'ADMIN'), async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ message: 'Libro eliminado correctamente', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
