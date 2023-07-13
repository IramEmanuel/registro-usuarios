import React, { useState, useEffect } from 'react';
import './estilos.css';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart,Pie, Tooltip, Legend,Cell } from 'recharts';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  pageVertical: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    display:'flex',
    rowGap:10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
    alignItems: 'center',
    display:'flex',
    justifyContent:'space-between',
    height: 24,
  },
  rowVertical: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
    marginBottom: 10,
  },
  cell: {
    justifyContent:'space-between',
    fontSize: 12,
  },
});

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [id, setId] = useState('');
  const [usuariosCargados, setUsuariosCargados] = useState(false);
  const [esPastel, setEsPastel] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfOrientation, setPdfOrientation] = useState('horizontal');
  const [datosGrafico, setDatosGrafico] = useState([]);

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

    const generos = response.data.map(usuario => usuario.Genero);
    const cantidadMasculinos = generos.filter(genero => genero === 'masculino').length;
    const cantidadFemeninos = generos.filter(genero => genero === 'femenino').length;
    const cantidadOtros = generos.filter(genero => genero !== 'masculino' && genero !== 'femenino').length;

    const datos = [
      { genero: 'masculino', cantidad: cantidadMasculinos, color: '#0088FE' },
      { genero: 'femenino', cantidad: cantidadFemeninos, color: '#FF8042' },
      { genero: 'Otros', cantidad: cantidadOtros, color: '#00C49F' }
    ];
    setDatosGrafico(datos);
  } catch (error) {
    console.error('Error al obtener los usuarios: ', error);
  }
  };
  const cambiarEstiloGrafica = () => {
    setEsPastel(!esPastel);
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

  const generarPDF = () => {
    setPdfVisible(true);
  };

  const cambiarOrientacionPDF = (e) => {
    setPdfOrientation(e.target.value);
  };

  return (
    <div>
      <form className="formulario" onSubmit={agregarUsuario}>
        {  <><label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label><br /><label>
            Apellido:
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </label><br /><label>
            Edad:
            <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
          </label><br /><label>
            Género:
            <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} />
          </label><br /><label>
            ID:
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </label><br /><button type="submit" className="rainbow-button">
            Agregar usuario
          </button><button type="button" onClick={generarPDF} className="rainbow-button">
            Generar PDF
          </button><div>
            <label>
              Orientación del PDF:
              <select value={pdfOrientation} onChange={cambiarOrientacionPDF}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </label>
          </div></>}
      </form>

      <table className="tabla-usuarios">
        {  <><thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Género</th>
            <th>ID</th>
          </tr>
        </thead><tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.Nombre}</td>
                <td>{usuario.Apellido}</td>
                <td>{usuario.Edad}</td>
                <td>{usuario.Genero}</td>
                <td>{usuario.Id}</td>
              </tr>
            ))}
          </tbody></>}
      </table>
      <div style={{justifyContent:'center', display:'flex', paddingTop:'50px'}}>
      <button style={{justifyContent:'center'}}
          className={`rainbow-button ${esPastel ? 'active' : ''}`}
          onClick={cambiarEstiloGrafica}
        >
          Cambiar Estilo
        </button>
        </div>
      <div style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
        {esPastel ? (
         <PieChart width={450} height={400}>
         <Pie dataKey="cantidad" data={datosGrafico} label>
           {
             datosGrafico.map((dato, index) => (
               <Cell key={index} fill={dato.color}/>
               
             ))
           }
            <XAxis dataKey="genero" />
          <YAxis />
         </Pie>
         <Tooltip />
         <Legend />
       </PieChart>
        ) : (
          <BarChart width={450} height={400} data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genero" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#ffa500" />
          </BarChart>
        )}
      </div>
      {pdfVisible && (
        <div style={{ marginTop: '20px' }}>
          <PDFViewer style={{ width: '100%', height: '600px' }}>
            <Document>
              {pdfOrientation === 'horizontal' ? (
                <Page style={styles.page}>
                  <View style={styles.section}>
                    <Text style={styles.title}>Usuarios Registrados</Text>
                    <View style={styles.row}>
                      <Text style={styles.header}>Nombre</Text>
                      <Text style={styles.header}>Apellido</Text>
                      <Text style={styles.header}>Edad</Text>
                      <Text style={styles.header}>Género</Text>
                      <Text style={styles.header}>ID</Text>
                    </View>
                    {usuarios.map((usuario, index) => (
                      <View style={styles.row} key={index}>
                        <Text style={styles.cell}>{usuario.Nombre}</Text>
                        <Text style={styles.cell}>{usuario.Apellido}</Text>
                        <Text style={styles.cell}>{usuario.Edad}</Text>
                        <Text style={styles.cell}>{usuario.Genero}</Text>
                        <Text style={styles.cell}>{usuario.Id}</Text>
                      </View>
                    ))}
                  </View>
                </Page>
              ) : (
                <Page style={styles.pageVertical}>
                  <View style={styles.section}>
                    <Text style={styles.title}>Usuarios Registrados</Text>
                    {usuarios.map((usuario, index) => (
                      <View style={styles.rowVertical} key={index}>
                        <Text style={styles.header}>Nombre: {usuario.Nombre}</Text>
                        <Text style={styles.header}>Apellido: {usuario.Apellido}</Text>
                        <Text style={styles.header}>Edad: {usuario.Edad}</Text>
                        <Text style={styles.header}>Género: {usuario.Genero}</Text>
                        <Text style={styles.header}>ID: {usuario.Id}</Text>
                      </View>
                    ))}
                  </View>
                </Page>
              )}
            </Document>
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;
