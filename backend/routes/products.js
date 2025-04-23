const router = require('express').Router();
let Product = require('../models/product');

// Összes termék lekérése
router.route('/').get(async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error('Hiba a termékek lekérésénél:', err);
        res.status(400).json('Hiba: ' + err.message);
    }
});

// Új termék hozzáadása
router.route('/').post(async (req, res) => {
    try {
        console.log('Új termék adatai:', req.body);
        
        const newProduct = new Product({
            hungarianName: req.body.hungarianName,
            czechName: req.body.czechName,
            articleNumber: req.body.articleNumber,
            packaging: req.body.packaging,
            label: req.body.label,
            capsuleCount: req.body.capsuleCount,
            liquidVolume: req.body.liquidVolume,
            image: req.body.image
        });

        console.log('Létrehozott termék objektum:', newProduct);

        const savedProduct = await newProduct.save();
        console.log('Mentett termék:', savedProduct);
        
        res.json({ message: 'Termék sikeresen hozzáadva!', product: savedProduct });
    } catch (err) {
        console.error('Hiba a termék mentésénél:', err);
        res.status(400).json('Hiba: ' + err.message);
    }
});

// Termék lekérése ID alapján
router.route('/:id').get(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json('Termék nem található');
        }
        res.json(product);
    } catch (err) {
        console.error('Hiba a termék lekérésénél:', err);
        res.status(400).json('Hiba: ' + err.message);
    }
});

// Termék törlése
router.route('/:id').delete(async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json('Termék nem található');
        }
        res.json('Termék törölve!');
    } catch (err) {
        console.error('Hiba a termék törlésénél:', err);
        res.status(400).json('Hiba: ' + err.message);
    }
});

// Termék frissítése
router.route('/:id').put(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json('Termék nem található');
        }

        product.hungarianName = req.body.hungarianName;
        product.czechName = req.body.czechName;
        product.articleNumber = req.body.articleNumber;
        product.packaging = req.body.packaging;
        product.label = req.body.label;
        product.capsuleCount = req.body.capsuleCount;
        product.liquidVolume = req.body.liquidVolume;
        product.image = req.body.image;

        const updatedProduct = await product.save();
        res.json({ message: 'Termék frissítve!', product: updatedProduct });
    } catch (err) {
        console.error('Hiba a termék frissítésénél:', err);
        res.status(400).json('Hiba: ' + err.message);
    }
});

module.exports = router; 