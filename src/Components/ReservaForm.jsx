import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearReserva,
  obtenerReservas,
} from "../services/reservaService";
import "./ReservaForm.css";

const ReservaForm = () => {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // =========================================================
  // ESTADOS DEL FORMULARIO
  // =========================================================

  const [form, setForm] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    sala: "",
    comentarios: "",
  });

  // =========================================================
  // ESTADOS DE RESERVAS
  // =========================================================

  const [reservas, setReservas] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);

  // =========================================================
  // ESTADOS DE SALAS
  // =========================================================

  const [salas, setSalas] = useState([]);
  const [cargandoSalas, setCargandoSalas] = useState(true);

  // =========================================================
  // MENSAJES
  // =========================================================

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // ESTADO DE GUARDADO
  // =========================================================

  const [guardando, setGuardando] = useState(false);

  // =========================================================
  // CARGAR SALAS DESDE EL BACKEND
  // =========================================================

  const cargarSalas = async () => {
    try {
      setCargandoSalas(true);

      const respuesta = await fetch(
        `${API_BASE_URL}/api/salas`
      );

      if (!respuesta.ok) {
        throw new Error(
          "No fue posible obtener las salas."
        );
      }

      const datos = await respuesta.json();

      console.log(
        "Salas obtenidas desde MySQL:",
        datos
      );

      // =====================================================
      // SOLO MOSTRAMOS LAS SALAS ACTIVAS
      // =====================================================

      const salasActivas = Array.isArray(datos)
        ? datos.filter((sala) => sala.estado === true)
        : [];

      setSalas(salasActivas);

    } catch (error) {
      console.error(
        "Error obteniendo salas:",
        error
      );

      setSalas([]);

      setErrorMessage(
        "No fue posible cargar las salas disponibles. Verifica que el servidor esté funcionando."
      );

    } finally {
      setCargandoSalas(false);
    }
  };

  // =========================================================
  // CARGAR RESERVAS DESDE MYSQL
  // =========================================================

  const cargarReservas = async () => {
    try {
      setCargandoReservas(true);

      const datos = await obtenerReservas();

      console.log(
        "Reservas obtenidas desde MySQL:",
        datos
      );

      setReservas(
        Array.isArray(datos)
          ? datos
          : []
      );

    } catch (error) {
      console.error(
        "Error obteniendo reservas:",
        error
      );

      setErrorMessage(
        "No fue posible consultar la disponibilidad de las salas."
      );

    } finally {
      setCargandoReservas(false);
    }
  };

  // =========================================================
  // CARGAR INFORMACIÓN AL INICIAR
  // =========================================================

  useEffect(() => {
    cargarSalas();
    cargarReservas();
  }, []);

  // =========================================================
  // FECHA MÍNIMA = HOY
  // =========================================================

  const obtenerFechaActual = () => {
    const hoy = new Date();

    const año = hoy.getFullYear();
    const mes = String(
      hoy.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      hoy.getDate()
    ).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  };

  const fechaMinima = obtenerFechaActual();

  // =========================================================
  // CAMBIOS DEL FORMULARIO
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =========================================================
  // RESERVAS DE LA SALA Y FECHA SELECCIONADAS
  // =========================================================

  const reservasDelHorario = reservas.filter(
    (reserva) => {
      return (
        reserva.fecha === form.fecha &&
        reserva.sala === form.sala &&
        reserva.estado !== "Cancelada"
      );
    }
  );

  // =========================================================
  // VERIFICAR CONFLICTO DE HORARIOS
  // =========================================================

  const existeConflicto = () => {
    if (
      !form.fecha ||
      !form.sala ||
      !form.horaInicio ||
      !form.horaFin
    ) {
      return false;
    }

    return reservasDelHorario.some(
      (reserva) => {
        const inicioExistente =
          reserva.horaInicio;

        const finExistente =
          reserva.horaFin;

        return (
          form.horaInicio <
            finExistente &&
          form.horaFin >
            inicioExistente
        );
      }
    );
  };

  const conflicto =
    existeConflicto();

  // =========================================================
  // VERIFICAR QUE LA SALA SIGA ACTIVA
  // =========================================================

  const salaSeleccionada = salas.find(
    (sala) =>
      sala.nombre === form.sala
  );

  const salaActiva = Boolean(
    salaSeleccionada
  );

  // =========================================================
  // CREAR RESERVA
  // =========================================================

  const verificarDisponibilidad = async (
    e
  ) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // =====================================================
    // VALIDAR USUARIO
    // =====================================================

    if (!usuario?.nombre) {
      setErrorMessage(
        "No se encontró el usuario. Inicia sesión nuevamente."
      );

      return;
    }

    // =====================================================
    // VALIDAR FECHA
    // =====================================================

    if (!form.fecha) {
      setErrorMessage(
        "Selecciona una fecha para la reserva."
      );

      return;
    }

    if (
      form.fecha < fechaMinima
    ) {
      setErrorMessage(
        "No puedes realizar reservas en fechas pasadas."
      );

      return;
    }

    // =====================================================
    // VALIDAR SALA
    // =====================================================

    if (!form.sala) {
      setErrorMessage(
        "Selecciona una sala."
      );

      return;
    }

    // =====================================================
    // VALIDAR QUE LA SALA ESTÉ ACTIVA
    // =====================================================

    if (!salaActiva) {
      setErrorMessage(
        "La sala seleccionada no está disponible. Selecciona una sala activa."
      );

      return;
    }

    // =====================================================
    // VALIDAR HORAS
    // =====================================================

    if (
      !form.horaInicio ||
      !form.horaFin
    ) {
      setErrorMessage(
        "Selecciona la hora de inicio y la hora de finalización."
      );

      return;
    }

    if (
      form.horaFin <=
      form.horaInicio
    ) {
      setErrorMessage(
        "La hora de finalización debe ser posterior a la hora de inicio."
      );

      return;
    }

    // =====================================================
    // VALIDAR CONFLICTO
    // =====================================================

    if (conflicto) {
      setErrorMessage(
        "La sala ya está reservada en el horario seleccionado. Elige otro horario."
      );

      return;
    }

    // =====================================================
    // CREAR RESERVA
    // =====================================================

    try {
      setGuardando(true);

      const nuevaReserva = {
        usuario: usuario.nombre,
        sala: form.sala,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        estado: "Activa",
      };

      console.log(
        "Enviando reserva:",
        nuevaReserva
      );

      await crearReserva(
        nuevaReserva
      );

      setSuccessMessage(
        "¡Reserva creada correctamente!"
      );

      // ===================================================
      // ACTUALIZAR DISPONIBILIDAD
      // ===================================================

      await cargarReservas();

      // ===================================================
      // LIMPIAR FORMULARIO
      // ===================================================

      setForm({
        fecha: "",
        horaInicio: "",
        horaFin: "",
        sala: "",
        comentarios: "",
      });

      // ===================================================
      // IR A MIS RESERVAS
      // ===================================================

      setTimeout(() => {
        navigate(
          "/misreservas"
        );
      }, 1200);

    } catch (error) {
      console.error(
        "Error creando reserva:",
        error
      );

      if (
        error.response?.data?.mensaje
      ) {
        setErrorMessage(
          error.response.data.mensaje
        );
      } else {
        setErrorMessage(
          "No fue posible crear la reserva. Verifica que el servidor esté conectado."
        );
      }

    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="reserva-card">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="reserva-titulo">

        <h2>
          Reserva de Sala
        </h2>

        <p>
          Completa la información para programar tu espacio.
        </p>

      </div>

      <form
        className="reserva-form"
        onSubmit={
          verificarDisponibilidad
        }
      >

        {/* ===================================================
            USUARIO
        =================================================== */}

        <div className="campo">

          <label>
            Usuario
          </label>

          <input
            type="text"
            value={
              usuario?.nombre || ""
            }
            disabled
          />

        </div>

        {/* ===================================================
            FECHA
        =================================================== */}

        <div className="campo">

          <label>
            Fecha
          </label>

          <input
            type="date"
            name="fecha"
            value={form.fecha}
            min={fechaMinima}
            onChange={handleChange}
            required
          />

        </div>

        {/* ===================================================
            SALA
        =================================================== */}

        <div className="campo">

          <label>
            Sala
          </label>

          <select
            name="sala"
            value={form.sala}
            onChange={handleChange}
            required
            disabled={
              cargandoSalas ||
              salas.length === 0
            }
          >

            <option value="">
              {cargandoSalas
                ? "Cargando salas..."
                : salas.length === 0
                ? "No hay salas activas disponibles"
                : "Selecciona una sala"}
            </option>

            {salas.map(
              (sala) => (
                <option
                  key={sala.id}
                  value={sala.nombre}
                >
                  {sala.nombre}
                </option>
              )
            )}

          </select>

          {/* =================================================
              INFORMACIÓN DE LA SALA
          ================================================= */}

          {salaSeleccionada && (
            <div
              style={{
                marginTop: "8px",
                padding: "9px 11px",
                borderRadius: "7px",
                background:
                  "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >

              <strong
                style={{
                  color: "#334155",
                }}
              >
                Capacidad:
              </strong>{" "}
              {salaSeleccionada.capacidad}{" "}
              personas

              {salaSeleccionada.ubicacion && (
                <>
                  {" • "}
                  <strong
                    style={{
                      color: "#334155",
                    }}
                  >
                    Ubicación:
                  </strong>{" "}
                  {
                    salaSeleccionada.ubicacion
                  }
                </>
              )}

            </div>
          )}

        </div>

        {/* ===================================================
            DISPONIBILIDAD
        =================================================== */}

        {form.fecha &&
          form.sala && (
            <div className="disponibilidad">

              <h3>
                Disponibilidad
              </h3>

              {cargandoReservas ? (
                <p>
                  Consultando disponibilidad...
                </p>
              ) : reservasDelHorario.length ===
                0 ? (
                <div className="disponible">
                  🟢 Disponible
                </div>
              ) : (
                <div className="reservado">

                  <div>
                    🔴 Reservado
                  </div>

                  <div className="horarios-ocupados">

                    {reservasDelHorario.map(
                      (reserva) => (
                        <div
                          key={reserva.id}
                          className="horario-ocupado"
                        >
                          {
                            reserva.horaInicio
                          }{" "}
                          -{" "}
                          {
                            reserva.horaFin
                          }
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

        {/* ===================================================
            HORA INICIO
        =================================================== */}

        <div className="campo">

          <label>
            Hora de inicio
          </label>

          <input
            type="time"
            name="horaInicio"
            value={
              form.horaInicio
            }
            onChange={handleChange}
            required
          />

        </div>

        {/* ===================================================
            HORA FIN
        =================================================== */}

        <div className="campo">

          <label>
            Hora de finalización
          </label>

          <input
            type="time"
            name="horaFin"
            value={form.horaFin}
            onChange={handleChange}
            required
          />

        </div>

        {/* ===================================================
            ESTADO DEL HORARIO
        =================================================== */}

        {form.fecha &&
          form.sala &&
          form.horaInicio &&
          form.horaFin && (
            <div className="estado-horario">

              {form.horaFin <=
              form.horaInicio ? (
                <div className="reservado">
                  🔴 Horario inválido
                </div>
              ) : conflicto ? (
                <div className="reservado">
                  🔴 Horario ocupado
                </div>
              ) : (
                <div className="disponible">
                  🟢 Horario disponible
                </div>
              )}

            </div>
          )}

        {/* ===================================================
            COMENTARIOS
        =================================================== */}

        <div className="campo">

          <label>
            Comentarios
          </label>

          <textarea
            name="comentarios"
            value={
              form.comentarios
            }
            onChange={handleChange}
            rows="4"
            placeholder="Comentarios adicionales"
          />

        </div>

        {/* ===================================================
            RESUMEN
        =================================================== */}

        <div className="resumen">

          <h3>
            Resumen de la reserva
          </h3>

          <div className="fila">

            <span>
              Sala
            </span>

            <strong>
              {form.sala || "-"}
            </strong>

          </div>

          <div className="fila">

            <span>
              Fecha
            </span>

            <strong>
              {form.fecha || "-"}
            </strong>

          </div>

          <div className="fila">

            <span>
              Horario
            </span>

            <strong>
              {form.horaInicio &&
              form.horaFin
                ? `${form.horaInicio} - ${form.horaFin}`
                : "-"}
            </strong>

          </div>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {/* ===================================================
            ÉXITO
        =================================================== */}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* ===================================================
            BOTÓN
        =================================================== */}

        <button
          type="submit"
          className="btn-reservar"
          disabled={
            guardando ||
            cargandoReservas ||
            cargandoSalas ||
            salas.length === 0 ||
            !salaActiva ||
            conflicto ||
            (form.horaInicio &&
              form.horaFin &&
              form.horaFin <=
                form.horaInicio)
          }
        >

          {guardando
            ? "Guardando reserva..."
            : salas.length === 0
            ? "No hay salas disponibles"
            : conflicto
            ? "Horario ocupado"
            : "Confirmar Reserva"}

        </button>

      </form>

    </div>
  );
};

export default ReservaForm;
