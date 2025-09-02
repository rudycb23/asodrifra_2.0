import React from "react";
import { FaFacebook, FaWhatsapp, FaEnvelope, FaFacebookMessenger } from "react-icons/fa";
import FadeIn from "../components/global/utils/FadeIn";

const Contacto: React.FC = () => (
    <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{
            backgroundImage: 'url("/assets/iglesia1.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
    >
        <FadeIn className="bg-white/90 max-w-3xl w-full rounded-lg p-8 shadow-xl mx-4">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-4">Contáctanos</h2>
            <p className="text-center text-gray-700 mb-8">
                Si tienes alguna duda o necesitas más información, no dudes en contactarnos a través de nuestros medios oficiales.
                También puedes visitarnos en nuestras redes sociales para mantenerte actualizado sobre los eventos y actividades de la comunidad.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                    <a href="https://www.facebook.com/ASODISFRA" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={48} className="mx-auto text-blue-600 hover:scale-110 transition" />
                        <div className="mt-2 font-semibold">Facebook</div>
                    </a>
                </div>
                <div>
                    <a href="https://wa.me/50687616802" target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp size={48} className="mx-auto text-green-500 hover:scale-110 transition" />
                        <div className="mt-2 font-semibold">WhatsApp</div>
                    </a>
                </div>
                <div>
                    <a href="mailto:asodisfra@outlook.com" target="_blank" rel="noopener noreferrer">
                        <FaEnvelope size={48} className="mx-auto text-red-500 hover:scale-110 transition" />
                        <div className="mt-2 font-semibold">Correo</div>
                    </a>
                </div>
                <div>
                    <a href="https://www.facebook.com/messages/t/752218898287963" target="_blank" rel="noopener noreferrer">
                        <FaFacebookMessenger size={48} className="mx-auto text-blue-500 hover:scale-110 transition" />
                        <div className="mt-2 font-semibold">Messenger</div>
                    </a>
                </div>
            </div>
        </FadeIn>
    </div>
);

export default Contacto;
