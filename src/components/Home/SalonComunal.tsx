import { motion } from "framer-motion";

interface Props {
    onMasInfo: () => void;
}

const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const SalonComunalSection: React.FC<Props> = ({ onMasInfo }) => (
    <motion.section
        className="max-w-5xl w-full mx-auto bg-gray-50 rounded-lg shadow-lg p-6 md:p-8"
        variants={variantesSeccion}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
                src="/assets/salon1.jpg"
                alt="Salón Comunal"
                className="h-56 w-full md:w-1/2 object-cover rounded shadow"
            />
            <div className="flex flex-col justify-center w-full md:w-1/2">
                <h2 className="text-green-700 text-2xl font-bold mb-2">Salón Comunal</h2>
                <p className="mb-3">Nuestro salón comunal es el espacio ideal para realizar tus eventos y actividades...</p>
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    onClick={onMasInfo}
                >
                    Más Información
                </button>
            </div>
        </div>
    </motion.section>
);

export default SalonComunalSection;
