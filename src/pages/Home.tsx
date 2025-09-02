import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Home/Hero";
import Noticias from "../components/Home/Noticias";
import SalonComunal from "../components/Home/SalonComunal";
import MisionVision from "../components/Home/MisionVision";
import Valores from "../components/Home/Valores";
import Contacto from "../components/Home/Contacto";

type Noticia = {
    id: string;
    titulo?: string;
    contenido: string[];
    imagenes?: string[];
};

const HomeContainer: React.FC = () => {
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const cargarNoticias = async () => {
        try {
            const noticiasRef = collection(firestore, "noticias");
            const consulta = query(noticiasRef, orderBy("fecha", "desc"), limit(3));
            const querySnapshot = await getDocs(consulta);
            const noticiasRecientes: Noticia[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    titulo: data.titulo ?? "",
                    contenido: Array.isArray(data.contenido) ? data.contenido : [""],
                    imagenes: Array.isArray(data.imagenes) ? data.imagenes : [],
                };
            });
            setNoticias(noticiasRecientes);
        } catch (error) {
            setNoticias([]);
            console.error("Error al cargar las noticias:", error);
        }
    };

    useEffect(() => {
        cargarNoticias();
    }, []);

    return (
        <div className="flex flex-col gap-16">
            <Hero />
            <Noticias noticias={noticias} />
            <div className="flex justify-center">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => navigate("/noticias-eventos")}
                >
                    Ver Más Noticias
                </button>
            </div>
            <SalonComunal onMasInfo={() => navigate("/salon-comunal")} />
            <MisionVision />
            <Valores />
            <Contacto />
        </div>
    );
};

export default HomeContainer;
