  import { useEffect, useState } from "react";
  import axios from "axios";
  import "bootstrap/dist/css/bootstrap.min.css";
  import Table from "react-bootstrap/Table";
  import Container from "react-bootstrap/Container";
  import Button from "react-bootstrap/Button";
  import Form from "react-bootstrap/Form";
  import Layout from "../../components/Layout";

  const AlumnoHorario = () => {
    const [alumnosHorario, setAlumnosHorario] = useState([]);
    const [pos, setPos] = useState(null);
    const [titulo, setTitulo] = useState("AGREGAR HORARIO");
    const [id, setId] = useState(0);
    const [id_Alumnos, setIdAlumnos] = useState("");
    const [horario_ingreso, setHorarioIngreso] = useState("");
    const [horario_salida, setHorarioSalida] = useState("");
    const [alumnos, setAlumnos] = useState([]);

    const cambiarHIngreso = (e) => {
      setHorarioIngreso(e.target.value);
    };

    const cambiarHSalida = (e) => {
      setHorarioSalida(e.target.value);
    };

    useEffect(() => {
      axios.get("http://127.0.0.1:8000/alumno_horario/").then((res) => {
        setAlumnosHorario(res.data);
      });

      axios.get("http://127.0.0.1:8000/alumno/").then((res) => {
        setAlumnos(res.data);
      });
    }, []);

    const mostrar = (cod, index) => {
      axios.get(`http://127.0.0.1:8000/alumno_horario/${cod}`).then((res) => {
        setPos(index);
        setTitulo("Editar");
        setId(res.data.id);
        setIdAlumnos(res.data.id_Alumnos);
        setHorarioIngreso(res.data.horario_ingreso);
        setHorarioSalida(res.data.horario_salida);
      });
    };

    const guardar = (e) => {
      e.preventDefault();

      const datos = new FormData();
      datos.append("id_Alumnos", id_Alumnos);
      datos.append("horario_ingreso", horario_ingreso);
      datos.append("horario_salida", horario_salida);

      const apiUrl = "http://127.0.0.1:8000";

      if (id > 0) {
        axios.put(`${apiUrl}/alumno_horario/${id}`, datos).then((res) => {
          setPos(null);
          setTitulo("Nuevo");
          setId(0);
          setIdAlumnos("");
          setHorarioIngreso("");
          setHorarioSalida("");
          setAlumnosHorario((prevState) => {
            const updatedAlumnosHorario = [...prevState];
            updatedAlumnosHorario[pos] = res.data;
            return updatedAlumnosHorario;
          });
        }).catch((error) => {
          console.log(error.toString());
          // Manejo de errores adecuado
          // Mostrar mensaje de error al usuario o registrar el error
        });
      } else {
        axios.post(`${apiUrl}/alumno_horario/`, datos).then((res) => {
          setAlumnosHorario((prevState) => [...prevState, res.data]);
          setId(0);
          setIdAlumnos("");
          setHorarioIngreso("");
          setHorarioSalida("");
        }).catch((error) => {
          console.log(error.toString());
          // Manejo de errores adecuado
          // Mostrar mensaje de error al usuario o registrar el error
        });
      }
    };

    const eliminar = (cod) => {
      const rpta = window.confirm("Desea Eliminar?");
      if (rpta) {
        axios.delete(`http://127.0.0.1:8000/alumno_horario/${cod}`).then((res) => {
          setAlumnosHorario((prevState) => prevState.filter((alumno_horario) => alumno_horario.id !== cod));
        });
      }
    };

    return (
      <>
        <Layout>
          <Container>
            <h1>{titulo}</h1>
            <Form onSubmit={guardar}>
              <Form.Control type="hidden" defaultValue={id} />
              <Form.Group className="mb-3">
                <Form.Label>Seleccione al alumno:</Form.Label>
                <Form.Control
                  as="select"
                  value={id_Alumnos}
                  onChange={(e) => setIdAlumnos(e.target.value)}
                >
                  <option value="">Seleccione alumno</option>
                  {alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre} {alumno.apellido}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese Horario de Ingreso:</Form.Label>
                <Form.Control
                  type="time"
                  value={horario_ingreso}
                  onChange={cambiarHIngreso}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese Horario de Salida:</Form.Label>
                <Form.Control
                  type="time"
                  value={horario_salida}
                  onChange={cambiarHSalida}
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
                  <th>Alumno</th>
                  <th>Horario Ingreso</th>
                  <th>Horario Salida</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnosHorario.map((alumnoHorario, index) => {
                  const alumno = alumnos.find(
                    (alumno) => alumno.id === alumnoHorario.id_Alumnos
                  );
                  return (
                    <tr key={alumnoHorario.id}>
                      <td>{alumnoHorario.id}</td>
                      <td>{alumno ? `${alumno.nombre} ${alumno.apellido}` : ''}</td>
                      <td>{alumnoHorario.horario_ingreso}</td>
                      <td>{alumnoHorario.horario_salida}</td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => mostrar(alumnoHorario.id, index)}
                        >
                          Editar
                        </Button>{" "}
                        <Button
                          variant="danger"
                          onClick={() => eliminar(alumnoHorario.id)}
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

  export default AlumnoHorario;
