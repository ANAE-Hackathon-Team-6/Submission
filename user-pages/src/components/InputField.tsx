import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    placeholder,
    required,
    type = "text",
    value,
    onChange
}) => {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className="w-full p-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
    );
};

export default InputField;
