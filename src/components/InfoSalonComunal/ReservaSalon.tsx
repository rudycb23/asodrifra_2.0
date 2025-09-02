import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../components/global/utils/FadeIn"; // Ajusta el path si es necesario

interface Props {
    imagen: string;
    onImgClick: () => void;
}

const ReservaSalon: React.FC<Props> = ({ imagen, onImgClick }) => {
    const navigate = useNavigate();

    return (
        <FadeIn>
            <div className="md:w-96 flex-shrink-0 bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <h4 className="text-green-700 font-bold mb-3">Reserva del Salón</h4>
                <img
                    src={imagen}
                    alt="Vista previa del salón comunal para reserva"
                    className="rounded shadow mb-4 cursor-pointer object-cover w-full h-52"
                    onClick={onImgClick}
                    tabIndex={0}
                />
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition flex items-center gap-2 w-full font-semibold"
                    onClick={() => navigate("/reserva-salon")}
                    tabIndex={0}
                >
                    <FaCalendarAlt /> Reservar Ahora
                </button>
            </div>
        </FadeIn>
    );
};

export default ReservaSalon;
