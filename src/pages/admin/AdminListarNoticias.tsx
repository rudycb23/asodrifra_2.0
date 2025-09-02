import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { truncate } from "../../components/global/utils/truncate";
import FadeIn from "../../components/global/utils/FadeIn";

type Noticia = {
    id: string;
    titulo: string;
    fecha: string;
    [key: string]: any;
};

const AdminListarNoticias: React.FC = () => {
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const cargarNoticias = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "noticias"));
            const datos: Noticia[] = [];
            querySnapshot.forEach((docu) => {
                const data = docu.data();
                datos.push({
                    id: docu.id,
                    titulo: data.titulo || "Sin título",
                    fecha: data.fecha || "",
                    ...data,
                });
            });

            datos.sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            setNoticias(datos);
            setNoticiasFiltradas(datos);
        } catch (error) {
            console.error("Error al cargar noticias:", error);
        }
    };

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.toLowerCase();
        setBusqueda(valor);

        const filtradas = noticias.filter((noticia) => {
            const fechaFormateada = new Date(noticia.fecha).toLocaleDateString();
            return (
                (noticia.titulo?.toLowerCase() ?? "").includes(valor) ||
                fechaFormateada.includes(valor)
            );
        });

        setNoticiasFiltradas(filtradas);
    };

    const handleEliminar = async (id: string) => {
        const noticia = noticias.find((n) => n.id === id);
        Swal.fire({
            title: "Eliminar Noticia",
            text: `¿Estás seguro de eliminar la noticia "${noticia?.titulo}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(firestore, "noticias", id));
                    setNoticias(noticias.filter((n) => n.id !== id));
                    setNoticiasFiltradas(noticiasFiltradas.filter((n) => n.id !== id));
                    Swal.fire({
                        title: "Noticia Eliminada",
                        text: "La noticia ha sido eliminada correctamente.",
                        icon: "success",
                        confirmButtonColor: "#28a745",
                    });
                } catch (error) {
                    console.error("Error al eliminar noticia:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al intentar eliminar la noticia.",
                        icon: "error",
                        confirmButtonColor: "#dc3545",
                    });
                }
            }
        });
    };

    useEffect(() => {
        cargarNoticias();
    }, []);

    return (
        <FadeIn>

            <div className="max-w-5xl mx-auto mt-8 pt-8">
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-green-600 text-2xl font-bold text-center mb-6">
                        Lista de Noticias
                    </h2>
                    <input
                        type="text"
                        placeholder="Buscar por título o fecha..."
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {noticiasFiltradas.map((noticia) => (
                                    <tr key={noticia.id} className="border-t">
                                        <td className="px-4 py-2 max-w-[320px] truncate" title={noticia.titulo}>
                                            {truncate(noticia.titulo, 60)}
                                        </td>
                                        <td className="px-4 py-2">
                                            {new Date(noticia.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center"
                                                    onClick={() => navigate(`/noticias-eventos/${noticia.id}`)}
                                                >
                                                    <FaEye className="mr-1" /> Ver
                                                </button>
                                                <button
                                                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition flex items-center"
                                                    onClick={() => navigate(`/gestion-editar-noticia/${noticia.id}`)}
                                                >
                                                    <FaEdit className="mr-1" /> Editar
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center"
                                                    onClick={() => handleEliminar(noticia.id)}
                                                >
                                                    <FaTrash className="mr-1" /> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {noticiasFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                            No se encontraron noticias.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default AdminListarNoticias;
