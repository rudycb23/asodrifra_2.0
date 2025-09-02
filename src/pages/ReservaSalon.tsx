// src/pages/ReservaSalon.tsx
import { useState, useEffect } from "react";
import ConfirmacionWhatsapp from "../components/ReservaSalon/ConfirmacionWhatsapp";
import CuentasDeposito from "../components/ReservaSalon/CuentasDeposito";
import CalendarioReserva from "../components/ReservaSalon/CalendarioReserva";
import FormularioReserva from "../components/ReservaSalon/FormularioReserva";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebase";
import FadeIn from "../components/global/utils/FadeIn";

const ReservaSalon = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
    const [fechas, setFechas] = useState<{ aprobadas: string[]; pendientes: string[] }>({ aprobadas: [], pendientes: [] });
    const [mensajeError, setMensajeError] = useState<string>("");

    useEffect(() => {
        const cargarFechas = async () => {
            const querySnapshot = await getDocs(collection(firestore, "reservas"));
            const fechasOcupadas = { aprobadas: [], pendientes: [] } as { aprobadas: string[]; pendientes: string[] };
            querySnapshot.forEach((doc) => {
                const { fecha, estado } = doc.data();
                if (estado === "Aprobada") fechasOcupadas.aprobadas.push(fecha);
                else if (estado === "Pendiente") fechasOcupadas.pendientes.push(fecha);
            });
            setFechas(fechasOcupadas);
        };
        cargarFechas();
    }, []);

    const handleDateChange = (date: Date) => {
        const convertirFecha = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const fecha = convertirFecha(date);
        const fechaHoy = new Date();
        if (fechas.aprobadas.includes(fecha)) {
            setMensajeError("Esta fecha ya está reservada. Por favor, selecciona otra.");
            setFechaSeleccionada(null);
        } else if (fechas.pendientes.includes(fecha)) {
            setMensajeError("Esta fecha ya está en estado pendiente. Por favor, selecciona otra.");
            setFechaSeleccionada(null);
        } else if (date < fechaHoy) {
            setMensajeError("No puedes seleccionar una fecha anterior a la actual.");
            setFechaSeleccionada(null);
        } else {
            setMensajeError("");
            setFechaSeleccionada(fecha);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 py-10 px-2">
            <FadeIn className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-green-700 text-2xl font-bold text-center mb-2">
                    Reserva del Salón Comunal
                </h2>
            </FadeIn>

            <FadeIn className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg mb-6">
                <ConfirmacionWhatsapp />
                <CuentasDeposito />
            </FadeIn>

            <div className="flex flex-col md:flex-row gap-8">
                <FadeIn className="flex-1 flex flex-col gap-4">
                    <CalendarioReserva
                        fechas={fechas}
                        onDateChange={handleDateChange}
                        fechaSeleccionada={fechaSeleccionada} />
                </FadeIn>
                <FadeIn className="flex-1">
                    {mensajeError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {mensajeError}
                        </div>
                    )}
                    <FormularioReserva
                        fechaSeleccionada={fechaSeleccionada}
                        setMensajeError={setMensajeError}
                        setFechas={setFechas} />
                </FadeIn>
            </div>
        </div>
    );
};

export default ReservaSalon;


