import React, { useState } from "react";

const CancelarReserva = () => {
  const [mensaje, setMensaje] = useState("");

  const handleCancelar = (e) => {
    e.preventDefault();
    setMensaje("La reserva ha sido cancelada exitosamente.");
  };

  return (
    <div className="accordion">
      <div className="accordion-header">➤ Cancelar Reserva</div>
      <div className="accordion-content">
        <form onSubmit={handleCancelar}>
          <input type="date" name="fecha" required />
          <input type="time" name="hora" required />
          <button type="submit">Cancelar Reserva</button>
        </form>
        {mensaje && <p style={{ color: "green", marginTop: "10px" }}>{mensaje}</p>}
      </div>
    </div>
  );
};

export default CancelarReserva;


