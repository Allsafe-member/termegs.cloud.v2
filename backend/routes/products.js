const router = require('express').Router();
let Product = require('../models/product');

// Összes termék lekérése
router.route('/').get((req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Hiba: ' + err));
});

// Új termék hozzáadása
router.route('/').post((req, res) => {
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

    newProduct.save()
        .then(() => res.json('Termék sikeresen hozzáadva!'))
        .catch(err => res.status(400).json('Hiba: ' + err));
});

// Termék lekérése ID alapján
router.route('/:id').get((req, res) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Hiba: ' + err));
});

// Termék törlése
router.route('/:id').delete((req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.json('Termék törölve!'))
        .catch(err => res.status(400).json('Hiba: ' + err));
});

// Termék frissítése
router.route('/:id').put((req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            product.hungarianName = req.body.hungarianName;
            product.czechName = req.body.czechName;
            product.articleNumber = req.body.articleNumber;
            product.packaging = req.body.packaging;
            product.label = req.body.label;
            product.capsuleCount = req.body.capsuleCount;
            product.liquidVolume = req.body.liquidVolume;
            product.image = req.body.image;

            product.save()
                .then(() => res.json('Termék frissítve!'))
                .catch(err => res.status(400).json('Hiba: ' + err));
        })
        .catch(err => res.status(400).json('Hiba: ' + err));
});

module.exports = router; 