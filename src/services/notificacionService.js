import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const obtenerNotificaciones = async () => {

    const respuesta = await axios.get(
        `${API}/api/reservas`
    );

    return respuesta.data;

};