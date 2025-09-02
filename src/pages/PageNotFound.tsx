import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-7xl font-extrabold text-red-600 mb-4 drop-shadow-md">404</h1>
            <p className="text-lg text-gray-500 font-semibold mb-6">La página que buscas no existe.</p>
            <Link to="/">
                <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition">
                    Volver al Inicio
                </button>
            </Link>
        </div>
    );
};

export default NotFound;
