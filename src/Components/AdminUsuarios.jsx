import React, { useState } from "react";
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaSearch,
  FaUserShield,
  FaUser,
  FaSync,
} from "react-icons/fa";

const API_URL = "http://localhost:3001/api";

function AdminUsuarios({
  usuarios,
  loading,
  recargarUsuarios,
  agregarNotificacion,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState(null);

  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    clave: "",
    tipoUsuario: "usuario",
    preguntaSeguridad:
      "¿Cuál es el nombre de tu mascota?",
    respuestaSeguridad: "",
  });

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const abrirCrear = () => {
    setModoEdicion(false);
    setUsuarioSeleccionado(null);

    setFormulario({
      nombre: "",
      clave: "",
      tipoUsuario: "usuario",
      preguntaSeguridad:
        "¿Cuál es el nombre de tu mascota?",
      respuestaSeguridad: "",
    });

    setMostrarModal(true);
  };

  const abrirEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);

    setFormulario({
      nombre: usuario.nombre || "",
      clave: "",
      tipoUsuario:
        usuario.tipoUsuario || "usuario",
      preguntaSeguridad:
        "¿Cuál es el nombre de tu mascota?",
      respuestaSeguridad: "",
    });

    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;

    setMostrarModal(false);
    setUsuarioSeleccionado(null);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) {
      alert("El nombre de usuario es obligatorio.");
      return;
    }

    setGuardando(true);

    try {
      let response;

      if (modoEdicion) {
        response = await fetch(
          `${API_URL}/usuario/${usuarioSeleccionado.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: formulario.nombre.trim(),
              tipoUsuario: formulario.tipoUsuario,
            }),
          }
        );
      } else {
        if (!formulario.clave) {
          alert("La contraseña es obligatoria.");
          setGuardando(false);
          return;
        }

        if (!formulario.respuestaSeguridad.trim()) {
          alert(
            "La respuesta de seguridad es obligatoria."
          );
          setGuardando(false);
          return;
        }

        response = await fetch(
          `${API_URL}/usuario`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: formulario.nombre.trim(),
              clave: formulario.clave,
              tipoUsuario:
                formulario.tipoUsuario,
              preguntaSeguridad:
                formulario.preguntaSeguridad,
              respuestaSeguridad:
                formulario.respuestaSeguridad,
            }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No fue posible guardar el usuario."
        );
      }

      agregarNotificacion({
        tipo: "usuario",
        titulo: modoEdicion
          ? "Usuario actualizado"
          : "Usuario creado",
        mensaje:
          data.mensaje ||
          "La operación se realizó correctamente.",
      });

      setMostrarModal(false);

      await recargarUsuarios();
    } catch (error) {
      console.error(error);

      agregarNotificacion({
        tipo: "error",
        titulo: "Error",
        mensaje: error.message,
      });

      alert(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (usuario) => {
    const activo =
      usuario.estado === true ||
      usuario.estado === 1 ||
      usuario.estado === "activo";

    const confirmar = window.confirm(
      `¿Deseas ${
        activo ? "desactivar" : "activar"
      } a ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `${API_URL}/usuario/${usuario.id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: !activo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No fue posible cambiar el estado."
        );
      }

      agregarNotificacion({
        tipo: "usuario",
        titulo: activo
          ? "Usuario desactivado"
          : "Usuario activado",
        mensaje:
          data.mensaje ||
          `Estado actualizado para ${usuario.nombre}.`,
      });

      await recargarUsuarios();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const cambiarRol = async (usuario, nuevoRol) => {
    if (usuario.tipoUsuario === nuevoRol) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/usuario/${usuario.id}/rol`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
            "No fue posible cambiar el rol."
        );
      }

      agregarNotificacion({
        tipo: "usuario",
        titulo: "Rol actualizado",
        mensaje:
          data.mensaje ||
          `El rol de ${usuario.nombre} fue actualizado.`,
      });

      await recargarUsuarios();
    } catch (error) {
      console.error(error);
      alert(error.message);

      await recargarUsuarios();
    }
  };

  const usuarioActivo = (usuario) =>
    usuario.estado === true ||
    usuario.estado === 1 ||
    usuario.estado === "activo";

  return (
    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <span>ADMINISTRACIÓN</span>

          <h2>Usuarios</h2>

          <p>
            Administra las cuentas, roles y estados
            de los usuarios de SmartReserve.
          </p>
        </div>

        <div className="admin-section-buttons">

          <button
            className="secondary-button"
            onClick={recargarUsuarios}
            disabled={loading}
          >
            <FaSync />
            Actualizar
          </button>

          <button
            className="primary-button"
            onClick={abrirCrear}
          >
            <FaPlus />
            Nuevo usuario
          </button>

        </div>

      </div>

      <div className="admin-users-toolbar">

        <div className="admin-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <div className="admin-toolbar-count">
          <FaUsers />
          {usuariosFiltrados.length} usuarios
        </div>

      </div>

      {loading ? (
        <div className="admin-loading">
          Cargando usuarios...
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="admin-empty-card">
          <FaUsers />
          <h3>No hay usuarios</h3>
          <p>
            No se encontraron usuarios con ese criterio.
          </p>
        </div>
      ) : (
        <div className="admin-table-container">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>ID</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>

                  <td>
                    <div className="admin-table-user">

                      <div className="admin-table-avatar">
                        {usuario.nombre
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <strong>
                        {usuario.nombre}
                      </strong>

                    </div>
                  </td>

                  <td>

                    <select
                      className="admin-role-select"
                      value={
                        usuario.tipoUsuario ||
                        "usuario"
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
                        usuarioActivo(usuario)
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {usuarioActivo(usuario)
                        ? "Activo"
                        : "Inactivo"}
                    </span>

                  </td>

                  <td>
                    #{usuario.id}
                  </td>

                  <td>

                    <div className="table-actions">

                      <button
                        className="table-action-button"
                        onClick={() =>
                          abrirEditar(usuario)
                        }
                      >
                        <FaEdit />
                        Editar
                      </button>

                      <button
                        className={`table-action-button ${
                          usuarioActivo(usuario)
                            ? "danger"
                            : "success"
                        }`}
                        onClick={() =>
                          cambiarEstado(usuario)
                        }
                      >
                        <FaPowerOff />

                        {usuarioActivo(usuario)
                          ? "Desactivar"
                          : "Activar"}
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

      {mostrarModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModal();
            }
          }}
        >

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-modal-kicker">
                  {modoEdicion
                    ? "EDITAR"
                    : "NUEVO"}
                </span>

                <h3>
                  {modoEdicion
                    ? "Editar usuario"
                    : "Crear usuario"}
                </h3>
              </div>

              <button
                className="admin-modal-close"
                onClick={cerrarModal}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={guardarUsuario}
              className="admin-modal-form"
            >

              <div className="admin-form-group">

                <label>
                  Nombre de usuario
                </label>

                <input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Nombre completo"
                  required
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Tipo de usuario
                </label>

                <select
                  name="tipoUsuario"
                  value={
                    formulario.tipoUsuario
                  }
                  onChange={manejarCambio}
                >
                  <option value="usuario">
                    Usuario
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>

              </div>

              {!modoEdicion && (
                <>
                  <div className="admin-form-group">

                    <label>
                      Contraseña
                    </label>

                    <input
                      type="password"
                      name="clave"
                      value={formulario.clave}
                      onChange={manejarCambio}
                      placeholder="Contraseña"
                      required
                    />

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Pregunta de seguridad
                    </label>

                    <input
                      name="preguntaSeguridad"
                      value={
                        formulario.preguntaSeguridad
                      }
                      onChange={manejarCambio}
                    />

                  </div>

                  <div className="admin-form-group">

                    <label>
                      Respuesta de seguridad
                    </label>

                    <input
                      name="respuestaSeguridad"
                      value={
                        formulario.respuestaSeguridad
                      }
                      onChange={manejarCambio}
                      placeholder="Respuesta"
                      required
                    />

                  </div>
                </>
              )}

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={cerrarModal}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : modoEdicion
                    ? "Guardar cambios"
                    : "Crear usuario"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminUsuarios;
