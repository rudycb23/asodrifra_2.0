import React from "react";

const TarifaHorarios: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow my-8">
        <h2 className="text-success text-center font-bold mb-4 text-2xl">
            Tarifas y Horarios
        </h2>
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Día</th>
                        <th className="px-4 py-2">Precio</th>
                        <th className="px-4 py-2">Depósito</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="px-4 py-2">Sábados</td>
                        <td className="px-4 py-2">₡60,000</td>
                        <td className="px-4 py-2" rowSpan={2}>₡20,000</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-4 py-2">Domingos</td>
                        <td className="px-4 py-2">₡45,000</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold" colSpan={3}>
                            Horario: 2:00 PM - 10:00 PM
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default TarifaHorarios;
