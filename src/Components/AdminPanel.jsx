import React, { useEffect, useState } from "react";

import {
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaHome,
  FaUserPlus,
  FaEdit,
  FaUserCheck,
  FaUserTimes,
  FaSyncAlt,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaShieldAlt,
  FaSignOutAlt,
  FaBars,
  FaClipboardList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCog,
} from "react-icons/fa";
import AdminConfiguracion from "./AdminConfiguracion";
import GestionSalas from "./GestionSalas";
import "./AdminPanel.css";

const AdminPanel = () => {
  // =========================================================
  // CONFIGURACIÃƒâ€œN
  // =========================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // =========================================================
  // USUARIO ACTUAL
  // =========================================================

  const obtenerUsuarioActual = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (usuarioGuardado) {
        return JSON.parse(usuarioGuardado);
      }
    } catch (error) {
      console.error("Error leyendo usuario:", error);
    }

    return {
      nombre: "Administrador",
      tipoUsuario: "admin",
    };
  };

  const usuarioActual = obtenerUsuarioActual();

  // =========================================================
  // ESTADOS GENERALES
  // =========================================================

  const [section, setSection] = useState("inicio");

  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  const [notificacionesAbiertas, setNotificacionesAbiertas] =
    useState(false);

  const [menuAbierto, setMenuAbierto] = useState(false);

  // =========================================================
  // FECHA Y HORA
  // =========================================================

  const [horaActual, setHoraActual] = useState(new Date());

  // =========================================================
  // CARGAS
  // =========================================================

  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoReservas, setCargandoReservas] = useState(false);

  // =========================================================
  // ERRORES
  // =========================================================

  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [errorReservas, setErrorReservas] = useState("");

  // =========================================================
  // MODALES
  // =========================================================

  const [mostrarCrearUsuario, setMostrarCrearUsuario] = useState(false);
  const [mostrarEditarUsuario, setMostrarEditarUsuario] = useState(false);
  const [mostrarCrearReserva, setMostrarCrearReserva] = useState(false);

  // =========================================================
  // EDITAR USUARIO
  // =========================================================

  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nombreEditando, setNombreEditando] = useState("");
  const [rolEditando, setRolEditando] = useState("usuario");
  const [guardandoUsuario, setGuardandoUsuario] = useState(false);

  // =========================================================
  // CREAR USUARIO
  // =========================================================

  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [nuevoTipoUsuario, setNuevoTipoUsuario] = useState("usuario");
  const [nuevaPreguntaSeguridad, setNuevaPreguntaSeguridad] =
    useState("");
  const [nuevaRespuestaSeguridad, setNuevaRespuestaSeguridad] =
    useState("");
  const [creandoUsuario, setCreandoUsuario] = useState(false);

  // =========================================================
  // CREAR RESERVA
  // =========================================================

  const [nuevaReserva, setNuevaReserva] = useState({
    sala: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
  });

  const [creandoReserva, setCreandoReserva] = useState(false);

  // =========================================================
  // CONFIGURACIÃƒâ€œN
  // =========================================================

  const [configuracion, setConfiguracion] = useState({
    notificacionesReservas: true,
    calendarioReservas: true,
    recordatorios: true,
    tiempoRecordatorio: 60,
  });

  // =========================================================
  // PREGUNTAS DE SEGURIDAD
  // =========================================================

  const preguntasSeguridad = [
    "Â¿CuÃ¡l es el nombre de tu mascota?",
    "Â¿CuÃ¡l es tu ciudad de nacimiento?",
    "Â¿CuÃ¡l era el nombre de tu colegio?",
    "Â¿CuÃ¡l es tu comida favorita?",
  ];

  // =========================================================
  // OBTENER USUARIOS
  // =========================================================

  const obtenerUsuarios = async () => {
    try {
      setCargandoUsuarios(true);
      setErrorUsuarios("");

      const respuesta = await fetch(
        `${API_BASE_URL}/api/usuario`
      );

      if (!respuesta.ok) {
        throw new Error("No fue posible obtener los usuarios.");
      }

      const datos = await respuesta.json();setUsuarios(
  Array.isArray(datos)
    ? datos.filter((usuario) => usuario.estado === true)
    : []
   );
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);

      setErrorUsuarios(
        "No fue posible cargar los usuarios. Verifica que el servidor estÃ© funcionando."
      );
    } finally {
      setCargandoUsuarios(false);
    }
  };

  // =========================================================
  // OBTENER RESERVAS
  // =========================================================

  const obtenerReservas = async () => {
    try {
      setCargandoReservas(true);
      setErrorReservas("");

      const respuesta = await fetch(
        `${API_BASE_URL}/api/reservas`
      );

      if (!respuesta.ok) {
        throw new Error("No fue posible obtener las reservas.");
      }

      const datos = await respuesta.json();

      setReservas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error obteniendo reservas:", error);

      setErrorReservas(
        "No fue posible cargar las reservas. Verifica que el servidor estÃ© funcionando."
      );
    } finally {
      setCargandoReservas(false);
    }
  };

  // =========================================================
  // OBTENER NOTIFICACIONES
  // =========================================================

  const obtenerNotificaciones = () => {
    try {
      const guardadas = localStorage.getItem(
        "notificacionesAdmin"
      );

      if (guardadas) {
        const datos = JSON.parse(guardadas);

        if (Array.isArray(datos)) {
          setNotificaciones(datos);
        }
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setNotificaciones([]);
    }
  };

  // =========================================================
  // OBTENER CONFIGURACIÃƒâ€œN
  // =========================================================

  const obtenerConfiguracion = () => {
    try {
      const guardada = localStorage.getItem(
        "configuracionSmartReserve"
      );

      if (guardada) {
        const configuracionGuardada = JSON.parse(guardada);

        setConfiguracion({
          notificacionesReservas:
            configuracionGuardada.notificacionesReservas ?? true,

          calendarioReservas:
            configuracionGuardada.calendarioReservas ?? true,

          recordatorios:
            configuracionGuardada.recordatorios ?? true,

          tiempoRecordatorio:
            configuracionGuardada.tiempoRecordatorio ?? 60,
        });
      }
    } catch (error) {
      console.error("Error cargando configuraciÃ³n:", error);
    }
  };

  // =========================================================
  // RELOJ
  // =========================================================

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // =========================================================
  // CREAR NOTIFICACIÃƒâ€œN
  // =========================================================

  const crearNotificacion = ({
    titulo,
    mensaje,
    tipo = "info",
  }) => {
    const nueva = {
      id: Date.now(),
      titulo,
      mensaje,
      tipo,
      fecha: new Date().toLocaleString("es-CO"),
      leida: false,
    };

    setNotificaciones((actuales) => {
      const nuevas = [nueva, ...actuales];

      localStorage.setItem(
        "notificacionesAdmin",
        JSON.stringify(nuevas)
      );

      return nuevas;
    });
  };

  // =========================================================
  // GUARDAR CONFIGURACIÃƒâ€œN
  // =========================================================

  const guardarConfiguracion = (nuevaConfiguracion) => {
    setConfiguracion(nuevaConfiguracion);

    localStorage.setItem(
      "configuracionSmartReserve",
      JSON.stringify(nuevaConfiguracion)
    );

    crearNotificacion({
      titulo: "ConfiguraciÃ³n actualizada",
      mensaje:
        "La configuraciÃ³n de SmartReserve fue actualizada correctamente.",
      tipo: "success",
    });
  };

  // =========================================================
  // INICIALIZAR
  // =========================================================

  useEffect(() => {
    obtenerUsuarios();
    obtenerReservas();
    obtenerNotificaciones();
    obtenerConfiguracion();
  }, []);

  // =========================================================
  // ESTADÃƒÂSTICAS
  // =========================================================

  const totalUsuarios = usuarios.length;

  const usuariosActivos = usuarios.filter(
    (usuario) => Boolean(usuario.estado)
  ).length;

  const administradores = usuarios.filter(
    (usuario) => usuario.tipoUsuario === "admin"
  ).length;

  const reservasActivas = reservas.filter(
    (reserva) => reserva.estado !== "Cancelada"
  ).length;

  const notificacionesNoLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida
  ).length;

  // =========================================================
  // CAMBIAR SECCIÃƒâ€œN
  // =========================================================

  const cambiarSeccion = (nuevaSeccion) => {
    setSection(nuevaSeccion);
    setMenuAbierto(false);
    setNotificacionesAbiertas(false);
  };

  // =========================================================
  // CREAR USUARIO
  // =========================================================

  const abrirCrearUsuario = () => {
    setNuevoUsuario("");
    setNuevaClave("");
    setConfirmarClave("");
    setNuevoTipoUsuario("usuario");
    setNuevaPreguntaSeguridad("");
    setNuevaRespuestaSeguridad("");
    setMostrarCrearUsuario(true);
  };

  const cerrarCrearUsuario = () => {
    if (creandoUsuario) return;

    setMostrarCrearUsuario(false);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    if (
      !nuevoUsuario.trim() ||
      !nuevaClave ||
      !confirmarClave ||
      !nuevoTipoUsuario ||
      !nuevaPreguntaSeguridad ||
      !nuevaRespuestaSeguridad.trim()
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (nuevaClave !== confirmarClave) {
      alert("Las contraseÃƒÂ±as no coinciden.");
      return;
    }

    try {
      setCreandoUsuario(true);

      const respuesta = await fetch(
        `${API_BASE_URL}/api/usuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nuevoUsuario.trim(),
            clave: nuevaClave,
            tipoUsuario: nuevoTipoUsuario,
            preguntaSeguridad: nuevaPreguntaSeguridad,
            respuestaSeguridad:
              nuevaRespuestaSeguridad.trim(),
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible crear el usuario."
        );
      }

      crearNotificacion({
        titulo: "Nuevo usuario",
        mensaje: `Se creÃ³ el usuario ${nuevoUsuario.trim()} correctamente.`,
        tipo: "success",
      });

      alert(
        datos.mensaje ||
          "Usuario creado correctamente."
      );

      cerrarCrearUsuario();
      obtenerUsuarios();
    } catch (error) {
      console.error("Error creando usuario:", error);

      alert(
        error.message ||
          "No fue posible crear el usuario."
      );
    } finally {
      setCreandoUsuario(false);
    }
  };

  // =========================================================
  // EDITAR USUARIO
  // =========================================================

  const abrirEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNombreEditando(usuario.nombre || "");
    setRolEditando(usuario.tipoUsuario || "usuario");
    setMostrarEditarUsuario(true);
  };

  const cerrarEditarUsuario = () => {
    if (guardandoUsuario) return;

    setMostrarEditarUsuario(false);
    setUsuarioEditando(null);
    setNombreEditando("");
    setRolEditando("usuario");
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!usuarioEditando) return;

    if (!nombreEditando.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    try {
      setGuardandoUsuario(true);

      const respuesta = await fetch(
        `${API_BASE_URL}/api/usuario/${usuarioEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreEditando.trim(),
            tipoUsuario: rolEditando,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible actualizar el usuario."
        );
      }

      setUsuarios((actuales) =>
  nuevoEstado
    ? actuales.map((item) =>
        item.id === usuario.id
          ? datos.usuario
          : item
      )
    : actuales.filter(
        (item) => item.id !== usuario.id
      )
);

      crearNotificacion({
        titulo: "Usuario actualizado",
        mensaje: `El usuario ${nombreEditando.trim()} fue actualizado correctamente.`,
        tipo: "success",
      });

      alert(
        datos.mensaje ||
          "Usuario actualizado correctamente."
      );

      cerrarEditarUsuario();
    } catch (error) {
      console.error(
        "Error actualizando usuario:",
        error
      );

      alert(
        error.message ||
          "No fue posible actualizar el usuario."
      );
    } finally {
      setGuardandoUsuario(false);
    }
  };

  // =========================================================
  // CAMBIAR ROL
  // =========================================================

  const cambiarRol = async (usuario, nuevoRol) => {
    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/api/usuario/${usuario.id}/rol`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoUsuario: nuevoRol,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible cambiar el rol."
        );
      }

      setUsuarios((actuales) =>
        actuales.map((item) =>
          item.id === usuario.id
            ? datos.usuario
            : item
        )
      );

      crearNotificacion({
        titulo: "Rol actualizado",
        mensaje: `El rol de ${usuario.nombre} fue cambiado correctamente.`,
        tipo: "info",
      });
    } catch (error) {
      console.error(
        "Error cambiando rol:",
        error
      );

      alert(
        error.message ||
          "No fue posible cambiar el rol."
      );

      obtenerUsuarios();
    }
  };

  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const cambiarEstado = async (usuario) => {
    const nuevoEstado = !Boolean(usuario.estado);

    const accion = nuevoEstado
      ? "activar"
      : "desactivar";

    const confirmado = window.confirm(
      `Â¿Deseas ${accion} al usuario ${usuario.nombre}?`
    );

    if (!confirmado) return;

    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/api/usuario/${usuario.id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible cambiar el estado."
        );
      }

      setUsuarios((actuales) =>
  nuevoEstado
    ? actuales.map((item) =>
        item.id === usuario.id
          ? datos.usuario
          : item
      )
    : actuales.filter(
        (item) => item.id !== usuario.id
      )
);
      crearNotificacion({
        titulo: nuevoEstado
          ? "Usuario activado"
          : "Usuario desactivado",

        mensaje: `El usuario ${usuario.nombre} fue ${
          nuevoEstado ? "activado" : "desactivado"
        }.`,

        tipo: nuevoEstado
          ? "success"
          : "warning",
      });

      alert(
        datos.mensaje ||
          `Usuario ${
            nuevoEstado ? "activado" : "desactivado"
          } correctamente.`
      );
    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );

      alert(
        error.message ||
          "No fue posible cambiar el estado."
      );
    }
  };

  // =========================================================
  // CREAR RESERVA
  // =========================================================

  const abrirCrearReserva = () => {
    setNuevaReserva({
      sala: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
    });

    setMostrarCrearReserva(true);
  };

  const cerrarCrearReserva = () => {
    if (creandoReserva) return;

    setMostrarCrearReserva(false);
  };

  const cambiarCampoReserva = (e) => {
    const { name, value } = e.target;

    setNuevaReserva((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const crearReserva = async (e) => {
    e.preventDefault();

    const {
      sala,
      fecha,
      horaInicio,
      horaFin,
    } = nuevaReserva;

    if (
      !sala ||
      !fecha ||
      !horaInicio ||
      !horaFin
    ) {
      alert(
        "Todos los campos de la reserva son obligatorios."
      );
      return;
    }

    if (horaFin <= horaInicio) {
      alert(
        "La hora de finalizaciÃ³n debe ser posterior a la hora de inicio."
      );
      return;
    }

    try {
      setCreandoReserva(true);

      const respuesta = await fetch(
        `${API_BASE_URL}/api/reservas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario:
              usuarioActual.nombre ||
              "Administrador",
            sala,
            fecha,
            horaInicio,
            horaFin,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible crear la reserva."
        );
      }

      setReservas((actuales) => [
        ...actuales,
        datos,
      ]);

      crearNotificacion({
        titulo: "Nueva reserva",
        mensaje: `El administrador ${
          usuarioActual.nombre ||
          "Administrador"
        } reservÃ³ ${sala} para el ${fecha} de ${horaInicio} a ${horaFin}.`,
        tipo: "success",
      });

      alert("Reserva creada correctamente.");

      cerrarCrearReserva();
    } catch (error) {
      console.error(
        "Error creando reserva:",
        error
      );

      alert(
        error.message ||
          "No fue posible crear la reserva."
      );
    } finally {
      setCreandoReserva(false);
    }
  };

  // =========================================================
  // CANCELAR RESERVA
  // =========================================================

  const cancelarReserva = async (reserva) => {
    const confirmado = window.confirm(
      `Â¿Deseas cancelar la reserva #${reserva.id} de la sala ${reserva.sala}?`
    );

    if (!confirmado) return;

    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/api/reservas/${reserva.id}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible cancelar la reserva."
        );
      }

      setReservas((actuales) =>
        actuales.map((item) =>
          item.id === reserva.id
            ? {
                ...item,
                estado: "Cancelada",
              }
            : item
        )
      );

      crearNotificacion({
        titulo: "Reserva cancelada",
        mensaje: `La reserva #${reserva.id} de la sala ${reserva.sala} fue cancelada por el administrador.`,
        tipo: "warning",
      });

      alert(
        "Reserva cancelada correctamente."
      );
    } catch (error) {
      console.error(
        "Error cancelando reserva:",
        error
      );

      alert(
        error.message ||
          "No fue posible cancelar la reserva."
      );
    }
  };

  // =========================================================
  // NOTIFICACIONES
  // =========================================================

  /*
   * IMPORTANTE:
   * Al hacer clic en una notificaciÃ³n:
   * 1. Se elimina de la pantalla.
   * 2. Se elimina de localStorage.
   * 3. El contador se actualiza automÃ¡ticamente.
   */
  const marcarNotificacionLeida = (id) => {
    setNotificaciones((actuales) => {
      const nuevas = actuales.filter(
        (notificacion) =>
          notificacion.id !== id
      );

      localStorage.setItem(
        "notificacionesAdmin",
        JSON.stringify(nuevas)
      );

      return nuevas;
    });
  };

  /*
   * El botÃ³n "Marcar todas" limpia completamente
   * las notificaciones.
   */
  const marcarTodasLeidas = () => {
    setNotificaciones([]);

    localStorage.setItem(
      "notificacionesAdmin",
      JSON.stringify([])
    );

    setNotificacionesAbiertas(false);
  };

  // =========================================================
  // FECHA Y HORA FORMATEADAS
  // =========================================================

  const fechaFormateada =
    horaActual.toLocaleDateString(
      "es-CO",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const horaFormateada =
    horaActual.toLocaleTimeString(
      "es-CO",
      {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  // =========================================================
  // INICIO
  // =========================================================

  const renderInicio = () => {
    return (
      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span>AdministraciÃ³n</span>

            <h2>
              Panel de administrador
            </h2>

            <p>
              Gestiona usuarios, reservas y
              actividades de SmartReserve.
            </p>
          </div>

        </div>

        <div className="admin-topbar-date">
          <span className="admin-date">
            {horaActual.toLocaleDateString(
              "es-CO",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </span>

          <span className="admin-time">
            {horaActual.toLocaleTimeString(
              "es-CO",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            )}
          </span>
        </div>

        <div className="admin-current-time">

          <div className="admin-time-icon">
            <span>Ã¢â€”Â</span>
          </div>

          <div>
            <span>Hora actual</span>
            <strong>{horaFormateada}</strong>
          </div>

        </div>

        <div className="admin-stats-grid">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              <FaUsers />
            </div>

            <div>
              <span>Usuarios</span>
              <strong>{totalUsuarios}</strong>
              <small>Registrados</small>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon green">
              <FaUserCheck />
            </div>

            <div>
              <span>Usuarios activos</span>
              <strong>{usuariosActivos}</strong>
              <small>Con acceso habilitado</small>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon purple">
              <FaUserCog />
            </div>

            <div>
              <span>Administradores</span>
              <strong>{administradores}</strong>
              <small>Con privilegios</small>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon orange">
              <FaCalendarAlt />
            </div>

            <div>
              <span>Reservas activas</span>
              <strong>{reservasActivas}</strong>
              <small>Actualmente registradas</small>
            </div>

          </div>

        </div>

        <div className="admin-dashboard-grid">

          <div className="admin-welcome-card">

            <div className="admin-welcome-icon">
              <FaShieldAlt />
            </div>

            <div>

              <span className="admin-card-label">
                PANEL ADMINISTRATIVO
              </span>

              <h3>
                Bienvenido,{" "}
                {usuarioActual.nombre ||
                  "Administrador"}
              </h3>

              <p>
                Desde este panel puedes
                administrar los usuarios,
                controlar las reservas y
                supervisar las actividades
                de SmartReserve.
              </p>

            </div>

          </div>

          <div className="admin-actions-card">

            <div className="admin-card-heading">

              <div>
                <span>GESTIÃƒâ€œN</span>
                <h3>Acciones rÃ¡pidas</h3>
              </div>

            </div>

            <div className="admin-quick-actions">

              <button
                onClick={abrirCrearUsuario}
              >
                <FaUserPlus />
                <span>Crear usuario</span>
              </button>

              <button
                onClick={abrirCrearReserva}
              >
                <FaPlus />
                <span>Crear reserva</span>
              </button>

              <button
                onClick={() =>
                  cambiarSeccion("usuarios")
                }
              >
                <FaUsers />
                <span>Ver usuarios</span>
              </button>

              <button
                onClick={() =>
                  cambiarSeccion("reservas")
                }
              >
                <FaCalendarAlt />
                <span>Ver reservas</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // =========================================================
  // USUARIOS
  // =========================================================

  const renderUsuarios = () => {
    return (
      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span>AdministraciÃ³n</span>

            <h2>Usuarios</h2>

            <p>
              Crea, edita y administra los
              usuarios registrados.
            </p>
          </div>

          <div className="admin-section-buttons">

            <button
              className="secondary-button"
              onClick={obtenerUsuarios}
              disabled={cargandoUsuarios}
            >
              <FaSyncAlt
                className={
                  cargandoUsuarios
                    ? "spin"
                    : ""
                }
              />

              {cargandoUsuarios
                ? "Actualizando..."
                : "Actualizar"}
            </button>

            <button
              className="primary-button"
              onClick={abrirCrearUsuario}
            >
              <FaUserPlus />
              Nuevo usuario
            </button>

          </div>

        </div>

        {errorUsuarios && (
          <div className="admin-error">
            <FaExclamationTriangle />
            <span>{errorUsuarios}</span>
          </div>
        )}

        <div className="admin-table-container">

          {cargandoUsuarios &&
          usuarios.length === 0 ? (
            <p className="admin-loading">
              Cargando usuarios...
            </p>
          ) : usuarios.length === 0 ? (
            <p className="admin-loading">
              No hay usuarios registrados.
            </p>
          ) : (
            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>

                    <td>
                      <span className="table-id">
                        #{usuario.id}
                      </span>
                    </td>

                    <td>
                      <div className="table-user">

                        <div className="table-user-avatar">
                          {(usuario.nombre || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {usuario.nombre}
                          </strong>

                          <span>
                            Usuario registrado
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>

                      <select
                        className="admin-role-select"
                        value={
                          usuario.tipoUsuario
                        }
                        onChange={(e) =>
                          cambiarRol(
                            usuario,
                            e.target.value
                          )
                        }
                      >

                        <option value="usuario">
                          Usuario
                        </option>

                        <option value="admin">
                          Administrador
                        </option>

                      </select>

                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          Boolean(
                            usuario.estado
                          )
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >

                        <span className="status-dot" />

                        {Boolean(
                          usuario.estado
                        )
                          ? "Activo"
                          : "Inactivo"}

                      </span>

                    </td>

                    <td>

                      <div className="table-actions">

                        <button
                          className="table-action-button"
                          onClick={() =>
                            abrirEditarUsuario(
                              usuario
                            )
                          }
                          title="Editar usuario"
                        >
                          <FaEdit />
                          Editar
                        </button>

                        <button
                          className={`table-action-button ${
                            Boolean(
                              usuario.estado
                            )
                              ? "danger"
                              : "success"
                          }`}
                          onClick={() =>
                            cambiarEstado(
                              usuario
                            )
                          }
                        >

                          {Boolean(
                            usuario.estado
                          ) ? (
                            <>
                              <FaUserTimes />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <FaUserCheck />
                              Activar
                            </>
                          )}

                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>
    );
  };

  // =========================================================
  // RESERVAS
  // =========================================================

  const renderReservas = () => {
    const reservasOrdenadas = [...reservas].sort(
      (a, b) =>
        new Date(
          `${a.fecha}T${a.horaInicio}`
        ) -
        new Date(
          `${b.fecha}T${b.horaInicio}`
        )
    );

    return (
      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span>AdministraciÃ³n</span>

            <h2>Reservas</h2>

            <p>
              Consulta y administra las
              reservas registradas en
              SmartReserve.
            </p>
          </div>

          <div className="admin-section-buttons">

            <button
              className="secondary-button"
              onClick={obtenerReservas}
              disabled={cargandoReservas}
            >

              <FaSyncAlt
                className={
                  cargandoReservas
                    ? "spin"
                    : ""
                }
              />

              {cargandoReservas
                ? "Actualizando..."
                : "Actualizar"}

            </button>

            <button
              className="primary-button"
              onClick={abrirCrearReserva}
            >
              <FaPlus />
              Nueva reserva
            </button>

          </div>

        </div>

        {errorReservas && (
          <div className="admin-error">
            <FaExclamationTriangle />
            <span>{errorReservas}</span>
          </div>
        )}

        <div className="admin-table-container">

          {cargandoReservas &&
          reservas.length === 0 ? (
            <p className="admin-loading">
              Cargando reservas...
            </p>
          ) : reservas.length === 0 ? (
            <p className="admin-loading">
              No hay reservas registradas.
            </p>
          ) : (
            <table className="admin-table reservations-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {reservasOrdenadas.map(
                  (reserva) => (
                    <tr key={reserva.id}>

                      <td>
                        <span className="table-id">
                          #{reserva.id}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {reserva.usuario}
                        </strong>
                      </td>

                      <td>
                        <span className="room-name">
                          {reserva.sala}
                        </span>
                      </td>

                      <td>
                        {reserva.fecha}
                      </td>

                      <td>
                        <span className="time-badge">
                          {reserva.horaInicio}
                        </span>
                      </td>

                      <td>
                        <span className="time-badge">
                          {reserva.horaFin}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            reserva.estado ===
                            "Cancelada"
                              ? "status-inactive"
                              : "status-active"
                          }`}
                        >

                          <span className="status-dot" />

                          {reserva.estado ||
                            "Activa"}

                        </span>

                      </td>

                      <td>

                        {reserva.estado !==
                        "Cancelada" ? (
                          <div className="table-actions">

                            <button
                              className="table-action-button danger"
                              onClick={() =>
                                cancelarReserva(
                                  reserva
                                )
                              }
                            >
                              <FaTrash />
                              Cancelar
                            </button>

                          </div>
                        ) : (
                          <span className="no-action">
                            Sin acciones
                          </span>
                        )}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>
    );
  };

  // =========================================================
  // NOTIFICACIONES
  // =========================================================

  const renderNotificaciones = () => {
    return (
      <div className="admin-section">

        <div className="admin-section-header">

          <div>
            <span>AdministraciÃ³n</span>

            <h2>Notificaciones</h2>

            <p>
              Consulta las actividades
              recientes del sistema.
            </p>
          </div>

          {notificaciones.length > 0 && (
            <button
              className="secondary-button"
              onClick={marcarTodasLeidas}
            >
              <FaCheckCircle />
              Limpiar notificaciones
            </button>
          )}

        </div>

        <div className="admin-notifications-list">

          {notificaciones.length === 0 ? (

            <div className="admin-empty-notifications">

              <div className="empty-icon">
                <FaBell />
              </div>

              <h3>
                No hay notificaciones
              </h3>

              <p>
                Las nuevas actividades
                aparecerÃ¡n aquÃ­.
              </p>

            </div>

          ) : (

            notificaciones.map(
              (notificacion) => (

                <div
                  key={notificacion.id}
                  className="admin-notification unread"
                  onClick={() =>
                    marcarNotificacionLeida(
                      notificacion.id
                    )
                  }
                  title="Haz clic para eliminar esta notificaciÃ³n"
                >

                  <div className="admin-notification-icon">

                    {notificacion.tipo ===
                    "warning" ? (
                      <FaExclamationTriangle />
                    ) : (
                      <FaBell />
                    )}

                  </div>

                  <div className="admin-notification-content">

                    <div className="admin-notification-title">

                      <strong>
                        {notificacion.titulo}
                      </strong>

                      <span className="notification-dot" />

                    </div>

                    <p>
                      {notificacion.mensaje}
                    </p>

                    <small>
                      {notificacion.fecha}
                    </small>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>
    );
  };

 const renderContenido = () => {

  switch (section) {

    case "usuarios":
      return renderUsuarios();

    case "reservas":
      return renderReservas();

    case "salas":
      return (
        <GestionSalas
          agregarNotificacion={crearNotificacion}
        />
      );

    case "notificaciones":
      return renderNotificaciones();

    case "configuracion":
      return (
        <AdminConfiguracion
          usuario={usuarioActual}
          agregarNotificacion={crearNotificacion}
        />
      );

    case "inicio":
    default:
      return renderInicio();
  }
};
  // =========================================================
  // CERRAR SESIÃƒâ€œN
  // =========================================================

  const cerrarSesion = () => {

    const confirmado = window.confirm(
      "Â¿Deseas cerrar sesiÃ³n?"
    );

    if (!confirmado) return;

    localStorage.removeItem("usuario");

    window.location.href = "/login";
  };

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="admin-panel">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`admin-sidebar ${
          menuAbierto ? "open" : ""
        }`}
      >

        <div className="admin-sidebar-header">

          <div className="admin-logo">
            <FaShieldAlt />
          </div>

          <div className="admin-brand">

            <h2>SmartReserve</h2>

            <span>
              Panel administrativo
            </span>

          </div>

        </div>

        <div className="admin-sidebar-section-title">
          MENÃš PRINCIPAL
        </div>

        <nav className="admin-navigation">

          <button
            className={
              section === "inicio"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion("inicio")
            }
          >
            <FaHome />
            <span>Inicio</span>
          </button>

          <button
            className={
              section === "usuarios"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion("usuarios")
            }
          >
            <FaUsers />
            <span>Usuarios</span>
          </button>

          <button
            className={
              section === "reservas"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion("reservas")
            }
          >
         <FaCalendarAlt />
            <span>Reservas</span>
          </button>

          <button
            className={
              section === "salas"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion("salas")
            }
          >
            <FaHome />
            <span>Salas</span>
          </button>

          <button
            className={
              section === "notificaciones"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion(
                "notificaciones"
              )
            }
          >

            <FaBell />

            <span>Notificaciones</span>

            {notificacionesNoLeidas > 0 && (
              <span className="admin-notification-count">
                {notificacionesNoLeidas}
              </span>
            )}

          </button>

          <button
            className={
              section === "configuracion"
                ? "active"
                : ""
            }
            onClick={() =>
              cambiarSeccion(
                "configuracion"
              )
            }
          >
            <FaCog />
            <span>ConfiguraciÃ³n</span>
          </button>

        </nav>

        <div className="admin-sidebar-footer">

          <div className="admin-sidebar-user">

            <div className="admin-user-avatar small">
              {(usuarioActual.nombre ||
                "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {usuarioActual.nombre ||
                  "Administrador"}
              </strong>

              <span>
                Administrador
              </span>

            </div>

          </div>

          <button
            onClick={cerrarSesion}
          >
            <FaSignOutAlt />
            Cerrar sesiÃ³n
          </button>

        </div>

      </aside>

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ===================================================== */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <button
              className="admin-menu-button"
              onClick={() =>
                setMenuAbierto(
                  !menuAbierto
                )
              }
            >
              <FaBars />
            </button>

            <div className="admin-topbar-title">

              <span>
                Sistema de gestiÃ³n
              </span>

              <h1>
                SmartReserve
              </h1>

            </div>

          </div>

          <div className="admin-topbar-actions">

            <button
              className="admin-notification-button"
              onClick={() =>
                setNotificacionesAbiertas(
                  !notificacionesAbiertas
                )
              }
              title="Notificaciones"
            >

              <FaBell />

              {notificacionesNoLeidas > 0 && (
                <span className="admin-notification-count">
                  {notificacionesNoLeidas}
                </span>
              )}

            </button>

            <div className="admin-user-info">

              <div className="admin-user-avatar">

                {(usuarioActual.nombre ||
                  "A")
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <strong>
                  {usuarioActual.nombre ||
                    "Administrador"}
                </strong>

                <span>
                  Administrador
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              DROPDOWN DE NOTIFICACIONES
          ================================================= */}

          {notificacionesAbiertas && (

            <div className="admin-notification-dropdown">

              <div className="admin-notification-dropdown-header">

                <div>

                  <strong>
                    Notificaciones
                  </strong>

                  <span>
                    {notificacionesNoLeidas}{" "}
                    sin leer
                  </span>

                </div>

                {notificaciones.length > 0 && (

                  <button
                    onClick={
                      marcarTodasLeidas
                    }
                  >
                    Limpiar
                  </button>

                )}

              </div>

              {notificaciones.length === 0 ? (

                <p className="admin-dropdown-empty">
                  No hay notificaciones.
                </p>

              ) : (

                notificaciones
                  .slice(0, 5)
                  .map(
                    (notificacion) => (

                      <div
                        key={
                          notificacion.id
                        }
                        className="admin-dropdown-notification unread"
                        onClick={() =>
                          marcarNotificacionLeida(
                            notificacion.id
                          )
                        }
                        title="Haz clic para eliminar esta notificaciÃ³n"
                      >

                        <div className="dropdown-notification-icon">
                          <FaBell />
                        </div>

                        <div>

                          <strong>
                            {
                              notificacion.titulo
                            }
                          </strong>

                          <p>
                            {
                              notificacion.mensaje
                            }
                          </p>

                          <small>
                            {
                              notificacion.fecha
                            }
                          </small>

                        </div>

                      </div>

                    )
                  )

              )}

              {notificaciones.length > 5 && (

                <button
                  className="view-all-notifications"
                  onClick={() =>
                    cambiarSeccion(
                      "notificaciones"
                    )
                  }
                >
                  Ver todas las notificaciones
                </button>

              )}

            </div>

          )}

        </header>

        <div className="admin-content">
          {renderContenido()}
        </div>

      </main>

      {/* =====================================================
          MODAL CREAR USUARIO
      ===================================================== */}

      {mostrarCrearUsuario && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>

                <span>AdministraciÃ³n</span>

                <h2>
                  Crear usuario
                </h2>

                <p>
                  Registra un nuevo usuario
                  en SmartReserve.
                </p>

              </div>

              <button
                className="admin-modal-close"
                onClick={
                  cerrarCrearUsuario
                }
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={crearUsuario}>

              <div className="admin-modal-body">

                <div className="admin-form-group">

                  <label>
                    Nombre de usuario
                  </label>

                  <input
                    type="text"
                    placeholder="Ingresa el nombre de usuario"
                    value={
                      nuevoUsuario
                    }
                    onChange={(e) =>
                      setNuevoUsuario(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="admin-form-row">

                  <div className="admin-form-group">

                    <label>
                      ContraseÃƒÂ±a
                    </label>

                    <input
                      type="password"
                      placeholder="Ingresa la contraseÃƒÂ±a"
                      value={
                        nuevaClave
                      }
                      onChange={(e) =>
                        setNuevaClave(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Confirmar contraseÃƒÂ±a
                    </label>

                    <input
                      type="password"
                      placeholder="Confirma la contraseÃƒÂ±a"
                      value={
                        confirmarClave
                      }
                      onChange={(e) =>
                        setConfirmarClave(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

                <div className="admin-form-group">

                  <label>
                    Tipo de usuario
                  </label>

                  <select
                    value={
                      nuevoTipoUsuario
                    }
                    onChange={(e) =>
                      setNuevoTipoUsuario(
                        e.target.value
                      )
                    }
                  >

                    <option value="usuario">
                      Usuario
                    </option>

                    <option value="admin">
                      Administrador
                    </option>

                  </select>

                </div>

                <div className="admin-security-section">

                  <div className="admin-security-title">

                    <div className="security-icon">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <strong>
                        Seguridad de la cuenta
                      </strong>

                      <span>
                        Estos datos serÃ¡n
                        utilizados para
                        recuperar la
                        contraseÃƒÂ±a.
                      </span>

                    </div>

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Pregunta de seguridad
                    </label>

                    <select
                      value={
                        nuevaPreguntaSeguridad
                      }
                      onChange={(e) =>
                        setNuevaPreguntaSeguridad(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Selecciona una pregunta
                      </option>

                      {preguntasSeguridad.map(
                        (pregunta) => (

                          <option
                            key={
                              pregunta
                            }
                            value={
                              pregunta
                            }
                          >
                            {pregunta}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Respuesta de seguridad
                    </label>

                    <input
                      type="text"
                      placeholder="Escribe la respuesta"
                      value={
                        nuevaRespuestaSeguridad
                      }
                      onChange={(e) =>
                        setNuevaRespuestaSeguridad(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    cerrarCrearUsuario
                  }
                  disabled={
                    creandoUsuario
                  }
                >
                  <FaTimes />
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    creandoUsuario
                  }
                >

                  <FaSave />

                  {creandoUsuario
                    ? "Creando..."
                    : "Crear usuario"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL EDITAR USUARIO
      ===================================================== */}

      {mostrarEditarUsuario &&
        usuarioEditando && (

          <div className="admin-modal-overlay">

            <div className="admin-modal">

              <div className="admin-modal-header">

                <div>

                  <span>AdministraciÃ³n</span>

                  <h2>
                    Editar usuario
                  </h2>

                  <p>
                    Modifica la informaciÃ³n
                    del usuario.
                  </p>

                </div>

                <button
                  className="admin-modal-close"
                  onClick={
                    cerrarEditarUsuario
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form onSubmit={guardarUsuario}>

                <div className="admin-modal-body">

                  <div className="admin-edit-user-preview">

                    <div className="admin-user-avatar large">

                      {(usuarioEditando.nombre ||
                        "U")
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <strong>
                        {usuarioEditando.nombre}
                      </strong>

                      <span>
                        ID #{usuarioEditando.id}
                      </span>

                    </div>

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Nombre de usuario
                    </label>

                    <input
                      type="text"
                      value={
                        nombreEditando
                      }
                      onChange={(e) =>
                        setNombreEditando(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Tipo de usuario
                    </label>

                    <select
                      value={
                        rolEditando
                      }
                      onChange={(e) =>
                        setRolEditando(
                          e.target.value
                        )
                      }
                    >

                      <option value="usuario">
                        Usuario
                      </option>

                      <option value="admin">
                        Administrador
                      </option>

                    </select>

                  </div>

                </div>

                <div className="admin-modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      cerrarEditarUsuario
                    }
                    disabled={
                      guardandoUsuario
                    }
                  >
                    <FaTimes />
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={
                      guardandoUsuario
                    }
                  >

                    <FaSave />

                    {guardandoUsuario
                      ? "Guardando..."
                      : "Guardar cambios"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      {/* =====================================================
          MODAL CREAR RESERVA
      ===================================================== */}

      {mostrarCrearReserva && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>

                <span>AdministraciÃ³n</span>

                <h2>
                  Nueva reserva
                </h2>

                <p>
                  Reserva un espacio desde
                  el panel administrativo.
                </p>

              </div>

              <button
                className="admin-modal-close"
                onClick={
                  cerrarCrearReserva
                }
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={crearReserva}>

              <div className="admin-modal-body">

                <div className="admin-form-group">

                  <label>
                    Administrador
                  </label>

                  <input
                    type="text"
                    value={
                      usuarioActual.nombre ||
                      "Administrador"
                    }
                    disabled
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Sala
                  </label>

                  <select
                    name="sala"
                    value={
                      nuevaReserva.sala
                    }
                    onChange={
                      cambiarCampoReserva
                    }
                    required
                  >

                    <option value="">
                      Selecciona una sala
                    </option>

                    <option value="Sala de Reuniones">
                      Sala de Reuniones
                    </option>

                    <option value="Sala Ejecutiva">
                      Sala Ejecutiva
                    </option>

                    <option value="Auditorio">
                      Auditorio
                    </option>

                    <option value="Sala de Conferencias">
                      Sala de Conferencias
                    </option>

                  </select>

                </div>

                <div className="admin-form-group">

                  <label>
                    Fecha
                  </label>

                  <input
                    type="date"
                    name="fecha"
                    value={
                      nuevaReserva.fecha
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={
                      cambiarCampoReserva
                    }
                    required
                  />

                </div>

                <div className="admin-form-row">

                  <div className="admin-form-group">

                    <label>
                      Hora de inicio
                    </label>

                    <input
                      type="time"
                      name="horaInicio"
                      value={
                        nuevaReserva.horaInicio
                      }
                      onChange={
                        cambiarCampoReserva
                      }
                      required
                    />

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Hora de finalizaciÃ³n
                    </label>

                    <input
                      type="time"
                      name="horaFin"
                      value={
                        nuevaReserva.horaFin
                      }
                      onChange={
                        cambiarCampoReserva
                      }
                      required
                    />

                  </div>

                </div>

                <div className="admin-reservation-info">

                  <div className="reservation-info-icon">
                    <FaCalendarAlt />
                  </div>

                  <div>

                    <strong>
                      VerificaciÃ³n automÃ¡tica
                    </strong>

                    <span>
                      El sistema verificarÃ¡
                      automÃ¡ticamente que
                      la sala no estÃ© ocupada
                      en ese horario.
                    </span>

                  </div>

                </div>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    cerrarCrearReserva
                  }
                  disabled={
                    creandoReserva
                  }
                >
                  <FaTimes />
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    creandoReserva
                  }
                >

                  <FaSave />

                  {creandoReserva
                    ? "Reservando..."
                    : "Crear reserva"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPanel;





