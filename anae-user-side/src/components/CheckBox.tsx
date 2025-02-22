import React from "react";

interface CheckboxProps {
    label: string;
    name: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, name }) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={name}
                name={name}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor={name} className="text-gray-700">
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
