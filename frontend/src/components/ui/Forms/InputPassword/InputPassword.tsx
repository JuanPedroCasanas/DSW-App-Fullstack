import React from "react";

type InputPasswordProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPwd: boolean;
  toggleShowPwd: () => void;
  eyeIconUrl: string; // ver como hacer para esto ponerlo acá, sin necesidad de estar manejando el eyeIconUrl en cada vista
  label?: string; 
};



export function InputPassword({
  id,
  name,
  value,
  onChange,
  showPwd,
  toggleShowPwd,
  eyeIconUrl,
  label,
}: InputPasswordProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center border rounded-lg p-3 bg-white">
        <input
          id={id}
          name={name}
          type={showPwd ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          placeholder={label || "••••••••"}
        />
        <button
          type="button"
          onClick={toggleShowPwd}
          className="ml-2 p-1 focus:outline-none"
        >
          <img src={eyeIconUrl} alt="Mostrar/Ocultar" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

