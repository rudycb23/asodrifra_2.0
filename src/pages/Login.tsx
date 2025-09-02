import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const variantesSeccion = {
    oculto: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);

            Swal.fire({
                title: "¡Bienvenido!",
                text: "Inicio de sesión exitoso.",
                icon: "success",
                timer: 1700,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: { popup: "swal2-rounded" }
            });

            localStorage.setItem("isAdmin", "true");
            setTimeout(() => navigate("/panel-administrador"), 2000);

        } catch (err) {
            setError("Correo o contraseña incorrectos.");
        }
    };

    return (
        <motion.div
            variants={variantesSeccion}
            initial="oculto"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex items-center justify-center bg-gray-50"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-center text-green-700 text-2xl font-bold mb-6">Iniciar Sesión</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 rounded p-2 mb-4 text-center">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block font-semibold mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Ingrese su correo"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-semibold mb-1">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Ingrese su contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default Login;
