require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear server express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        mgs: 'Hola mundo'
    });
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});