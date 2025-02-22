import React from "react";

interface SelectFieldProps {
    label: string;
    name: string;
    options: string[];
    required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    options,
    required = false,
}) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-medium text-gray-700">
                {label}
            </label>
            <select
                id={name}
                name={name}
                required={required}
                className="p-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="">Sélectionnez</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
