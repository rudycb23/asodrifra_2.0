import FadeIn from "../../components/global/utils/FadeIn";
import { useParallaxBackground } from "./hooks/useParallaxBackground";

const Hero = () => {
    const parallaxRef = useParallaxBackground(0.2);

    return (
        <FadeIn>
            <div
                ref={parallaxRef}
                className="hero-section min-h-screen flex items-center justify-center"
                style={{
                    backgroundImage: "url('/assets/Logo Asociación de Desarrollo Integral de San Francisco de Goicoechea.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundColor: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    color: "#fff",
                    textAlign: "center"
                }}
            >
                {/* Overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0, left: 0, width: "100%", height: "100%",
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 1
                    }}
                />
                {/* Texto Hero */}
                <div className="hero-text" style={{ position: "relative", zIndex: 2 }}>
                    <h1>Bienvenidos a la Comunidad de San Francisco</h1>
                    <p>Un lugar donde el progreso, la cultura y la comunidad se unen.</p>
                </div>
            </div>
        </FadeIn>
    );
};

export default Hero;
