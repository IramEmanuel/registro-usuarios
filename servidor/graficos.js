const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'persona_nueva',
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/agregar', (req, res) => {
  const { Nombre, Apellido, Edad, Genero, Id } = req.body;

  const query = `INSERT INTO agregar_persona (Nombre, Apellido, Edad, Genero, Id) VALUES (?, ?, ?, ?, ?)`;
  const values = [Nombre, Apellido, Edad, Genero, Id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al insertar los datos en la base de datos: ', err);
      res.status(500).json({ error: 'Error al guardar los datos' });
    } else {
      console.log('Datos insertados con éxito');
      res.json({ success: true });
    }
  });
});

app.get('/api/usuarios', (req, res) => {
  const query = `SELECT * FROM agregar_persona`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios de la base de datos: ', err);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    } else {
      res.json(results);
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
