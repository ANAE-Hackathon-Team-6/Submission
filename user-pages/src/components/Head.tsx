import React from "react";

const Header = () => {
    return (
        <div className="relative w-full h-[400px] bg-cover bg-center text-white" style={{ backgroundImage: "url('banner-bg.png')" }}>
            {/* Overlay */}
            <div className="absolute inset-0  bg-opacity-50"></div>

            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-opacity-70">
                <div className="text-lg font-bold">Beta <span className="text-gray-400 text-sm">version</span></div>
                <ul className="flex space-x-6 text-sm">
                    <li><a href="#" className="hover:text-gray-300">Accueil</a></li>
                    <li><a href="#" className="hover:text-gray-300">Actualités</a></li>
                    <li><a href="#" className="hover:text-gray-300">À propos</a></li>
                    <li><a href="#" className="hover:text-gray-300">Contact</a></li>
                    <li><a href="#" className="hover:text-gray-300">Mon compte</a></li>
                    <li><a href="#" className="hover:text-gray-300">Proposer une activité</a></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold">PROPOSER UNE ACTIVITÉ</h1>
                <p className="text-xl md:text-2xl mt-2">اقترح نشاط</p>
            </div>
        </div>
    );
};

export default Header;