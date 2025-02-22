import React from "react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="px-6 py-2 text-white transition-colors duration-300 bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            {text}
        </button>
    );
};

export default Button;
