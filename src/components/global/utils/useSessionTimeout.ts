import { useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";

const TIMEOUT_DURATION = 1800000; // 30 minutos

const useSessionTimeout = () => {
    const auth = getAuth();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Acciones que "resetean" el timer
        const events = [
            "mousemove",
            "mousedown",
            "keypress",
            "touchmove",
            "scroll",
            "click",
            "focus"
        ];

        const resetTimeout = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                signOut(auth)
                    .then(() => {
                        window.location.href = "/";
                        console.log("Sesión cerrada por inactividad.");
                    })
                    .catch((error) => console.error("Error al cerrar sesión:", error));
            }, TIMEOUT_DURATION);
        };

        events.forEach((event) =>
            window.addEventListener(event, resetTimeout, { passive: true })
        );
        resetTimeout();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimeout)
            );
        };
    }, [auth]);
};

export default useSessionTimeout;
