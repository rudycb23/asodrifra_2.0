import React from "react";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 text-center py-3 shadow">
            <p className="mb-0 text-gray-700 font-medium">
                &copy; {currentYear} Asociación de Desarrollo Integral de San Francisco de Goicoechea
            </p>
        </footer>
    );
};

export default Footer;
