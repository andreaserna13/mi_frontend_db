import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3001/api";

const API = `${API_BASE_URL}/reservas`;

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