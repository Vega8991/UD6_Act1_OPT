const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const Review = require('../models/Review');

test.before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/biblioteca_tests');
    }
});

test.afterEach(async () => {
    await Review.deleteMany({});
});

test.after(async () => {
    await mongoose.connection.close();
});

test('Modelo Review', async (t) => {

    await t.test('1. Deberia crear una reseña valida', async () => {
        const review = new Review({
            reviewerName: 'Juan Perez',
            comment: 'Me ha encantado este libro, muy recomendado.',
            rating: 5
        });
        await review.save();
        assert.ok(review._id);
        assert.strictEqual(review.rating, 5);
    });

    await t.test('2. Deberia aplicar valores por defecto', async () => {
        const review = new Review({
            reviewerName: 'Ana Garcia',
            rating: 4
        });
        await review.save();
        assert.strictEqual(review.isVerified, false);
        assert.ok(review.reviewDate instanceof Date);
    });

    await t.test('3. Deberia aceptar una referencia a un libro', async () => {
        const fakeBookId = new mongoose.Types.ObjectId();
        const review = new Review({
            reviewerName: 'Lector Critico',
            rating: 3,
            book: fakeBookId
        });
        await review.save();
        assert.strictEqual(review.book.toString(), fakeBookId.toString());
    });

    await t.test('4. Deberia permitir comentarios opcionales', async () => {
        const review = new Review({
            reviewerName: 'Mudo',
            rating: 4
        });
        await review.save();
        assert.strictEqual(review.comment, undefined);
    });

    await t.test('5. Deberia fallar sin puntuacion', async () => {
        const review = new Review({
            reviewerName: 'Anonimo'
        });
        try {
            await review.save();
            assert.fail('Deberia haber fallado por falta de rating');
        } catch (error) {
            assert.ok(error.errors.rating);
            assert.equal(error.errors.rating.message, 'La puntuacion es obligatoria');
        }
    });

    await t.test('6. Deberia fallar con puntuacion mayor a 5', async () => {
        const review = new Review({
            reviewerName: 'Exagerado',
            rating: 10
        });
        try {
            await review.save();
            assert.fail('Deberia haber fallado por rating fuera de rango');
        } catch (error) {
            assert.ok(error.errors.rating);
            assert.equal(error.errors.rating.message, 'La puntuacion maxima es 5');
        }
    });
});
