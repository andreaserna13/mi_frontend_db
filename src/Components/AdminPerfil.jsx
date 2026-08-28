import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

function AdminPerfil({ usuario }) {
  const [nombre, setNombre] = useState(
    usuario?.nombre || "Administrador"
  );

  const [mostrarActual, setMostrarActual] =
    useState(false);

  const [mostrarNueva, setMostrarNueva] =
    useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [claveActual, setClaveActual] =
    useState("");

  const [nuevaClave, setNuevaClave] =
    useState("");

  const [confirmarClave, setConfirmarClave] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  // =========================================================
  // ACTUALIZAR INFORMACIÃƒâ€œN DEL USUARIO
  // =========================================================

  useEffect(() => {
    setNombre(
      usuario?.nombre || "Administrador"
    );
  }, [usuario]);

  // =========================================================
  // VALIDACIÃƒâ€œN DE CONTRASEÃƒâ€˜A
  // =========================================================

  const coinciden =
    nuevaClave.length > 0 &&
    confirmarClave.length > 0 &&
    nuevaClave === confirmarClave;

  // =========================================================
  // GUARDAR CAMBIOS
  // =========================================================

  const guardarCambios = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    const nombreLimpio = nombre.trim();

    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (!nombreLimpio) {
      setError(
        "El nombre de usuario es obligatorio."
      );
      return;
    }

    // -------------------------------------------------------
    // DETECTAR CAMBIO DE CONTRASEÃƒâ€˜A
    // -------------------------------------------------------

    const quiereCambiarPassword =
      Boolean(
        claveActual ||
        nuevaClave ||
        confirmarClave
      );

    // -------------------------------------------------------
    // VALIDAR CONTRASEÃƒâ€˜A
    // -------------------------------------------------------

    if (quiereCambiarPassword) {

      if (!claveActual) {
        setError(
          "Ingresa tu contraseña actual."
        );
        return;
      }

      if (!nuevaClave) {
        setError(
          "Ingresa una nueva contraseña."
        );
        return;
      }

      if (!confirmarClave) {
        setError(
          "Confirma la nueva contraseña."
        );
        return;
      }

      if (nuevaClave !== confirmarClave) {
        setError(
          "Las nuevas contraseñas no coinciden."
        );
        return;
      }

      if (nuevaClave.length < 6) {
        setError(
          "La nueva contraseña debe tener al menos 6 caracteres."
        );
        return;
      }
    }

    try {
      setGuardando(true);

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:3001";

      // =====================================================
      // ACTUALIZAR NOMBRE
      // =====================================================

      if (
        nombreLimpio !==
        (usuario?.nombre || "")
      ) {

        const respuestaNombre =
          await fetch(
            `${API_BASE_URL}/usuario/${usuario?.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                nombre: nombreLimpio,
                tipoUsuario:
                  usuario?.tipoUsuario ||
                  "admin",
              }),
            }
          );

        let datosNombre = {};

        try {
          datosNombre =
            await respuestaNombre.json();
        } catch {
          datosNombre = {};
        }

        if (!respuestaNombre.ok) {
          throw new Error(
            datosNombre.mensaje ||
              "No fue posible actualizar el nombre."
          );
        }

        const usuarioActualizado = {
          ...usuario,
          nombre: nombreLimpio,
        };

        localStorage.setItem(
          "usuario",
          JSON.stringify(
            usuarioActualizado
          )
        );
      }

      // =====================================================
      // CAMBIAR CONTRASEÃƒâ€˜A
      // =====================================================

      if (quiereCambiarPassword) {

        const respuestaClave =
          await fetch(
            `${API_BASE_URL}/usuario/${usuario?.id}/password`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                claveActual,
                nuevaClave,
              }),
            }
          );

        let datosClave = {};

        try {
          datosClave =
            await respuestaClave.json();
        } catch {
          datosClave = {};
        }

        if (!respuestaClave.ok) {
          throw new Error(
            datosClave.mensaje ||
              "No fue posible cambiar la contraseña."
          );
        }

        setClaveActual("");
        setNuevaClave("");
        setConfirmarClave("");
        setMostrarActual(false);
        setMostrarNueva(false);
        setMostrarConfirmacion(false);
      }

      // =====================================================
      // MENSAJE DE Ãƒâ€°XITO
      // =====================================================

      setMensaje(
        "Los cambios fueron guardados correctamente."
      );

      // =====================================================
      // AVISAR AL RESTO DE LA APLICACIÃƒâ€œN
      // =====================================================

      window.dispatchEvent(
        new Event("usuarioActualizado")
      );

    } catch (error) {

      console.error(
        "Error actualizando perfil:",
        error
      );

      setError(
        error.message ||
          "No fue posible guardar los cambios."
      );

    } finally {

      setGuardando(false);
    }
  };

  // =========================================================
  // INICIAL DEL USUARIO
  // =========================================================

  const inicial =
    nombre?.trim()?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <div className="admin-profile-content">

      {/* =====================================================
          CABECERA DEL USUARIO
      ===================================================== */}

      <div className="admin-profile-user">

        <div className="admin-profile-avatar">
          {inicial}
        </div>

        <div className="admin-profile-user-info">

          <h3>
            {nombre || "Administrador"}
          </h3>

          <span>
            <FaShieldAlt />
            Administrador
          </span>

        </div>

      </div>

      <form
        onSubmit={guardarCambios}
        className="admin-profile-form"
      >

        {/* ===================================================
            INFORMACIÃƒâ€œN PERSONAL
        =================================================== */}

        <div className="admin-profile-block">

          <div className="admin-profile-block-title">

            <div className="admin-profile-block-icon">
              <FaUser />
            </div>

            <div>

              <strong>
                Información personal
              </strong>

              <span>
                Actualiza la información de tu cuenta administrativa.
              </span>

            </div>

          </div>

          <div className="admin-form-group">

            <label>
              Nombre de usuario
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Ingresa tu nombre"
              disabled={guardando}
            />

          </div>

        </div>

        {/* ===================================================
            CAMBIAR CONTRASEÃƒâ€˜A
        =================================================== */}

        <div className="admin-profile-block">

          <div className="admin-profile-block-title">

            <div className="admin-profile-block-icon password">
              <FaLock />
            </div>

            <div>

              <strong>
                Cambiar contraseña
              </strong>

              <span>
                Actualiza la contraseña de tu cuenta administrativa.
              </span>

            </div>

          </div>

          {/* =================================================
              CONTRASEÃƒâ€˜A ACTUAL
          ================================================= */}

          <div className="admin-form-group">

            <label>
              Contraseña actual
            </label>

            <div className="admin-password-wrapper">

              <input
                type={
                  mostrarActual
                    ? "text"
                    : "password"
                }
                value={claveActual}
                onChange={(e) =>
                  setClaveActual(
                    e.target.value
                  )
                }
                placeholder="Ingresa tu contraseña actual"
                disabled={guardando}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setMostrarActual(
                    !mostrarActual
                  )
                }
                tabIndex="-1"
                aria-label={
                  mostrarActual
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarActual ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              NUEVA CONTRASEÃƒâ€˜A
          ================================================= */}

          <div className="admin-form-group">

            <label>
              Nueva contraseña
            </label>

            <div className="admin-password-wrapper">

              <input
                type={
                  mostrarNueva
                    ? "text"
                    : "password"
                }
                value={nuevaClave}
                onChange={(e) =>
                  setNuevaClave(
                    e.target.value
                  )
                }
                placeholder="Ingresa una nueva contraseña"
                disabled={guardando}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setMostrarNueva(
                    !mostrarNueva
                  )
                }
                tabIndex="-1"
                aria-label={
                  mostrarNueva
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarNueva ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              CONFIRMAR CONTRASEÃƒâ€˜A
          ================================================= */}

          <div className="admin-form-group">

            <label>
              Confirmar nueva contraseña
            </label>

            <div className="admin-password-wrapper">

              <input
                type={
                  mostrarConfirmacion
                    ? "text"
                    : "password"
                }
                value={confirmarClave}
                onChange={(e) =>
                  setConfirmarClave(
                    e.target.value
                  )
                }
                placeholder="Confirma tu nueva contraseña"
                disabled={guardando}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setMostrarConfirmacion(
                    !mostrarConfirmacion
                  )
                }
                tabIndex="-1"
                aria-label={
                  mostrarConfirmacion
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarConfirmacion ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              VALIDACIÃƒâ€œN
          ================================================= */}

          {nuevaClave &&
            confirmarClave && (
              <div
                className={
                  coinciden
                    ? "admin-password-match success"
                    : "admin-password-match error"
                }
              >

                {coinciden ? (
                  <>
                    <FaCheckCircle />
                    Las contraseñas coinciden
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle />
                    Las contraseñas no coinciden
                  </>
                )}

              </div>
            )}

        </div>

        {/* ===================================================
            MENSAJE DE ERROR
        =================================================== */}

        {error && (
          <div className="admin-profile-message error">

            <FaExclamationTriangle />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* ===================================================
            MENSAJE DE Ãƒâ€°XITO
        =================================================== */}

        {mensaje && (
          <div className="admin-profile-message success">

            <FaCheckCircle />

            <span>
              {mensaje}
            </span>

          </div>
        )}

        {/* ===================================================
            BOTÃƒâ€œN
        =================================================== */}

        <div className="admin-profile-actions">

          <button
            type="submit"
            className="primary-button admin-profile-save"
            disabled={guardando}
          >

            {guardando ? (
              <>
                <FaSave />
                Guardando...
              </>
            ) : (
              <>
                <FaSave />
                Guardar cambios
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminPerfil;

