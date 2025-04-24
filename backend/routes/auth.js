const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendConfirmationEmail, sendAdminNotificationEmail, sendActivationEmail } = require('../services/emailService');

// Regisztráció
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Email cím ellenőrzése
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ez az email cím már regisztrálva van!' });
        }

        // Megerősítő token generálása
        const confirmationToken = uuidv4();

        // Új felhasználó létrehozása
        const newUser = new User({
            fullName,
            email,
            password,
            confirmationToken
        });

        await newUser.save();

        // Email küldése a felhasználónak és az adminnak
        await sendConfirmationEmail(email, confirmationToken);
        await sendAdminNotificationEmail(newUser, confirmationToken);

        res.status(201).json({ 
            message: 'Sikeres regisztráció! Kérjük, ellenőrizze email fiókját.'
        });

    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        res.status(500).json({ message: 'Hiba történt a regisztráció során.' });
    }
});

// Regisztráció jóváhagyása
router.post('/approve-registration', async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ confirmationToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Érvénytelen vagy lejárt token.' });
        }

        // Felhasználó aktiválása
        user.status = 'active';
        user.confirmationToken = undefined;
        await user.save();

        // Értesítő email küldése a felhasználónak
        await sendActivationEmail(user.email);

        res.json({ message: 'Felhasználó sikeresen aktiválva!' });

    } catch (error) {
        console.error('Jóváhagyási hiba:', error);
        res.status(500).json({ message: 'Hiba történt a jóváhagyás során.' });
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
    try {
        console.log('Bejelentkezési kérés érkezett:', req.body);
        const { email, password } = req.body;

        // Felhasználó keresése
        const user = await User.findOne({ email });
        console.log('Felhasználó keresés eredménye:', user ? 'Megtalálva' : 'Nem található');
        
        if (!user) {
            console.log('Felhasználó nem található:', email);
            return res.status(401).json({ message: 'Hibás email cím vagy jelszó!' });
        }

        // Jelszó ellenőrzése
        const isMatch = await user.comparePassword(password);
        console.log('Jelszó ellenőrzés eredménye:', isMatch ? 'Helyes' : 'Helytelen');
        
        if (!isMatch) {
            console.log('Helytelen jelszó:', email);
            return res.status(401).json({ message: 'Hibás email cím vagy jelszó!' });
        }

        // Státusz ellenőrzése
        console.log('Felhasználó státusza:', user.status);
        if (user.status !== 'active') {
            return res.status(403).json({ 
                message: 'A fiók még nincs aktiválva. Kérjük, várja meg az admin jóváhagyását.' 
            });
        }

        // JWT token generálása és küldése
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'termegs_secret_key_2024',
            { expiresIn: '24h' }
        );
        console.log('Token generálva:', token ? 'Sikeres' : 'Sikertelen');

        const response = {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        };
        console.log('Sikeres bejelentkezés válasz előkészítve');
        
        res.json(response);
    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        res.status(500).json({ message: 'Hiba történt a bejelentkezés során.' });
    }
});

module.exports = router; 