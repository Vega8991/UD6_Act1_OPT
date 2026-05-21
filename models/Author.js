const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del autor es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    country: {
        type: String,
        default: 'España'
    },
    age: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [18, 'El autor debe ser mayor de 18 años'],
        max: [120, 'La edad no puede superar los 120 años']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    genre: {
        type: String,
        enum: {
            values: ['Ficción', 'No Ficción', 'Poesía', 'Drama'],
            message: 'El género debe ser: Ficción, No Ficción, Poesía o Drama'
        },
        default: 'Ficción'
    }
});

module.exports = mongoose.model('Author', authorSchema);
