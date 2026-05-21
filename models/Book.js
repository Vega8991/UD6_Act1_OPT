const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título del libro es obligatorio'],
        maxlength: [200, 'El título no puede tener más de 200 caracteres']
    },
    pages: {
        type: Number,
        min: [1, 'El libro debe tener al menos 1 página'],
        max: [10000, 'El número de páginas no puede superar las 10000']
    },
    publicationDate: {
        type: Date,
        default: Date.now
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        min: [0, 'El precio no puede ser negativo']
    },
    category: {
        type: String,
        enum: {
            values: ['Novela', 'Ensayo', 'Biografía', 'Ciencia', 'Historia'],
            message: 'La categoría debe ser: Novela, Ensayo, Biografía, Ciencia o Historia'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, 'El autor es obligatorio']
    }
});

module.exports = mongoose.model('Book', bookSchema);
