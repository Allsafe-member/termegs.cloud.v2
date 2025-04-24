require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
    {
        fullName: 'Marek',
        email: 'marek@termegs.cloud',
        password: 'mK9#pL2$vN5@xQ8',
        status: 'active'
    },
    {
        fullName: 'Alex',
        email: 'alex@termegs.cloud',
        password: 'aR7#hJ4$nM9@wP3',
        status: 'active'
    }
];

async function createUsers() {
    try {
        console.log('Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/termegs_cloud';
        console.log('Using MongoDB URI:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('Successfully connected to MongoDB');
        
        // Töröljük a meglévő felhasználókat
        await User.deleteMany({});
        console.log('Existing users deleted');
        
        for (const userData of users) {
            try {
                const user = new User(userData);
                await user.save();
                console.log(`User created successfully: ${userData.fullName} (${userData.email})`);
            } catch (err) {
                console.error(`Error creating user ${userData.email}:`, err.message);
            }
        }
        
        console.log('User creation completed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createUsers(); 