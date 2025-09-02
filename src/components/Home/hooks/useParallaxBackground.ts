import { useEffect, useRef } from "react";

export function useParallaxBackground(factor = 0.3, maxMobileOffset = 80) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Limita el offset en mobile, siempre centrado
        const offset = Math.min(y * factor, maxMobileOffset);
        ref.current.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      } else {
        ref.current.style.backgroundPosition = `center ${y * factor}px`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [factor, maxMobileOffset]);

  return ref;
}
