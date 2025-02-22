import React from "react";

interface TextAreaProps {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    name,
    placeholder = "",
    required = false,
}) => {
    return (
        <div className="flex flex-col md:col-span-2">
            <label htmlFor={name} className="mb-1 font-medium text-gray-700">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                required={required}
                placeholder={placeholder}
                className="h-24 p-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
    );
};

export default TextArea;
