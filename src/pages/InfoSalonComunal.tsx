import React, { useState, Suspense, lazy } from "react";
import FadeIn from "../components/global/utils/FadeIn";

const InformacionGeneral = lazy(() => import("../components/InfoSalonComunal/InformacionGeneral"));
const ReservaSalon = lazy(() => import("../components/InfoSalonComunal/ReservaSalon"));
const CaracteristicasSalon = lazy(() => import("../components/InfoSalonComunal/CaracteristicasSalon"));
const TarifaHorarios = lazy(() => import("../components/InfoSalonComunal/TarifaHorarios"));
const InfoFinal = lazy(() => import("../components/InfoSalonComunal/InfoFinal"));
const CaruselImagenes = lazy(() => import("../components/InfoSalonComunal/CaruselImagenes"));

const imagenes = [
  "/assets/salon1.jpg",
  "/assets/salon2.jpg",
  "/assets/salon3.jpg"
];

const InfoSalonComunal: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [carousel, setCarousel] = useState(0);

  return (
    <div className="max-w-6xl mx-auto mt-8 py-10 px-2">
      <Suspense fallback={<div className="py-20 text-center font-bold text-green-700 animate-pulse">Cargando sección...</div>}>
        <FadeIn delay={0}>
          <div className="flex flex-col md:flex-row gap-8 mb-8">

          <InformacionGeneral />
          <ReservaSalon
            imagen={imagenes[0]}
            onImgClick={() => { setModalImg(imagenes[0]); setModalOpen(true); }}
          />
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <CaracteristicasSalon />
        </FadeIn>
        <FadeIn delay={400}>
          <TarifaHorarios />
        </FadeIn>
        <FadeIn delay={600}>
          <InfoFinal />
        </FadeIn>
        <FadeIn delay={800}>
          <CaruselImagenes
            imagenes={imagenes}
            carousel={carousel}
            setCarousel={setCarousel}
            setModalOpen={setModalOpen}
            setModalImg={setModalImg}
            modalOpen={modalOpen}
            modalImg={modalImg}
          />
        </FadeIn>
      </Suspense>
    </div>
  );
};

export default InfoSalonComunal;
