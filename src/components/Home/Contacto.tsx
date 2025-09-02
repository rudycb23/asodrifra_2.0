import { motion } from "framer-motion";
import { FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const Contacto = () => (
    <motion.section
        className="max-w-5xl w-full mx-auto bg-gray-50 rounded-lg shadow-lg mb-8 p-6 md:p-8"
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Contáctanos</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center text-center">
            <div className="flex-1 flex flex-col items-center">
                <FaFacebook size={40} className="text-blue-600 mb-2" />
                <div>
                    <div className="font-bold">Facebook</div>
                    <a href="https://www.facebook.com/ASODISFRA" className="text-green-700 font-bold" target="_blank" rel="noopener noreferrer">
                        ASODISFRA
                    </a>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <FaWhatsapp size={40} className="text-green-600 mb-2" />
                <div>
                    <div className="font-bold">WhatsApp</div>
                    <a href="https://wa.me/50687616802" className="text-green-700 font-bold" target="_blank" rel="noopener noreferrer">
                        +506 8761 6802
                    </a>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <FaEnvelope size={40} className="text-red-600 mb-2" />
                <div>
                    <div className="font-bold">Correo Electrónico</div>
                    <a href="mailto:asodisfra@correo.com" className="text-green-700 font-bold">
                        asodisfra@correo.com
                    </a>
                </div>
            </div>
        </div>
    </motion.section>
);

export default Contacto;
