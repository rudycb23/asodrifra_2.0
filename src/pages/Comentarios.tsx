import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaPaperPlane } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import FadeIn from "../components/global/utils/FadeIn";

const MySwal = withReactContent(Swal);

const Comentarios: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        texto: "",
    });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [mensajeError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        setMensajeError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            setMensajeError("Por favor completa el CAPTCHA.");
            return;
        }
        if (
            !formData.nombre ||
            !formData.texto ||
            !/\S+@\S+\.\S+/.test(formData.correo)
        ) {
            setMensajeError("Por favor completa todos los campos correctamente.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(firestore, "comentarios"), {
                ...formData,
                fecha: new Date().toISOString(),
            });
            MySwal.fire("Enviado", "¡Tu comentario ha sido enviado correctamente!", "success");
            setFormData({ nombre: "", correo: "", telefono: "", texto: "" });
            setCaptchaToken(null);
        } catch (error) {
            console.error("Error enviando comentario:", error);
            MySwal.fire("Error", "No se pudo enviar el comentario.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center mt-8 py-10 px-2">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl max-w-xl w-full p-6 md:p-8"
                noValidate
            >
                <FadeIn>
                    <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Deja tu comentario</h2>
                    {mensajeError && <p className="text-red-600 mb-4">{mensajeError}</p>}

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor="nombre">Nombre completo</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Escribe tu nombre completo"
                            required
                            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor="correo">Correo electrónico</label>
                        <input
                            id="correo"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            required
                            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor="telefono">Número telefónico</label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="+506 1234 5678"
                            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold" htmlFor="texto">Comentario</label>
                        <textarea
                            id="texto"
                            name="texto"
                            rows={5}
                            value={formData.texto}
                            onChange={handleChange}
                            placeholder="Escribe tu comentario aquí..."
                            required
                            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring focus:border-green-500 resize-none"
                        />
                    </div>
                    <div className="mb-4 flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LevGIgqAAAAAEcuEfRRiSRQbdXY6dXdxoR0hmXe"
                            onChange={onCaptchaChange}
                            onErrored={() => setMensajeError("No se pudo cargar el CAPTCHA, verifica tu conexión e intenta de nuevo.")}
                            theme="light"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            "Enviando..."
                        ) : (
                            <>
                                <FaPaperPlane className="mr-2" />
                                Enviar
                            </>
                        )}
                    </button>
                </FadeIn>
            </form>
        </div>
    );
};

export default Comentarios;
