const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

// console.log(process.env);

// Crear servidor de express
const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

//escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

//Rutas
// TODO auth // crear login renew
app.use('/api/auth', require('./routes/auth'));
// TODO CRUD Eventos
app.use('/api/events', require('./routes/events'));

// Directorio Publico
app.use(express.static('public'));
