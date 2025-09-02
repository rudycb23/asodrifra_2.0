import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../services/firebase";
import FadeIn from "../components/global/utils/FadeIn";

type Noticia = {
    id: string;
    titulo?: string;
    contenido: string[];
    imagenes?: string[];
    fecha?: string;
};

const ListaNoticias: React.FC = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagina, setPagina] = useState(1);
    const noticiasPorPagina = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const cargarNoticias = async () => {
            setLoading(true);
            setError(null);
            try {
                const noticiasRef = collection(firestore, "noticias");
                const consulta = query(noticiasRef, orderBy("fecha", "desc"));
                const querySnapshot = await getDocs(consulta);
                const noticiasObtenidas = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Noticia[];
                setNoticias(noticiasObtenidas);
            } catch (err: any) {
                setError("No se pudieron cargar las noticias. Intente de nuevo más tarde.");
                setNoticias([]);
            } finally {
                setLoading(false);
            }
        };
        cargarNoticias();
    }, []);

    const cambiarPagina = (numero: number) => setPagina(numero);

    const noticiasPaginadas = noticias.slice(
        (pagina - 1) * noticiasPorPagina,
        pagina * noticiasPorPagina
    );
    const totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);

    return (
        <div className="max-w-6xl mx-auto mt-1 py-10 px-2">
            <div className="bg-white shadow rounded-lg mb-8 p-4">
                <h2 className="text-center text-2xl md:text-3xl font-bold text-green-700 mb-0">
                    Últimas Noticias
                </h2>
            </div>
            {/* Loading fallback */}
            {loading && (
                <div className="w-full flex justify-center py-20 text-green-700 text-lg font-bold animate-pulse">
                    Cargando noticias...
                </div>
            )}
            {/* Error fallback */}
            {error && (
                <div className="w-full flex justify-center py-10 text-red-500 font-bold">
                    {error}
                </div>
            )}
            {/* Noticias */}
            {!loading && !error && noticiasPaginadas.length === 0 && (
                <div className="w-full flex justify-center py-20 text-gray-500">
                    No hay noticias publicadas.
                </div>
            )}
            {!loading && !error && noticiasPaginadas.length > 0 && (
                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {noticiasPaginadas.map((noticia) => (
                            <div key={noticia.id} className="bg-white rounded-lg shadow-md flex flex-col h-full overflow-hidden">
                                <div className="bg-white w-full h-60 md:h-64 flex items-center justify-center">
                                    <img
                                        src={noticia.imagenes?.[0] ? `https://asodisfra.com${noticia.imagenes[0]}` : "/images/default.jpg"}
                                        alt={noticia.titulo || "Imagen de la noticia"}
                                        className="object-contain w-full h-full"
                                        style={{ maxHeight: "240px", background: "white" }}
                                    />
                                </div>
                                {/* Texto y botón */}
                                <div className="flex-1 flex flex-col p-4">
                                    <h3 className="font-bold text-green-700 text-lg mb-2">{noticia.titulo || "Sin título"}</h3>
                                    <p className="text-gray-700 mb-4 flex-1">
                                        {Array.isArray(noticia.contenido) && noticia.contenido[0]?.length > 135
                                            ? `${noticia.contenido[0].slice(0, 135)}...`
                                            : noticia.contenido?.[0] || "Sin contenido disponible"}
                                    </p>
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 w-full rounded flex items-center justify-center gap-2 mt-auto transition"
                                        onClick={() => navigate(`/noticias-eventos/${noticia.id}`)}
                                        style={{ minHeight: 48 }} // asegura que todos los botones tengan la misma altura
                                    >
                                        <FaEye />
                                        Ver Más
                                    </button>
                                </div>
                                {/* Fecha */}
                                <div className="bg-gray-100 px-4 py-2 text-sm text-gray-500 text-right">
                                    Fecha: {noticia.fecha
                                        ? new Date(noticia.fecha).toLocaleDateString()
                                        : "Sin fecha"}
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            )}
            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="flex justify-center mt-8 gap-1 flex-wrap">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            className={`w-10 h-10 flex items-center justify-center rounded ${pagina === i + 1
                                ? "bg-green-600 text-white font-bold"
                                : "bg-gray-200 text-gray-700"
                                } hover:bg-green-700 hover:text-white transition`}
                            onClick={() => cambiarPagina(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListaNoticias;
