import React, { useState } from "react";

const reservas = {
  conferencia: [
    { fecha: "2025-04-10", hora: "10:00" },
    { fecha: "2025-04-12", hora: "14:00" },
  ],
  reunion: [
    { fecha: "2025-04-11", hora: "09:00" },
  ],
  evento: [
    { fecha: "2025-04-10", hora: "16:00" },
  ],
};

const ReservaForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    sala: "",
    comentarios: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const verificarDisponibilidad = (e) => {
    e.preventDefault();
    const { sala, fecha, hora } = form;
    const reserva = reservas[sala]?.find((r) => r.fecha === fecha && r.hora === hora);

    if (reserva) {
      setErrorMessage(`La sala ${sala} está ocupada en la fecha ${fecha} a las ${hora}.`);
    } else {
      setErrorMessage("");
      alert("Reserva confirmada.");
      reservas[sala]?.push({ fecha, hora });
    }
  };

  return (
    <div className="accordion">
      <div className="accordion-header">➤ Reserva de Sala</div>
      <div className="accordion-content">
        <form onSubmit={verificarDisponibilidad}>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required />
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
          <select name="sala" value={form.sala} onChange={handleChange} required>
            <option value="">Selecciona una sala</option>
            <option value="conferencia">Sala de Conferencias</option>
            <option value="reunion">Sala de Reuniones</option>
            <option value="evento">Auditorio</option>
          </select>
          <textarea name="comentarios" value={form.comentarios} onChange={handleChange} rows="4" placeholder="Comentarios adicionales"></textarea>
          <button type="submit">Confirmar Reserva</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default ReservaForm;


