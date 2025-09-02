import { motion } from "framer-motion";

const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const Valores = () => (
    <motion.section
        className="max-w-5xl w-full mx-auto bg-gray-50 rounded-lg shadow-lg p-6 md:p-8"
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Nuestros Valores</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 text-center">
                <h4 className="font-bold">Solidaridad</h4>
                <p>Fomentamos la unidad y el apoyo entre los miembros de nuestra comunidad.</p>
            </div>
            <div className="flex-1 text-center">
                <h4 className="font-bold">Innovación</h4>
                <p>Buscamos soluciones creativas para los desafíos locales.</p>
            </div>
            <div className="flex-1 text-center">
                <h4 className="font-bold">Sostenibilidad</h4>
                <p>Trabajamos por un futuro más limpio y verde para todos.</p>
            </div>
        </div>
    </motion.section>
);

export default Valores;
