import React, { useState, useEffect } from 'react';
import './estilos.css';
import axios from 'axios';

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [id, setId] = useState('');
  const [usuariosCargados, setUsuariosCargados] = useState(false);

  useEffect(() => {
    if (!usuariosCargados) {
      fetchUsuarios();
      setUsuariosCargados(true);
    }
  }, [usuariosCargados]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios: ', error);
    }
  };

  const agregarUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/agregar', {
        Nombre: nombre,
        Apellido: apellido,
        Edad: edad,
        Genero: genero,
        Id: id,
      });
      console.log('Datos enviados con éxito');
      setNombre('');
      setApellido('');
      setEdad('');
      setGenero('');
      setId('');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al agregar el usuario: ', error);
    }
  };

  return (
    <div>
      <form className="formulario" onSubmit={agregarUsuario}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <br />
        <label>
          Apellido:
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </label>
        <br />
        <label>
          Edad:
          <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
        </label>
        <br />
        <label>
          Género:
          <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} />
        </label>
        <br />
        <label>
          ID:
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </label>
        <br />
        <button type="submit" className='rainbow-button'>Agregar usuario</button>
      </form>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Género</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.Nombre}</td>
              <td>{usuario.Apellido}</td>
              <td>{usuario.Edad}</td>
              <td>{usuario.Genero}</td>
              <td>{usuario.Id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;
