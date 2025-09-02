import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHome, FaEnvelope, FaComments, FaNewspaper, FaUserLock,
    FaTools, FaLandmark, FaBars, FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { auth } from "../../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            setIsAdminAuthenticated(!!user);
        });

        const handleStorageChange = () => {
            if (!localStorage.getItem("isAdminAuthenticated")) {
                setIsAdminAuthenticated(false);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            unsubscribe();
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [auth]);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result: any) => {
            if (result.isConfirmed) {
                signOut(auth)
                    .then(() => {
                        localStorage.removeItem("isAdminAuthenticated");
                        setIsAdminAuthenticated(false);
                        navigate("/acceso-admn2-Y25a");
                    })
                    .catch((error: any) => console.error("Error al cerrar sesión:", error));
            }
        });
        setMenuOpen(false);
    };

    const navLinks = [
        { to: "/", label: "Inicio", icon: <FaHome /> },
        { to: "/salon-comunal", label: "Salón Comunal", icon: <FaLandmark /> },
        { to: "/noticias-eventos", label: "Noticias y Eventos", icon: <FaNewspaper /> },
        { to: "/contacto", label: "Contacto", icon: <FaEnvelope /> },
        { to: "/comentarios", label: "Comentarios", icon: <FaComments /> },
    ];

    return (
        <nav className="bg-white shadow fixed w-full z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="../../../../assets/Logo Asociación de Desarrollo Integral de San Francisco de Goicoechea.png"
                        alt="Logo Asociación"
                        className="h-12 w-auto"
                    />
                    <span className="text-lg font-bold text-green-700 hidden sm:inline">ASODISFRA</span>
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex gap-2 items-center">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
                        >
                            <span className="mr-2">{link.icon}</span> {link.label}
                        </Link>
                    ))}

                    {isAdminAuthenticated && (
                        <>
                            <Link
                                to="/panel-administrador"
                                className="flex items-center px-3 py-2 rounded text-green-900 hover:bg-green-100 hover:text-green-700 transition"
                            >
                                <FaTools className="mr-2" /> Gestionar
                            </Link>
                            <button
                                className="flex items-center px-3 py-2 rounded text-red-700 hover:bg-red-100 hover:text-red-900 transition"
                                onClick={handleLogout}
                            >
                                <FaUserLock className="mr-2" /> Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-green-700 text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menú"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg py-3 px-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center py-2 text-gray-700 hover:text-green-700 border-b border-gray-200"
                        >
                            <span className="mr-2">{link.icon}</span> {link.label}
                        </Link>
                    ))}
                    {isAdminAuthenticated && (
                        <>
                            <Link
                                to="/panel-administrador"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center py-2 text-green-900 hover:text-green-700 border-b border-gray-200"
                            >
                                <FaTools className="mr-2" /> Gestionar
                            </Link>
                            <button
                                className="flex items-center py-2 text-red-700 hover:text-red-900 w-full"
                                onClick={handleLogout}
                            >
                                <FaUserLock className="mr-2" /> Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
