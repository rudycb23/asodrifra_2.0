import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const items = [
    {
        title: "Servicios Opcionales",
        content: (
            <ul className="list-disc ml-6">
                <li>Alquiler de Coffee Maker</li>
                <li>Alquiler de manteles y cubremanteles</li>
                <li>Equipo audiovisual (micrófonos, proyectores)</li>
            </ul>
        ),
    },
    {
        title: "Términos y Condiciones",
        content: (
            <ul className="list-disc ml-6">
                <li>El salón debe ser devuelto limpio y en las mismas condiciones.</li>
                <li>Está prohibido fumar dentro de las instalaciones.</li>
                <li>El depósito no es reembolsable en caso de daños o cancelaciones tardías.</li>
                <li>El horario máximo permitido es hasta las 10:00 PM.</li>
                <li>El cliente es responsable de cualquier daño causado durante el uso del salón.</li>
            </ul>
        ),
    },
];

const InfoFinal: React.FC = () => {
    const [open, setOpen] = useState<number | null>(null);

    const toggle = (idx: number) => setOpen(open === idx ? null : idx);

    return (
        <div className="bg-white p-6 rounded-lg shadow my-8">
            <h2 className="text-success text-center font-bold mb-4 text-2xl">
                Más Información
            </h2>
            <div>
                {items.map((item, idx) => (
                    <div key={item.title} className="mb-3 border-b last:border-none">
                        <button
                            className="w-full flex items-center justify-between py-3 text-left font-semibold text-green-700 hover:text-green-900 transition"
                            onClick={() => toggle(idx)}
                            aria-expanded={open === idx}
                        >
                            <span>{item.title}</span>
                            {open === idx ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'max-h-96 py-2' : 'max-h-0'}`}
                        >
                            {open === idx && <div className="text-gray-700">{item.content}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoFinal;
