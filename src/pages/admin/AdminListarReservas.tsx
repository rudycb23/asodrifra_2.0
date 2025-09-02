import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import FadeIn from "../../components/global/utils/FadeIn";
import { truncate } from "../../components/global/utils/truncate";

type Reserva = {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    fecha: string;
    estado: string;
};

const AdminListarReservas: React.FC = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

    const fetchReservas = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "reservas"));
            const reservasData: Reserva[] = [];
            querySnapshot.forEach((docSnap) => {
                reservasData.push({ id: docSnap.id, ...docSnap.data() } as Reserva);
            });

            // Pendientes primero, luego resto por fecha descendente
            reservasData.sort((a, b) => {
                if (a.estado === "Pendiente" && b.estado !== "Pendiente") return -1;
                if (a.estado !== "Pendiente" && b.estado === "Pendiente") return 1;
                if (a.estado !== "Pendiente" && b.estado !== "Pendiente") {
                    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
                }
                return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
            });

            setReservas(reservasData);
            setReservasFiltradas(reservasData);
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        }
    };

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.toLowerCase();
        setBusqueda(valor);

        const filtradas = reservas.filter((reserva) => {
            const fechaFormateada = new Date(reserva.fecha).toLocaleDateString();
            return (
                reserva.nombre.toLowerCase().includes(valor) ||
                reserva.email.toLowerCase().includes(valor) ||
                reserva.telefono.toLowerCase().includes(valor) ||
                reserva.estado.toLowerCase().includes(valor) ||
                fechaFormateada.includes(valor)
            );
        });

        setReservasFiltradas(filtradas);
    };

    const handleAprobar = async (id: string) => {
        try {
            const reserva = reservas.find((r) => r.id === id);
            await updateDoc(doc(firestore, "reservas", id), { estado: "Aprobada" });
            setReservas(
                reservas.map((r) => (r.id === id ? { ...r, estado: "Aprobada" } : r))
            );
            setReservasFiltradas(
                reservasFiltradas.map((r) => (r.id === id ? { ...r, estado: "Aprobada" } : r))
            );
            Swal.fire(
                "¡Aprobada!",
                `La reserva para ${reserva?.nombre} ha sido aprobada.`,
                "success"
            );
        } catch (error) {
            console.error("Error al aprobar reserva:", error);
        }
    };

    const handleRechazar = async (id: string) => {
        try {
            const reserva = reservas.find((r) => r.id === id);
            await updateDoc(doc(firestore, "reservas", id), { estado: "Rechazada" });
            setReservas(
                reservas.map((r) => (r.id === id ? { ...r, estado: "Rechazada" } : r))
            );
            setReservasFiltradas(
                reservasFiltradas.map((r) => (r.id === id ? { ...r, estado: "Rechazada" } : r))
            );
            Swal.fire(
                "¡Rechazada!",
                `La reserva para ${reserva?.nombre} ha sido rechazada.`,
                "success"
            );
        } catch (error) {
            console.error("Error al rechazar reserva:", error);
        }
    };

    const handleViewDetails = (reserva: Reserva) => {
        setSelectedReserva(reserva);
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    return (
        <FadeIn>
            <div className="max-w-5xl mx-auto mt-8 pt-8">
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-green-700 text-center font-bold text-2xl mb-6">
                        Lista de Reservas
                    </h2>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo, teléfono, estado o fecha..."
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="block w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-green-100 text-green-800">
                                <tr>
                                    <th className="py-2 px-3 text-left">Nombre</th>
                                    <th className="py-2 px-3 text-left">Correo</th>
                                    <th className="py-2 px-3 text-left">Teléfono</th>
                                    <th className="py-2 px-3 text-left">Fecha</th>
                                    <th className="py-2 px-3 text-left">Estado</th>
                                    <th className="py-2 px-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservasFiltradas.map((reserva) => (
                                    <tr key={reserva.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                        <td className="py-2 px-3 max-w-[140px] truncate" title={reserva.nombre}>
                                            {truncate(reserva.nombre, 15)}
                                        </td>
                                        <td className="py-2 px-3 max-w-[210px] truncate" title={reserva.email}>
                                            {truncate(reserva.email, 25)}
                                        </td>
                                        <td className="py-2 px-3 max-w-[110px] truncate" title={reserva.telefono}>
                                            {truncate(reserva.telefono, 10)}
                                        </td>
                                        <td className="py-2 px-3">
                                            {new Date(reserva.fecha).toLocaleDateString()}
                                        </td>
                                        <td
                                            className={
                                                "py-2 px-3 font-bold " +
                                                (reserva.estado === "Pendiente"
                                                    ? "text-yellow-600"
                                                    : reserva.estado === "Aprobada"
                                                        ? "text-green-600"
                                                        : "text-red-600")
                                            }
                                        >
                                            {reserva.estado}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
                                                    onClick={() => handleViewDetails(reserva)}
                                                >
                                                    Ver Detalles
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow"
                                                    onClick={() => handleAprobar(reserva.id)}
                                                    disabled={reserva.estado === "Aprobada"}
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow"
                                                    onClick={() => handleRechazar(reserva.id)}
                                                    disabled={reserva.estado === "Rechazada"}
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reservasFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-5 text-center text-gray-500">
                                            No hay reservas encontradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal personalizado */}
                    {selectedReserva && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative animate-fadein">
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold"
                                    onClick={() => setSelectedReserva(null)}
                                >
                                    ×
                                </button>
                                <h3 className="text-lg font-bold mb-4 text-green-700">
                                    Detalles de la Reserva
                                </h3>
                                <p className="mb-2">
                                    <span className="font-semibold">Nombre:</span> {selectedReserva.nombre}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Correo:</span> {selectedReserva.email}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Teléfono:</span> {selectedReserva.telefono}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Fecha:</span>{" "}
                                    {new Date(selectedReserva.fecha).toLocaleDateString()}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Estado:</span>{" "}
                                    <span
                                        className={
                                            selectedReserva.estado === "Pendiente"
                                                ? "text-yellow-600 font-bold"
                                                : selectedReserva.estado === "Aprobada"
                                                    ? "text-green-600 font-bold"
                                                    : "text-red-600 font-bold"
                                        }
                                    >
                                        {selectedReserva.estado}
                                    </span>
                                </p>
                                <button
                                    className="w-full mt-5 bg-gray-200 hover:bg-gray-300 rounded py-2 font-semibold"
                                    onClick={() => setSelectedReserva(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};

export default AdminListarReservas;
