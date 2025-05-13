const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/spaces', require('./routes/space.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));
app.use('/api/contacts', require('./routes/contact.routes'));

// Gestion des erreurs
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
