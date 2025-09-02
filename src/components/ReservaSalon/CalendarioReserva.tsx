import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/Custom.css";

type FechasState = { aprobadas: string[]; pendientes: string[] };

interface CalendarioReservaProps {
    fechas: FechasState;
    fechaSeleccionada: string | null;
    onDateChange: (date: Date) => void;
}

const localeES = {
    months: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ],
    days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
};

const formatShortWeekday = (_locale: string | undefined, date: Date) => localeES.days[date.getDay()];
const formatMonthYear = (_locale: string | undefined, date: Date) =>
    `${localeES.months[date.getMonth()]} ${date.getFullYear()}`;

const convertirFecha = (date: Date) => {
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
};

const parseLocalDate = (fechaISO: string) => {
    const [año, mes, dia] = fechaISO.split("-").map(Number);
    return new Date(año, mes - 1, dia);
};

const CalendarioReserva: React.FC<CalendarioReservaProps> = ({
    fechas,
    fechaSeleccionada,
    onDateChange,
}) => {
    const fechaHoy = new Date();

    const handleCalendarChange = (
        value: Date | Date[] | [Date | null, Date | null] | null,
        _event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (value instanceof Date) {
            onDateChange(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            onDateChange(value[0]);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-center text-gray-600 mb-2">Selecciona una fecha disponible</p>
            <div className="flex justify-center">
                <Calendar
                    locale="es"
                    onChange={handleCalendarChange}
                    minDate={fechaHoy}
                    value={fechaSeleccionada ? parseLocalDate(fechaSeleccionada) : null}
                    tileClassName={({ date }) => {
                        const fecha = convertirFecha(date);
                        if (fechaSeleccionada && fecha === fechaSeleccionada) return "selected";
                        if (fechas.aprobadas.includes(fecha)) return "reservado";
                        if (fechas.pendientes.includes(fecha)) return "pendiente";
                        if (fecha === convertirFecha(new Date())) return "hoy";
                        return "";
                    }}
                    formatShortWeekday={formatShortWeekday}
                    formatMonthYear={formatMonthYear}
                />
            </div>

            {/* Leyenda adaptativa */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 mt-4">
                <span className="hoy inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs">Hoy</span>
                <span className="selected inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs">Seleccionado</span>
                <span className="pendiente inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs">Pendiente</span>
                <span className="reservado inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs">Reservado</span>
            </div>
        </div>
    );
};

export default CalendarioReserva;
