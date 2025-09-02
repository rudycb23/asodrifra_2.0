import React from "react";
import { FaChair, FaUtensils, FaRestroom } from "react-icons/fa";

const features = [
    { icon: <FaChair size={48} className="text-green-700 mb-2" aria-label="Sillas Plegables" />, label: "Sillas Plegables" },
    { icon: <FaUtensils size={48} className="text-green-700 mb-2" aria-label="Cocina Equipada" />, label: "Cocina Equipada" },
    { icon: <FaRestroom size={48} className="text-green-700 mb-2" aria-label="Baños Accesibles" />, label: "Baños Accesibles" },
];

const CaracteristicasSalon: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow my-8">
        <h2 className="text-success text-center font-bold mb-6 text-2xl">
            Características del Salón
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            {features.map((f, i) => (
                <div className="flex flex-col items-center flex-1" key={i}>
                    {f.icon}
                    <span className="font-semibold">{f.label}</span>
                </div>
            ))}
        </div>
    </div>
);

export default CaracteristicasSalon;
