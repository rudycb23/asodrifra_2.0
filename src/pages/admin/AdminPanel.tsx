import { Link } from "react-router-dom";
import { FaCalendarAlt, FaNewspaper, FaComments, FaPen } from "react-icons/fa";
import FadeIn from "../../components/global/utils/FadeIn";


function AdminPanel() {
    return (
        <div className="max-w-5xl mx-auto mt-10 px-2 pt-8">
            <div className="bg-white shadow p-6 rounded-xl mb-8">
                <h2 className="text-center text-2xl text-green-700 font-bold mb-2">
                    Panel de Administración
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Card 1 */}
                <FadeIn>
                    <Link to="/gestion-crear-noticia" className="block hover:scale-105 transition">
                        <div className="bg-white shadow-md rounded-xl p-7 flex flex-col items-center gap-3 text-center hover:bg-green-50">
                            <FaPen size={46} className="text-green-600" />
                            <div className="font-bold text-lg">Crear Noticia</div>
                        </div>
                    </Link>
                </FadeIn>

                {/* Card 2 */}
                <FadeIn>
                    <Link to="/gestion-lista-noticias" className="block hover:scale-105 transition">
                        <div className="bg-white shadow-md rounded-xl p-7 flex flex-col items-center gap-3 text-center hover:bg-green-50">
                            <FaNewspaper size={46} className="text-green-600" />
                            <div className="font-bold text-lg">Gestión de Noticias</div>
                        </div>
                    </Link>
                </FadeIn>

                {/* Card 3 */}
                <FadeIn>
                    <Link to="/gestion-lista-reservas" className="block hover:scale-105 transition">
                        <div className="bg-white shadow-md rounded-xl p-7 flex flex-col items-center gap-3 text-center hover:bg-green-50">
                            <FaCalendarAlt size={46} className="text-green-600" />
                            <div className="font-bold text-lg">Gestión de Reservas</div>
                        </div>
                    </Link>
                </FadeIn>

                {/* Card 4 */}
                <FadeIn>
                    <Link to="/gestion-lista-comentarios" className="block hover:scale-105 transition">
                        <div className="bg-white shadow-md rounded-xl p-7 flex flex-col items-center gap-3 text-center hover:bg-green-50">
                            <FaComments size={46} className="text-green-600" />
                            <div className="font-bold text-lg">Gestión de Comentarios</div>
                        </div>
                    </Link>
                </FadeIn>
            </div>
        </div>
    );
}

export default AdminPanel;
