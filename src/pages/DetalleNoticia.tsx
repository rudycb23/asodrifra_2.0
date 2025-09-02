import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import FadeIn from "../components/global/utils/FadeIn";

type Noticia = {
    titulo?: string;
    imagenes?: string[];
    contenido?: string[] | string;
    fecha?: string;
};

const DetalleNoticia: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [carousel, setCarousel] = useState(0);

    useEffect(() => {
        const cargarNoticia = async () => {
            try {
                const docRef = doc(firestore, "noticias", String(id));
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    setError("La noticia no fue encontrada.");
                    return;
                }
                setNoticia(docSnap.data() as Noticia);
            } catch (err) {
                console.error("Error al cargar la noticia:", err);
                setError("No se pudo cargar la noticia. Inténtalo más tarde.");
            }
        };
        cargarNoticia();
    }, [id]);

    const nextImg = () => setCarousel((carousel + 1) % (noticia?.imagenes?.length || 1));
    const prevImg = () => setCarousel((carousel - 1 + (noticia?.imagenes?.length || 1)) % (noticia?.imagenes?.length || 1));

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-16 text-center">
                <h2 className="text-red-600 font-bold mb-4">{error}</h2>
                <button
                    onClick={() => navigate("/noticias-eventos")}
                    className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition inline-flex items-center gap-2">
                    <FaArrowLeft /> Volver a Noticias
                </button>
            </div>
        );
    }
    if (!noticia) {
        return (
            <div className="max-w-2xl mx-auto mt-16 text-center">
                <h2 className="font-bold mb-4">Cargando noticia...</h2>
            </div>
        );
    }
    return (
        <FadeIn>
            <div className="max-w-3xl mx-auto my-12 bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-center font-bold text-2xl mb-2">
                    {noticia.titulo || "Sin título"}
                </h1>
                {noticia.fecha && (
                    <p className="text-center text-gray-500 mb-6">
                        {new Date(noticia.fecha).toLocaleDateString("es-CR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </p>
                )}
                {noticia.imagenes && noticia.imagenes.length > 0 ? (
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden flex items-center justify-center mb-6 bg-gray-100">
                        <img
                            src={`https://asodisfra.com${noticia.imagenes[carousel]}`}
                            alt={`Imagen ${carousel + 1}`}
                            className="object-contain w-full h-full bg-white"
                        />
                        {noticia.imagenes.length > 1 && (
                            <>
                                <button
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 p-2 rounded-full shadow"
                                    onClick={prevImg}>
                                    <FaChevronLeft size={20} />
                                </button>
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 p-2 rounded-full shadow"
                                    onClick={nextImg}>
                                    <FaChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-2 left-0 w-full flex justify-center gap-2">
                                    {noticia.imagenes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`h-3 w-3 rounded-full ${carousel === idx ? "bg-green-700" : "bg-gray-300"}`}
                                            onClick={() => setCarousel(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-center">No hay imágenes disponibles.</p>
                )}
                <div className="mt-4 text-justify space-y-4">
                    {Array.isArray(noticia.contenido)
                        ? noticia.contenido.map((parrafo, idx) => <p key={idx}>{parrafo}</p>)
                        : <p>{noticia.contenido || "Sin contenido disponible"}</p>}
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded shadow flex items-center gap-2">
                        <FaArrowLeft /> Regresar
                    </button>
                </div>
            </div>
        </FadeIn>
    );
};

export default DetalleNoticia;
