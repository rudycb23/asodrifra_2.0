import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import FadeIn from "../../components/global/utils/FadeIn";

const MySwal = withReactContent(Swal);

type NoticiaData = {
    titulo: string;
    contenido: string[];
    imagenes: string[];
    [key: string]: any;
};

const AdminEditarNoticia: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [noticia, setNoticia] = useState<NoticiaData | null>(null);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [galeria, setGaleria] = useState<(string | File)[]>([]);
    const [imagenesEliminadas, setImagenesEliminadas] = useState<string[]>([]);

    useEffect(() => {
        const cargarNoticia = async () => {
            try {
                const docRef = doc(firestore, "noticias", id as string);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    MySwal.fire("Error", "La noticia no fue encontrada.", "error").then(
                        () => navigate("/gestion-lista-noticias")
                    );
                    return;
                }
                const datos = docSnap.data() as NoticiaData;
                setNoticia(datos);
                setTitulo(datos.titulo || "");
                setContenido((datos.contenido || []).join("\n"));
                setGaleria(datos.imagenes || []);
            } catch (error) {
                console.error("Error al cargar la noticia:", error);
                MySwal.fire("Error", "No se pudo cargar la noticia.", "error").then(() =>
                    navigate("/gestion-lista-noticias")
                );
            }
        };
        cargarNoticia();
    }, [id, navigate]);

    const manejarSubidaImagen = (e: ChangeEvent<HTMLInputElement>) => {
        const archivos = Array.from(e.target.files || []);
        setGaleria((prev) => [...prev, ...archivos]);
    };

    const eliminarImagen = (indice: number) => {
        const imagenAEliminar = galeria[indice];
        if (typeof imagenAEliminar === "string") {
            setImagenesEliminadas((prev) => [...prev, imagenAEliminar]);
        }
        setGaleria(galeria.filter((_, i) => i !== indice));
    };

    const manejarEnvio = async (e: FormEvent) => {
        e.preventDefault();
        if (!titulo.trim() || !contenido.trim()) {
            MySwal.fire("Error", "El título y el contenido son obligatorios.", "error");
            return;
        }

        try {
            const nuevasImagenes: string[] = [];
            for (const imagen of galeria) {
                if (imagen instanceof File) {
                    const datosFormulario = new FormData();
                    datosFormulario.append("imagen", imagen);
                    const respuesta = await fetch("https://asodisfra.com/imagenes.php", {
                        method: "POST",
                        body: datosFormulario,
                    });
                    if (!respuesta.ok) throw new Error("Error al subir imágenes");
                    const { ruta } = await respuesta.json();
                    nuevasImagenes.push(ruta);
                } else {
                    nuevasImagenes.push(imagen);
                }
            }

            const contenidoArray = contenido.split("\n").filter((p) => p.trim() !== "");
            const datosActualizados = {
                titulo,
                contenido: contenidoArray,
                imagenes: nuevasImagenes,
                imagenesEliminadas,
            };
            const docRef = doc(firestore, "noticias", id as string);
            await updateDoc(docRef, datosActualizados);

            // ✔️ El alert solo sale después de actualizar correctamente
            MySwal.fire("Éxito", "Noticia actualizada correctamente.", "success").then(
                () => navigate("/gestion-lista-noticias")
            );
        } catch (error) {
            console.error("Error al actualizar la noticia:", error);
            MySwal.fire("Error", "Hubo un problema al editar la noticia.", "error");
        }
    };

    if (!noticia) {
        return (
            <div className="mt-16 flex justify-center">
                <h2 className="text-xl font-bold">Cargando noticia...</h2>
            </div>
        );
    }

    return (<FadeIn>

        <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-green-600 text-2xl font-bold text-center mb-4">Editar Noticia</h2>
                <form onSubmit={manejarEnvio} className="space-y-6">
                    <div>
                        <label htmlFor="titulo" className="font-semibold mb-1 block">Título</label>
                        <input
                            type="text"
                            id="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            className="w-full border rounded px-3 py-2 focus:outline-green-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="contenido" className="font-semibold mb-1 block">Contenido</label>
                        <textarea
                            id="contenido"
                            rows={8}
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            required
                            className="w-full border rounded px-3 py-2 resize-y focus:outline-green-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="galeria" className="font-semibold mb-1 block">Imágenes</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="galeria"
                            onChange={manejarSubidaImagen}
                            className="block mb-3"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {galeria.map((imagen, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={
                                            imagen instanceof File
                                                ? URL.createObjectURL(imagen)
                                                : `https://asodisfra.com${imagen}`
                                        }
                                        alt={`Imagen ${index + 1}`}
                                        className="w-full h-32 object-cover rounded shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagen(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100 transition"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    </FadeIn>
    );
};

export default AdminEditarNoticia;
