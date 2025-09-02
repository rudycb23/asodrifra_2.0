import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const MisionVision = () => (
    <motion.section
        className="max-w-5xl w-full mx-auto bg-gray-50 rounded-lg shadow-lg p-6 md:p-8"
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Misión y Visión</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 text-center">
                <FaCheckCircle size={44} className="text-gray-700 mx-auto mb-3" />
                <h4 className="font-bold">Misión</h4>
                <p>Trabajar en conjunto para el desarrollo integral de nuestra comunidad...</p>
            </div>
            <div className="flex-1 text-center">
                <FaCheckCircle size={44} className="text-gray-700 mx-auto mb-3" />
                <h4 className="font-bold">Visión</h4>
                <p>Ser una comunidad ejemplar, donde la solidaridad, la cultura y la innovación sean pilares fundamentales para el progreso.</p>
            </div>
        </div>
    </motion.section>
);

export default MisionVision;
