const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    hungarianName: { type: String, required: true },
    czechName: { type: String, required: true },
    articleNumber: { type: String, required: true, unique: true },
    packaging: { type: String, required: true },
    label: { type: String },
    capsuleCount: { type: Number },
    liquidVolume: { type: Number },
    image: { type: String }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 