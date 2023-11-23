require('dotenv').config();
const mongoose = require('mongoose');
const User = require('.//models/User');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connecté à MongoDB');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
}

async function createFirstUser() {
    try {
        const userExists = await User.findOne({ username: 'admin' });
        if (userExists) {
            console.log('Un utilisateur admin existe déjà.');
            return;
        }

        const user = new User({
            username: 'admin',
            password: 'votreMotDePasse',
            profile: 'Admin'
        });

        await user.save();
        console.log('Premier utilisateur admin créé avec succès!');
    } catch (error) {
        console.error('Erreur lors de la création du premier utilisateur:', error);
    } finally {
        mongoose.disconnect();
    }
}

async function main() {
    await connectDB();
    await createFirstUser();
}

main();
