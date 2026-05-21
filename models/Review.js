const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: [true, 'El nombre del revisor es obligatorio'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    comment: {
        type: String,
        maxlength: [500, 'El comentario no puede tener mas de 500 caracteres']
    },
    rating: {
        type: Number,
        required: [true, 'La puntuacion es obligatoria'],
        min: [1, 'La puntuacion minima es 1'],
        max: [5, 'La puntuacion maxima es 5']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
});

module.exports = mongoose.model('Review', reviewSchema);
