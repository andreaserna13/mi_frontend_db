import { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaSyncAlt,
  FaEdit,
  FaUserTimes,
  FaUserCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function UsuariosAdmin({ usuarioActual }) {
  const API =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3001";

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] =
    useState(false);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);

      const estado = mostrarInactivos
        ? "inactivo"
        : "activo";

      const res = await fetch(
        `${API}/api/usuario?estado=${estado}`
      );

      const data = await res.json();

      setUsuarios(data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [mostrarInactivos]);

  const cambiarEstado = async (usuario) => {
    const nuevoEstado = !usuario.estado;

    const confirmar = window.confirm(
      `¿Deseas ${
        nuevoEstado ? "activar" : "desactivar"
      } a ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `${API}/api/usuario/${usuario.id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.mensaje);

      if (!mostrarInactivos && !nuevoEstado) {
        setUsuarios((actuales) =>
          actuales.filter(
            (u) => u.id !== usuario.id
          )
        );
      } else if (
        mostrarInactivos &&
        nuevoEstado
      ) {
        setUsuarios((actuales) =>
          actuales.filter(
            (u) => u.id !== usuario.id
          )
        );
      } else {
        setUsuarios((actuales) =>
          actuales.map((u) =>
            u.id === usuario.id
              ? data.usuario
              : u
          )
        );
      }

      alert(data.mensaje);
    } catch (error) {
      alert(error.message);
    }
  };

  const cambiarRol = async (
    usuario,
    nuevoRol
  ) => {
    try {
      const res = await fetch(
        `${API}/api/usuario/${usuario.id}/rol`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            tipoUsuario: nuevoRol,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.mensaje);

      setUsuarios((actuales) =>
        actuales.map((u) =>
          u.id === usuario.id
            ? data.usuario
            : u
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <span>Administración</span>
          <h2>Usuarios</h2>
          <p>
            Gestiona los usuarios de
            SmartReserve.
          </p>
        </div>

        <div className="admin-section-buttons">
          <button
            className="secondary-button"
            onClick={cargarUsuarios}
          >
            <FaSyncAlt />
            Actualizar
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              setMostrarInactivos(
                !mostrarInactivos
              )
            }
          >
            {mostrarInactivos ? (
              <>
                <FaEyeSlash />
                Ver activos
              </>
            ) : (
              <>
                <FaEye />
                Ver inactivos
              </>
            )}
          </button>

          <button className="primary-button">
            <FaUserPlus />
            Nuevo usuario
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="admin-loading">
          Cargando...
        </p>
      ) : usuarios.length === 0 ? (
        <p className="admin-loading">
          No hay usuarios.
        </p>
      ) : (
        <div className="admin-table-container">
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
                  <td>#{usuario.id}</td>

                  <td>
                    <strong>
                      {usuario.nombre}
                    </strong>
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
                        usuario.estado
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {usuario.estado
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button className="table-action-button">
                        <FaEdit />
                        Editar
                      </button>

                      <button
                        className={`table-action-button ${
                          usuario.estado
                            ? "danger"
                            : "success"
                        }`}
                        onClick={() =>
                          cambiarEstado(
                            usuario
                          )
                        }
                      >
                        {usuario.estado ? (
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
        </div>
      )}
    </div>
  );
}