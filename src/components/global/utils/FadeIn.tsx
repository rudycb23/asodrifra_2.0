import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";

type FadeInProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

const FadeIn: React.FC<FadeInProps> = ({ children, className = "", delay = 0 }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    return (
        <div
            className={`
    transition-all duration-1000
    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    ${className}
  `}
            style={{
                willChange: "opacity, transform",
                transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)"
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn;
