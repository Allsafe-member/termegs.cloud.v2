require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const port = 3000;

// Body parsing middleware FIRST
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware SECOND
app.use(cors({
    origin: ['http://localhost:8080', 'https://termegs.cloud', 'http://termegs.cloud'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

// Request logging middleware THIRD
app.use((req, res, next) => {
    console.log('--------------------');
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('--------------------');
    next();
});

// MongoDB kapcsolat
mongoose.connect('mongodb://localhost:27017/termegs_cloud')
    .then(() => console.log('MongoDB kapcsolódva'))
    .catch(err => console.error('MongoDB kapcsolódási hiba:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Alap útvonal teszteléshez
app.get('/', (req, res) => {
    res.json({ message: 'A szerver működik' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Szerver hiba:', err);
    res.status(500).json({ message: 'Belső szerver hiba történt' });
});

app.listen(port, () => {
    console.log(`Szerver fut a ${port} porton - http://localhost:${port}`);
}); 