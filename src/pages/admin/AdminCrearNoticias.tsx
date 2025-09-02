import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSave } from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import FadeIn from "../../components/global/utils/FadeIn";

const MySwal = withReactContent(Swal);

const AdminCrearNoticia = () => {
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [imagenes, setImagenes] = useState<File[]>([]);
    const navigate = useNavigate();

    const manejarCambioImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivos = e.target.files ? Array.from(e.target.files) : [];
        setImagenes([...imagenes, ...archivos]);
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo.trim() || !contenido.trim()) {
            MySwal.fire("Error", "El título y el contenido son obligatorios.", "error");
            return;
        }

        try {
            const nuevasImagenes: string[] = [];
            for (const imagen of imagenes) {
                const datosFormulario = new FormData();
                datosFormulario.append("imagen", imagen);
                const respuesta = await fetch("https://asodisfra.com/imagenes.php", {
                    method: "POST",
                    body: datosFormulario,
                });
                if (!respuesta.ok) throw new Error("Error al subir imágenes al servidor");
                const { ruta } = await respuesta.json();
                nuevasImagenes.push(ruta);
            }

            const nuevaNoticia = {
                titulo: titulo.trim(),
                contenido: contenido
                    .split("\n")
                    .map((p) => p.trim())
                    .filter((p) => p),
                imagenes: nuevasImagenes,
                fecha: new Date().toISOString(),
            };

            await addDoc(collection(firestore, "noticias"), nuevaNoticia);

            MySwal.fire({
                title: "Éxito",
                text: "La noticia fue creada correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/gestion-lista-noticias");
                }
            });

        } catch (error) {
            console.error("Error al crear la noticia:", error);
            MySwal.fire("Error", "No se pudo crear la noticia. Por favor, inténtalo más tarde.", "error");
        }
    };

    return (
        <FadeIn>
            <div className="max-w-5xl mx-auto mt-8 pt-8">
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-center text-2xl md:text-3xl font-bold text-green-700 mb-8">
                        Crear Nueva Noticia
                    </h2>
                    <form onSubmit={manejarEnvio} className="space-y-6">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Título</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Escribe el título de la noticia"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Contenido</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[130px] focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Escribe el contenido de la noticia. Usa saltos de línea para párrafos."
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Imágenes (opcional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={manejarCambioImagen}
                                className="block w-full text-gray-700 file:bg-green-100 file:text-green-700 file:rounded-md file:border-0 file:px-3 file:py-1.5"
                            />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                {imagenes.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(img)}
                                        alt={`Vista previa ${idx}`}
                                        className="rounded shadow aspect-video object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                        >
                            <FaSave />
                            Crear Noticia
                        </button>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
};

export default AdminCrearNoticia;
