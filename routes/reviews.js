const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.post('/', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('book');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('book');
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('book');
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.json({ message: 'Reseña eliminada correctamente', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
