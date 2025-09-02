import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa";

interface Props {
    imagenes: string[];
    carousel: number;
    setCarousel: (n: number) => void;
    setModalOpen: (b: boolean) => void;
    setModalImg: (s: string | null) => void;
    modalOpen: boolean;
    modalImg: string | null;
}

const placeholder = "/assets/placeholder.jpg";

const CaruselImagenes: React.FC<Props> = ({
    imagenes,
    carousel,
    setCarousel,
    setModalOpen,
    setModalImg,
    modalOpen,
    modalImg,
}) => {
    const [zoomed, setZoomed] = useState(false);
    const [drag, setDrag] = useState({ x: 0, y: 0 });
    const [start, setStart] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (modalOpen) {
            setModalImg(imagenes[carousel] || placeholder);
        }
        if (!modalOpen) setZoomed(false);
        // eslint-disable-next-line
    }, [carousel, modalOpen]);

    useEffect(() => {
        if (modalOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [modalOpen]);

    const prev = () => setCarousel((carousel - 1 + imagenes.length) % imagenes.length);
    const next = () => setCarousel((carousel + 1) % imagenes.length);

    const showImg = imagenes[carousel] || placeholder;

    // --- ZOOM & DRAG HANDLERS ---
    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!zoomed) return;
        const clientX = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as any).clientY;
        setStart({ x: clientX - drag.x, y: clientY - drag.y });
        (document.body as any).style.cursor = "grabbing";
    };
    const duringDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!start || !zoomed) return;
        const clientX = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as any).clientY;
        setDrag({
            x: clientX - start.x,
            y: clientY - start.y,
        });
    };
    const endDrag = () => {
        setStart(null);
        (document.body as any).style.cursor = "";
    };

    return (
        <div className="my-8 flex-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-success text-center font-bold mb-4 text-2xl">
                Galería del Salón
            </h2>
            <div className="relative w-full max-w-2xl mx-auto">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg h-64 md:h-80">
                    {showImg && (
                        <img
                            src={showImg}
                            alt={`Imagen ${carousel + 1} del salón`}
                            className="object-cover w-full h-full cursor-pointer"
                            onClick={() => setModalOpen(true)}
                            onError={e => (e.currentTarget.src = placeholder)}
                            draggable={false}
                            tabIndex={0}
                        />
                    )}
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 p-2 rounded-full shadow-md"
                        aria-label="Anterior"
                        tabIndex={0}
                    >
                        <FaChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 p-2 rounded-full shadow-md"
                        aria-label="Siguiente"
                        tabIndex={0}
                    >
                        <FaChevronRight size={24} />
                    </button>
                    <button
                        className="absolute right-2 bottom-2 bg-white/80 hover:bg-green-100 p-2 rounded-full shadow"
                        onClick={() => setModalOpen(true)}
                        aria-label="Expandir"
                        tabIndex={0}
                    >
                        <FaExpand />
                    </button>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                    {imagenes.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCarousel(i)}
                            className={`h-3 w-3 rounded-full ${carousel === i ? "bg-green-700" : "bg-gray-300"}`}
                            aria-label={`Ir a la imagen ${i + 1}`}
                            tabIndex={0}
                        />
                    ))}
                </div>
            </div>
            {/* MODAL */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={() => setModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                >
                    <div
                        className="relative max-w-5xl w-full p-2 flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Botón cerrar, arriba derecha */}
                        <button
                            className="absolute top-4 right-4 bg-white/90 hover:bg-green-200 text-green-900 px-4 py-2 rounded shadow-lg z-20"
                            onClick={() => setModalOpen(false)}
                            aria-label="Cerrar"
                            tabIndex={0}
                        >
                            Cerrar ✕
                        </button>
                        {/* Flechas */}
                        <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 p-3 rounded-full shadow-lg z-20"
                            onClick={e => { e.stopPropagation(); prev(); }}
                            aria-label="Anterior"
                            tabIndex={0}
                        >
                            <FaChevronLeft size={30} />
                        </button>
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 p-3 rounded-full shadow-lg z-20"
                            onClick={e => { e.stopPropagation(); next(); }}
                            aria-label="Siguiente"
                            tabIndex={0}
                        >
                            <FaChevronRight size={30} />
                        </button>
                        <img
                            src={modalImg || placeholder}
                            alt="Imagen grande"
                            className={
                                zoomed
                                    ? "rounded-xl cursor-zoom-out bg-white shadow-lg max-h-none max-w-none w-auto h-auto"
                                    : "rounded-xl cursor-zoom-in bg-white shadow-lg max-h-[90vh] w-auto"
                            }
                            onDoubleClick={() => {
                                setZoomed(z => !z);
                                setDrag({ x: 0, y: 0 });
                            }}
                            onError={e => (e.currentTarget.src = placeholder)}
                            draggable={false}
                            style={{
                                maxWidth: zoomed ? "none" : "96vw",
                                maxHeight: zoomed ? "none" : "90vh",
                                boxShadow: "0 8px 40px #0002",
                                transform: zoomed
                                    ? `scale(1.8) translate(${drag.x}px, ${drag.y}px)`
                                    : "none",
                                transition: start ? "none" : "transform 0.2s"
                            }}
                            onMouseDown={e => { if (zoomed) startDrag(e); }}
                            onMouseMove={e => { if (start && zoomed) duringDrag(e); }}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                            onTouchStart={e => { if (zoomed) startDrag(e); }}
                            onTouchMove={e => { if (start && zoomed) duringDrag(e); }}
                            onTouchEnd={endDrag}
                            onTouchCancel={endDrag}
                        />
                        <p className="text-center text-sm text-gray-200 mt-2">
                            Doble click para {zoomed ? "restaurar" : "hacer zoom"}{zoomed ? " / Arrastra la imagen para mover" : ""}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaruselImagenes;
