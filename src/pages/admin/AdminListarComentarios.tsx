import React, { useState, useEffect } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { truncate } from "../../components/global/utils/truncate";
import FadeIn from "../../components/global/utils/FadeIn";

interface Comentario {
    id: string;
    nombre: string;
    correo: string;
    telefono: string;
    texto: string;
    fecha?: string;
}

const AdminListarComentarios: React.FC = () => {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [comentariosFiltrados, setComentariosFiltrados] = useState<Comentario[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState<Comentario | null>(null);

    const cargarComentarios = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "comentarios"));
            const comentariosData: Comentario[] = [];
            querySnapshot.forEach((docSnap) => {
                comentariosData.push({ id: docSnap.id, ...docSnap.data() } as Comentario);
            });
            comentariosData.sort((a, b) =>
                new Date(b.fecha || "").getTime() - new Date(a.fecha || "").getTime()
            );
            setComentarios(comentariosData);
            setComentariosFiltrados(comentariosData);
        } catch (error) {
            console.error("Error al cargar comentarios: ", error);
        }
    };

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.toLowerCase();
        setBusqueda(valor);
        const filtrados = comentarios.filter((comentario) => {
            const fechaFormateada = comentario.fecha
                ? new Date(comentario.fecha).toLocaleDateString()
                : "";
            return (
                comentario.nombre.toLowerCase().includes(valor) ||
                comentario.correo.toLowerCase().includes(valor) ||
                comentario.telefono.toLowerCase().includes(valor) ||
                (comentario.texto?.toLowerCase() || "").includes(valor) ||
                fechaFormateada.includes(valor)
            );
        });
        setComentariosFiltrados(filtrados);
    };

    const handleEliminar = async (id: string) => {
        Swal.fire({
            title: "Eliminar Comentario",
            text: "¿Estás seguro de eliminar este comentario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(firestore, "comentarios", id));
                    setComentarios(comentarios.filter((comentario) => comentario.id !== id));
                    setComentariosFiltrados(comentariosFiltrados.filter((comentario) => comentario.id !== id));
                    Swal.fire("Eliminado", "Comentario eliminado con éxito.", "success");
                } catch (error) {
                    console.error("Error al eliminar comentario: ", error);
                    Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
                }
            }
        });
    };

    const handleVerComentario = (comentario: Comentario) => {
        setComentarioSeleccionado(comentario);
        setModalShow(true);
    };

    useEffect(() => {
        cargarComentarios();
    }, []);

    return (
        <FadeIn>

            <div className="max-w-5xl mx-auto mt-8 pt-8">
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-green-700 text-center font-bold text-2xl mb-6">Lista de Comentarios</h2>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo, teléfono, comentario o fecha..."
                        value={busqueda}
                        onChange={handleBusqueda}
                        className="block w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-green-100 text-green-800">
                                <tr>
                                    <th className="py-2 px-3 text-left">Nombre</th>
                                    <th className="py-2 px-3 text-left">Correo</th>
                                    <th className="py-2 px-3 text-left">Teléfono</th>
                                    <th className="py-2 px-3 text-left">Fecha</th>
                                    <th className="py-2 px-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comentariosFiltrados.map((comentario) => (
                                    <tr key={comentario.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                        <td className="py-2 px-3 max-w-[150px] truncate" title={comentario.nombre}>
                                            {truncate(comentario.nombre, 15)}
                                        </td>
                                        <td className="py-2 px-3 max-w-[220px] truncate" title={comentario.correo}>
                                            {truncate(comentario.correo, 25)}
                                        </td>
                                        <td className="py-2 px-3 max-w-[130px] truncate" title={comentario.telefono}>
                                            {truncate(comentario.telefono, 10)}
                                        </td>
                                        <td className="py-2 px-3">
                                            {comentario.fecha
                                                ? new Date(comentario.fecha).toLocaleDateString()
                                                : "Fecha no disponible"}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-2 shadow"
                                                    onClick={() => handleVerComentario(comentario)}
                                                >
                                                    <FaEye /> Ver Detalles
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-2 shadow"
                                                    onClick={() => handleEliminar(comentario.id)}
                                                >
                                                    <FaTrash /> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {comentariosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-5 text-center text-gray-500">
                                            No hay comentarios encontrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal personalizado */}
                    {modalShow && comentarioSeleccionado && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative animate-fadein">
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold"
                                    onClick={() => setModalShow(false)}
                                >
                                    ×
                                </button>
                                <h3 className="text-lg font-bold mb-4 text-green-700">Detalles del Comentario</h3>
                                <p className="mb-2">
                                    <span className="font-semibold">Nombre:</span> {comentarioSeleccionado.nombre}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Correo:</span> {comentarioSeleccionado.correo}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Teléfono:</span> {comentarioSeleccionado.telefono}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Comentario:</span> {comentarioSeleccionado.texto}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Fecha:</span>{" "}
                                    {comentarioSeleccionado.fecha
                                        ? new Date(comentarioSeleccionado.fecha).toLocaleString()
                                        : "Fecha no disponible"}
                                </p>
                                <button
                                    className="w-full mt-5 bg-gray-200 hover:bg-gray-300 rounded py-2 font-semibold"
                                    onClick={() => setModalShow(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};

export default AdminListarComentarios;
