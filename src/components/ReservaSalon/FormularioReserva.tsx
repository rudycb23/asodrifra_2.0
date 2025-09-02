import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

const MySwal = withReactContent(Swal);

type FechasState = { aprobadas: string[]; pendientes: string[] };

interface FormularioReservaProps {
    fechaSeleccionada: string | null;
    setMensajeError: (msg: string) => void;
    setFechas: React.Dispatch<React.SetStateAction<FechasState>>;
}

const FormularioReserva: React.FC<FormularioReservaProps> = ({
    fechaSeleccionada,
    setMensajeError,
    setFechas,
}) => {
    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        email: "",
    });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "telefono") {
            const soloNumeros = value.replace(/\D/g, "");
            if (soloNumeros.length <= 8) {
                setFormData((fd) => ({ ...fd, [name]: soloNumeros }));
            }
        } else {
            setFormData((fd) => ({ ...fd, [name]: value }));
        }
    };

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        setMensajeError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fechaSeleccionada) {
            setMensajeError("Por favor selecciona una fecha válida antes de enviar.");
            return;
        }
        if (!captchaToken) {
            setMensajeError("Por favor completa el CAPTCHA antes de enviar.");
            return;
        }
        if (formData.nombre.length < 3 || formData.telefono.length !== 8) {
            setMensajeError("Completa todos los campos correctamente.");
            return;
        }
        setLoading(true);
        MySwal.fire({
            title: "Confirmar Reserva",
            text: `¿Deseas reservar el salón el día ${fechaSeleccionada}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Reservar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const datosParaWhatsApp = { ...formData }; // Guarda antes de resetear
                    await addDoc(collection(firestore, "reservas"), {
                        ...datosParaWhatsApp,
                        fecha: fechaSeleccionada,
                        estado: "Pendiente",
                        fechaRegistro: new Date().toISOString(),
                    });
                    setFechas((prev: FechasState) => ({
                        ...prev,
                        pendientes: [...prev.pendientes, fechaSeleccionada],
                    }));
                    setFormData({ nombre: "", telefono: "", email: "" });
                    setMensajeError("");
                    setCaptchaToken(null);

                    const mensajeWA = encodeURIComponent(
                        `¡Hola! Deseo confirmar una reserva para el salón comunal.\n\n` +
                        `*Nombre:* ${datosParaWhatsApp.nombre}\n` +
                        `*Teléfono:* ${datosParaWhatsApp.telefono}\n` +
                        `*Correo:* ${datosParaWhatsApp.email}\n` +
                        `*Fecha:* ${fechaSeleccionada}`
                    );

                    MySwal.fire({
                        title: "Reserva Pendiente",
                        html: `Recuerda confirmar la reserva vía WhatsApp y realizar el depósito.<br/><br/>
                       <a href="https://wa.me/50687616802?text=${mensajeWA}" 
                          target="_blank" 
                          class="bg-green-600 text-white px-4 py-2 rounded inline-block mt-3 hover:bg-green-700">
                          Enviar WhatsApp
                       </a>`,
                        icon: "info",
                        confirmButtonColor: "#28a745",
                    });

                } catch (error) {
                    MySwal.fire("Error", "No se pudo guardar la reserva.", "error");
                }
            }
            setLoading(false);
        });
    };

    return (
        <form className="bg-white rounded-xl shadow-md p-6 mt-6 w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="font-bold flex items-center gap-2 mb-1">
                    <FaCalendarAlt /> Fecha Seleccionada
                </label>
                <input
                    type="text"
                    className="w-full rounded border px-3 py-2 bg-gray-100"
                    value={fechaSeleccionada || "Selecciona una fecha en el calendario"}
                    readOnly
                />
            </div>
            <div className="mb-4">
                <label className="font-bold flex items-center gap-2 mb-1">
                    <FaUser /> Nombre Completo
                </label>
                <input
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="font-bold flex items-center gap-2 mb-1">
                    <FaPhone /> Teléfono
                </label>
                <input
                    type="tel"
                    className="w-full rounded border px-3 py-2"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    maxLength={8}
                    inputMode="numeric"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="font-bold flex items-center gap-2 mb-1">
                    <FaEnvelope /> Correo Electrónico
                </label>
                <input
                    type="email"
                    className="w-full rounded border px-3 py-2"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-4 flex justify-center">
                <ReCAPTCHA
                    sitekey="6LevGIgqAAAAAEcuEfRRiSRQbdXY6dXdxoR0hmXe"
                    onChange={onCaptchaChange}
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition"
            >
                {loading ? "Enviando..." : "Solicitar Reserva"}
            </button>
        </form>
    );
};

export default FormularioReserva;
