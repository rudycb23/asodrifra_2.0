import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/global/utils/ErrorBoundary";
import ScrollToTop from "./components/global/utils/ScrollToTop";
import Layout from "./components/global/layout/Layout";
import Home from "./pages/Home";
import ListaNoticias from "./pages/ListaNoticias";
import DetalleNoticia from "./pages/DetalleNoticia";
import InfoSalonComunal from "./pages/InfoSalonComunal";
import ReservaSalon from "./pages/ReservaSalon";
import Comentarios from "./pages/Comentarios";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminListarReservas from "./pages/admin/AdminListarReservas";
import AdminListarNoticias from "./pages/admin/AdminListarNoticias";
import AdminCrearNoticias from "./pages/admin/AdminCrearNoticias";
import AdminEditarNoticias from "./pages/admin/AdminEditarNoticias";
import AdminListarComentarios from "./pages/admin/AdminListarComentarios";
import PageNotFound from "./pages/PageNotFound";

import { AuthProvider } from "./components/global/wrappers/AuthContext";
import ProtectedRoute from "./components/global/wrappers/ProtectedRoute";
import useSessionTimeout from "./components/global/utils/useSessionTimeout";

export default function App() {
  useSessionTimeout();
  const location = useLocation();
  return (
    <AuthProvider>
      <ErrorBoundary>

        <ScrollToTop />
        {/* Layout siempre visible, mantiene navbar/footer fijos */}
        <Layout>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/noticias-eventos" element={<ListaNoticias />} />
            <Route path="/noticias-eventos/:id" element={<DetalleNoticia />} />
            <Route path="/salon-comunal" element={<InfoSalonComunal />} />
            <Route path="/reserva-salon" element={<ReservaSalon />} />
            <Route path="/Comentarios" element={<Comentarios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/acceso-admn2-Y25a" element={<Login />} />

            {/* RUTAS ADMIN PROTEGIDAS */}
            <Route
              path="/panel-administrador"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-lista-reservas"
              element={
                <ProtectedRoute>
                  <AdminListarReservas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-lista-noticias"
              element={
                <ProtectedRoute>
                  <AdminListarNoticias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-crear-noticia"
              element={
                <ProtectedRoute>
                  <AdminCrearNoticias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-editar-noticia/:id"
              element={
                <ProtectedRoute>
                  <AdminEditarNoticias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-lista-comentarios"
              element={
                <ProtectedRoute>
                  <AdminListarComentarios />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </AuthProvider>
  );
}
