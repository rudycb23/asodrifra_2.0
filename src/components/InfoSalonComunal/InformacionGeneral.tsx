import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const InformacionGeneral: React.FC = () => (
  <div className="flex-1 bg-white p-6 rounded-lg shadow">
    <h2 className="text-green-700 font-bold text-2xl mb-3">Información del Salón</h2>
    <p>
      <strong>El Salón Comunal de San Francisco ofrece un espacio versátil y seguro, ideal para actividades como:</strong>
    </p>
    <ul className="mt-2 space-y-1">
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Fiestas de cumpleaños</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Quinceaños</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Reuniones familiares</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Eventos corporativos</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Actividades comunitarias</li>
    </ul>
    <p className="mt-4 font-semibold">Nuestras instalaciones cuentan con:</p>
    <ul className="mt-2 space-y-1">
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Sillas y mesas</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Cocina equipada (microondas, refrigeradora y congelador)</li>
      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Baños accesibles</li>
    </ul>
  </div>
);

export default InformacionGeneral;
