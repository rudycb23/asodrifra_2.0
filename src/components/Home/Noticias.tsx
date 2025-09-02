import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaDotCircle, FaRegDotCircle } from "react-icons/fa";

type Noticia = {
  id: string;
  titulo?: string;
  contenido: string[];
  imagenes?: string[];
};
type NoticiasProps = {
  noticias: Noticia[];
};

const AUTO_PLAY_INTERVAL = 5000;

const Noticias: React.FC<NoticiasProps> = ({ noticias }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (noticias.length <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setCurrent((c) => (c + 1) % noticias.length),
      AUTO_PLAY_INTERVAL
    );
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, noticias.length]);

  if (!noticias.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + noticias.length) % noticias.length);
  const next = () => setCurrent((c) => (c + 1) % noticias.length);
  const goTo = (i: number) => setCurrent(i);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 md:p-8">
        <div className="relative w-full select-none">
          <div className="relative h-[440px] md:h-[560px] rounded-xl overflow-hidden flex items-center justify-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={noticias[current].id}
                className="absolute w-full h-full flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <img
                  src={noticias[current].imagenes?.[0]
                    ? `https://asodisfra.com${noticias[current].imagenes[0]}`
                    : "/images/default.jpg"}
                  alt={noticias[current].titulo}
                  className="object-contain bg-white w-full max-h-[420px] md:max-h-[520px] rounded-t-xl mx-auto"
                  draggable={false}
                />

                <div className="bg-white w-full p-4 rounded-b-xl">
                  <h5 className="font-bold mb-1 text-lg truncate">{noticias[current].titulo || "Sin título"}</h5>
                  <p className="text-gray-600 text-sm">{noticias[current].contenido?.[0]?.slice(0, 185) ?? ""}...</p>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Flechas */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 p-2 rounded-full shadow-md z-10"
              aria-label="Anterior"
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 p-2 rounded-full shadow-md z-10"
              aria-label="Siguiente"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-2">
            {noticias.map((_, i) =>
              <button key={i} onClick={() => goTo(i)} className="focus:outline-none">
                {i === current
                  ? <FaDotCircle className="text-green-700" />
                  : <FaRegDotCircle className="text-gray-400" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noticias;
