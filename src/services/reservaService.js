import axios from "axios";

const API = "http://localhost:3001/api/reservas";

export const obtenerReservas = async () => {
    const response = await axios.get(API);
    return response.data;
};

export const crearReserva = async (reserva) => {
    const response = await axios.post(API, reserva);
    return response.data;
};

export const eliminarReserva = async (id) => {
    const response = await axios.delete(`${API}/${id}`);
    return response.data;
};