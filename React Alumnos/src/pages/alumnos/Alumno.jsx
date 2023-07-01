import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Layout from "../../components/Layout";

const Alumno = () => {
  // Estado para almacenar la lista de alumnos
  const [alumnos, setAlumnos] = useState([]);
  // Estado para almacenar la posición actual en la lista de alumnos
  const [pos, setPos] = useState(null);
  // Estado para almacenar el título del formulario
  const [titulo, setTitulo] = useState("AGREGAR ALUMNO");
  // Estados para almacenar los datos del alumno
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [foto, setFoto] = useState("");

  // Obtener la lista de alumnos al cargar el componente
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/alumno/").then((res) => {
      setAlumnos(res.data);
    });
  }, []);

  // Función para manejar el cambio de nombre en el formulario
  const cambioNombre = (e) => {
    setNombre(e.target.value);
  };

  // Función para manejar el cambio de apellido en el formulario
  const cambioApellido = (e) => {
    setApellido(e.target.value);
  };

  // Función para manejar el cambio de fecha de nacimiento en el formulario
  const cambioFecha = (e) => {
    setFechaNacimiento(e.target.value);
  };

  // Función para manejar el cambio de foto en el formulario
  const cambioFoto = (e) => {
    setFoto(e.target.files[0]);
  };

  // Función para mostrar los datos de un alumno en el formulario de edición
  const mostrar = (cod, index) => {
    axios.get(`http://127.0.0.1:8000/alumno/${cod}`).then((res) => {
      setPos(index);
      setTitulo("Editar");
      setId(res.data.id);
      setNombre(res.data.nombre);
      setApellido(res.data.apellido);
      setFechaNacimiento(res.data.fecha_nacimiento);
      setFoto(res.data.foto_url);
    });
  };

  // Función para guardar los datos del alumno
  const guardar = (e) => {
    e.preventDefault();

    if (!foto) {
      console.log("Debe seleccionar una imagen");
      return;
    }

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("apellido", apellido);
    datos.append("fecha_nacimiento", fechaNacimiento);
    datos.append("foto", foto);

    const apiUrl = "http://127.0.0.1:8000";

    if (id > 0) {
      // Actualizar un alumno existente
      axios
        .put(`${apiUrl}/alumno/${id}`, datos)
        .then((res) => {
          const updatedAlumnos = [...alumnos];
          updatedAlumnos[pos] = res.data;
          setPos(null);
          setTitulo("Nuevo");
          setId(0);
          setNombre("");
          setApellido("");
          setFechaNacimiento("");
          setFoto("");
          setAlumnos(updatedAlumnos);
        })
        .catch((error) => {
          console.log(error.toString());
        });
    } else {
      // Agregar un nuevo alumno
      axios
        .post(`${apiUrl}/alumno/`, datos)
        .then((res) => {
          setAlumnos([...alumnos, res.data]);
          setId(0);
          setNombre("");
          setApellido("");
          setFechaNacimiento("");
          setFoto("");
        })
        .catch((error) => {
          console.log(error.toString());
        });
    }
  };

  // Función para eliminar un alumno
  const eliminar = (cod) => {
    let rpta = window.confirm("Desea Eliminar?");
    if (rpta) {
      axios.delete(`http://127.0.0.1:8000/alumno/${cod}`).then((res) => {
        setAlumnos((prevAlumnos) =>
          prevAlumnos.filter((alumno) => alumno.id !== cod)
        );
      });
    }
  };

  return (
    <>
      <Layout>
        <Container>
          <h1 className="mt-4">{titulo}</h1>
          <Form onSubmit={guardar}>
            <Form.Control type="hidden" defaultValue={id} />
            <Form.Group className="mb-3">
              <Form.Label>Ingrese Nombre:</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={cambioNombre}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingrese Apellido:</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={cambioApellido}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha:</Form.Label>
              <Form.Control
                type="date"
                value={fechaNacimiento}
                onChange={cambioFecha}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto:</Form.Label>
              <Form.Control
                type="file"
                defaultValue={foto}
                onChange={cambioFoto}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              GUARDAR
            </Button>
          </Form>
          <hr />
        </Container>

        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno, index) => {
                return (
                  <tr key={alumno.id}>
                    <td>{alumno.id}</td>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.apellido}</td>
                    <td>{alumno.fecha_nacimiento}</td>
                    <td>
                      <img
                        key={alumno.id}
                        src={`${alumno.foto}`}
                        alt="Foto de alumno"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => mostrar(alumno.id, index)}
                        className="mr-2"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => eliminar(alumno.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </Layout>
    </>
  );
};

export default Alumno;
