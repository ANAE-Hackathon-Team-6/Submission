import React from "react";

const Navbar: React.FC = () => {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 ">
            <div className="flex justify-center ">
                <div className="w-full max-w-3xl px-8 py-2 bg-green-600 rounded-xl bg-opacity-60">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="text-xl font-bold text-white">Beta</div>
                        <div className="flex space-x-4">
                        <p  className="text-white visited:text-white hover:text-gray-100">
                            Accueil
                        </p>
                        <p className="text-white hover:text-gray-100">
                            Activités
                        </p>
                        <p className="text-white hover:text-gray-100">
                            Program
                        </p>
                        <p className="text-white hover:text-gray-100">
                            Contact
                        </p>
                        <p className="text-white hover:text-gray-100">
                            Proposer une activité
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
