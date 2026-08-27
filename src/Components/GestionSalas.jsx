import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaMapMarkerAlt,
  FaBuilding,
  FaTimes,
  FaSave,
  FaSyncAlt,
} from "react-icons/fa";

const GestionSalas = ({ agregarNotificacion }) => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // =========================================================
  // ESTADOS
  // =========================================================

  const [salas, setSalas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [mensaje, setMensaje] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [salaEditando, setSalaEditando] = useState(null);

  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    capacidad: "",
    ubicacion: "",
    descripcion: "",
  });

  // =========================================================
  // CARGAR SALAS
  // =========================================================

  const cargarSalas = async () => {
    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(
        `${API_BASE_URL}/api/salas`
      );

      if (!respuesta.ok) {
        throw new Error(
          "No fue posible obtener las salas."
        );
      }

      const datos = await respuesta.json();

      setSalas(Array.isArray(datos) ? datos : []);

    } catch (error) {
      console.error(
        "Error cargando salas:",
        error
      );

      setError(
        "No fue posible cargar las salas. Verifica que el servidor esté funcionando."
      );

    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // CARGAR AL INICIAR
  // =========================================================

  useEffect(() => {
    cargarSalas();
  }, []);

  // =========================================================
  // CAMBIAR FORMULARIO
  // =========================================================

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // =========================================================
  // ABRIR NUEVA SALA
  // =========================================================

  const abrirNuevaSala = () => {
    setModoEdicion(false);
    setSalaEditando(null);

    setFormulario({
      nombre: "",
      capacidad: "",
      ubicacion: "",
      descripcion: "",
    });

    setError("");
    setMensaje("");

    setMostrarFormulario(true);
  };

  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEditarSala = (sala) => {
    setModoEdicion(true);
    setSalaEditando(sala);

    setFormulario({
      nombre: sala.nombre || "",
      capacidad: sala.capacidad || "",
      ubicacion: sala.ubicacion || "",
      descripcion: sala.descripcion || "",
    });

    setError("");
    setMensaje("");

    setMostrarFormulario(true);
  };

  // =========================================================
  // CERRAR FORMULARIO
  // =========================================================

  const cerrarFormulario = () => {
    if (guardando) return;

    setMostrarFormulario(false);
    setModoEdicion(false);
    setSalaEditando(null);

    setFormulario({
      nombre: "",
      capacidad: "",
      ubicacion: "",
      descripcion: "",
    });
  };

  // =========================================================
  // GUARDAR SALA
  // =========================================================

  const guardarSala = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    const nombre = formulario.nombre.trim();

    const capacidad = Number(
      formulario.capacidad
    );

    if (!nombre) {
      setError(
        "El nombre de la sala es obligatorio."
      );
      return;
    }

    if (
      !Number.isInteger(capacidad) ||
      capacidad < 1
    ) {
      setError(
        "La capacidad debe ser un número mayor que 0."
      );
      return;
    }

    try {
      setGuardando(true);

      const url = modoEdicion
        ? `${API_BASE_URL}/api/salas/${salaEditando.id}`
        : `${API_BASE_URL}/api/salas`;

      const metodo = modoEdicion
        ? "PUT"
        : "POST";

      const respuesta = await fetch(url, {
        method: metodo,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nombre,
          capacidad,
          ubicacion:
            formulario.ubicacion.trim(),
          descripcion:
            formulario.descripcion.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible guardar la sala."
        );
      }

      if (modoEdicion) {
        setMensaje(
          "Sala actualizada correctamente."
        );

        if (agregarNotificacion) {
          agregarNotificacion({
            titulo: "Sala actualizada",
            mensaje: `La sala "${nombre}" fue actualizada correctamente.`,
          });
        }
      } else {
        setMensaje(
          "Sala creada correctamente."
        );

        if (agregarNotificacion) {
          agregarNotificacion({
            titulo: "Nueva sala",
            mensaje: `Se creó la sala "${nombre}" correctamente.`,
          });
        }
      }

      await cargarSalas();

      setMostrarFormulario(false);

      setModoEdicion(false);

      setSalaEditando(null);

      setFormulario({
        nombre: "",
        capacidad: "",
        ubicacion: "",
        descripcion: "",
      });

    } catch (error) {
      console.error(
        "Error guardando sala:",
        error
      );

      setError(
        error.message ||
          "No fue posible guardar la sala."
      );

    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const cambiarEstado = async (sala) => {
    const accion = sala.estado
      ? "desactivar"
      : "activar";

    const confirmado = window.confirm(
      `¿Deseas ${accion} la sala "${sala.nombre}"?`
    );

    if (!confirmado) return;

    try {
      setError("");
      setMensaje("");

      const respuesta = await fetch(
        `${API_BASE_URL}/api/salas/${sala.id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No fue posible cambiar el estado."
        );
      }

      setMensaje(
        sala.estado
          ? "Sala desactivada correctamente."
          : "Sala activada correctamente."
      );

      if (agregarNotificacion) {
        agregarNotificacion({
          titulo: sala.estado
            ? "Sala desactivada"
            : "Sala activada",
          mensaje: `La sala "${sala.nombre}" fue ${
            sala.estado
              ? "desactivada"
              : "activada"
          }.`,
        });
      }

      await cargarSalas();

    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );

      setError(
        error.message ||
          "No fue posible cambiar el estado de la sala."
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
      }}
    >

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >

        <div>
          <h2
            style={{
              margin: 0,
              color: "#1e293b",
              fontSize: "25px",
            }}
          >
            Gestión de salas y espacios
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Administra las salas disponibles
            para las reservas de SmartReserve.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button
            type="button"
            onClick={cargarSalas}
            disabled={cargando}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "9px",
              background: "#fff",
              color: "#475569",
              cursor: cargando
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
            }}
          >
            <FaSyncAlt
              style={{
                transform: cargando
                  ? "rotate(180deg)"
                  : "none",
              }}
            />

            Actualizar
          </button>

          <button
            type="button"
            onClick={abrirNuevaSala}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              border: "none",
              borderRadius: "9px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            <FaPlus />

            Nueva sala
          </button>

        </div>

      </div>

      {/* =====================================================
          MENSAJES
      ===================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 15px",
            borderRadius: "9px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {mensaje && !error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 15px",
            borderRadius: "9px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontSize: "14px",
          }}
        >
          {mensaje}
        </div>
      )}

      {/* =====================================================
          FORMULARIO
      ===================================================== */}

      {mostrarFormulario && (
        <div
          style={{
            marginBottom: "25px",
            padding: "22px",
            borderRadius: "14px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 8px 25px rgba(15, 23, 42, 0.08)",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >

            <h3
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "19px",
              }}
            >
              {modoEdicion
                ? "Editar sala"
                : "Nueva sala"}
            </h3>

            <button
              type="button"
              onClick={cerrarFormulario}
              disabled={guardando}
              style={{
                width: "34px",
                height: "34px",
                border: "none",
                borderRadius: "8px",
                background: "#f1f5f9",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaTimes />
            </button>

          </div>

          <form onSubmit={guardarSala}>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "15px",
              }}
            >

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#334155",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Nombre de la sala
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej. Sala de Reuniones"
                  required
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 12px",
                    boxSizing: "border-box",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#334155",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Capacidad
                </label>

                <input
                  type="number"
                  name="capacidad"
                  value={formulario.capacidad}
                  onChange={manejarCambio}
                  min="1"
                  placeholder="Ej. 10"
                  required
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 12px",
                    boxSizing: "border-box",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#334155",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Ubicación
                </label>

                <input
                  type="text"
                  name="ubicacion"
                  value={formulario.ubicacion}
                  onChange={manejarCambio}
                  placeholder="Ej. Piso 2"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 12px",
                    boxSizing: "border-box",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#334155",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Descripción
                </label>

                <input
                  type="text"
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                  placeholder="Características de la sala"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 12px",
                    boxSizing: "border-box",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                type="button"
                onClick={cerrarFormulario}
                disabled={guardando}
                style={{
                  padding: "10px 18px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#475569",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: guardando
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "700",
                }}
              >
                <FaSave />

                {guardando
                  ? "Guardando..."
                  : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar sala"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================================
          CARGANDO
      ===================================================== */}

      {cargando ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Cargando salas...
        </div>
      ) : salas.length === 0 ? (

        <div
          style={{
            padding: "45px 20px",
            textAlign: "center",
            background: "#fff",
            border:
              "1px solid #e2e8f0",
            borderRadius: "14px",
          }}
        >

          <FaBuilding
            style={{
              fontSize: "38px",
              color: "#94a3b8",
              marginBottom: "12px",
            }}
          />

          <h3
            style={{
              margin: "0 0 7px",
              color: "#334155",
            }}
          >
            No hay salas registradas
          </h3>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Crea la primera sala para comenzar.
          </p>

        </div>

      ) : (

        /* =====================================================
           LISTADO
        ===================================================== */

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >

          {salas.map((sala) => (

            <div
              key={sala.id}
              style={{
                background: "#fff",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "20px",
                boxShadow:
                  "0 5px 18px rgba(15, 23, 42, 0.06)",
                opacity: sala.estado
                  ? 1
                  : 0.72,
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaBuilding />
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "#1e293b",
                        fontSize: "17px",
                      }}
                    >
                      {sala.nombre}
                    </h3>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        padding: "3px 8px",
                        borderRadius: "20px",
                        background: sala.estado
                          ? "#dcfce7"
                          : "#f1f5f9",
                        color: sala.estado
                          ? "#166534"
                          : "#64748b",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {sala.estado
                        ? "ACTIVA"
                        : "INACTIVA"}
                    </span>
                  </div>

                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  color: "#475569",
                  fontSize: "14px",
                  marginBottom: "18px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaUsers />

                  <span>
                    Capacidad:{" "}
                    <strong>
                      {sala.capacidad}
                    </strong>{" "}
                    personas
                  </span>
                </div>

                {sala.ubicacion && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaMapMarkerAlt />

                    <span>
                      {sala.ubicacion}
                    </span>
                  </div>
                )}

                {sala.descripcion && (
                  <div
                    style={{
                      color: "#64748b",
                      lineHeight: "1.5",
                    }}
                  >
                    {sala.descripcion}
                  </div>
                )}

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  borderTop:
                    "1px solid #e2e8f0",
                  paddingTop: "14px",
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    abrirEditarSala(sala)
                  }
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    padding: "9px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#475569",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <FaEdit />

                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    cambiarEstado(sala)
                  }
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    padding: "9px",
                    border: "none",
                    borderRadius: "8px",
                    background: sala.estado
                      ? "#fef2f2"
                      : "#f0fdf4",
                    color: sala.estado
                      ? "#b91c1c"
                      : "#166534",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {sala.estado ? (
                    <FaToggleOff />
                  ) : (
                    <FaToggleOn />
                  )}

                  {sala.estado
                    ? "Desactivar"
                    : "Activar"}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default GestionSalas;