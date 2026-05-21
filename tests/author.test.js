const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const Author = require('../models/Author');

test.before(async () => {
    await mongoose.connect('mongodb://localhost:27017/biblioteca_tests');
});

test.afterEach(async () => {
    await Author.deleteMany({});
});

test.after(async () => {
    await mongoose.connection.close();
});

test('Modelo Author', async (t) => {

    await t.test('1. Deberia crear un autor valido con todos los campos', async () => {
        const authorData = {
            name: 'Gabriel García Márquez',
            country: 'Colombia',
            age: 87,
            birthDate: new Date('1927-03-06'),
            genre: 'Ficción'
        };
        const author = new Author(authorData);
        await author.save();

        assert.strictEqual(author.name, authorData.name);
        assert.strictEqual(author.country, authorData.country);
        assert.ok(author._id);
    });

    await t.test('2. Deberia aplicar valores por defecto', async () => {
        const author = new Author({
            name: 'Autor Anónimo',
            age: 30,
            birthDate: new Date()
        });
        await author.save();

        assert.strictEqual(author.country, 'España');
        assert.strictEqual(author.isActive, true);
        assert.strictEqual(author.genre, 'Ficción');
    });

    await t.test('3. Deberia permitir todos los generos del enum', async () => {
        const genres = ['Ficción', 'No Ficción', 'Poesía', 'Drama'];

        for (const g of genres) {
            const author = new Author({
                name: 'Test Genre',
                age: 25,
                birthDate: new Date(),
                genre: g
            });
            await author.save();
            assert.strictEqual(author.genre, g);
            await Author.deleteOne({ _id: author._id });
        }
    });

    await t.test('4. Deberia fallar si no tiene nombre (Negativo - Error de validacion 1)', async () => {
        const author = new Author({
            age: 50,
            birthDate: new Date()
        });

        try {
            await author.save();
            assert.fail('Deberia haber lanzado un error de validacion');
        } catch (error) {
            assert.ok(error.errors.name, 'Deberia haber un error en el campo name');
            assert.strictEqual(error.errors.name.message, 'El nombre del autor es obligatorio');
        }
    });

    await t.test('5. Deberia fallar si el nombre es muy corto (Negativo - Error de validacion 2)', async () => {
        const author = new Author({
            name: 'Jo',
            age: 50,
            birthDate: new Date()
        });

        try {
            await author.save();
            assert.fail('Deberia haber lanzado un error de validacion');
        } catch (error) {
            assert.ok(error.errors.name);
            assert.ok(error.errors.name.message.includes('al menos 3 caracteres'));
        }
    });

    await t.test('6. Deberia fallar si es menor de 18 años (Negativo - Validacion extra)', async () => {
        const author = new Author({
            name: 'Niño Escritor',
            age: 10,
            birthDate: new Date()
        });

        try {
            await author.save();
            assert.fail('Deberia haber fallado por edad minima');
        } catch (error) {
            assert.ok(error.errors.age);
            assert.strictEqual(error.errors.age.message, 'El autor debe ser mayor de 18 años');
        }
    });
});
