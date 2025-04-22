const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://termeg.cloud', 'https://termegscloudv2.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Atlas kapcsolat
const MONGODB_URI = 'mongodb+srv://alexjakab23:slT9SVU9Kr9ZiWbg@termegscloud.rriw0qk.mongodb.net/termegs?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('MongoDB Atlas kapcsolat létrejött'))
.catch(err => console.error('MongoDB kapcsolódási hiba:', err));

// Routes
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

// Alap útvonal teszteléshez
app.get('/', (req, res) => {
    res.json({ message: 'A szerver működik' });
});

app.listen(port, () => {
    console.log(`A szerver fut a következő porton: ${port}`);
}); 