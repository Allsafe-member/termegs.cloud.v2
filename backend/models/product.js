const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    hungarianName: { type: String, required: true },
    czechName: { type: String, required: true },
    articleNumber: { type: String, required: true, unique: true },
    description: { type: String },
    packaging: { type: String, required: true, enum: ['capsule', 'liquid'] },
    capsuleCount: { type: Number },
    liquidVolume: { type: Number },
    image: { type: String },
    weight: { type: Number }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 