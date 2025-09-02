import { FaWhatsapp } from "react-icons/fa";

const ConfirmacionWhatsapp = () => (
    <div className="flex-1 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
        <a
            href="https://wa.me/50687616802"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
        >
            <FaWhatsapp size={54} className="text-green-500 mb-3" />
        </a>
        <p className="font-semibold text-center text-gray-700">
            Toca el ícono para confirmar tu reserva vía WhatsApp
        </p>
    </div>
);

export default ConfirmacionWhatsapp;
