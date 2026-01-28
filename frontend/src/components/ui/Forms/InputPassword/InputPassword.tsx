import React from "react";

type InputPasswordProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPwd: boolean;
  toggleShowPwd: () => void;
  label?: string;
};

export function InputPassword({
  id,
  name,
  value,
  onChange,
  showPwd,
  toggleShowPwd,
  label,
}: InputPasswordProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPwd ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="border rounded-lg p-3 w-full pr-10"
          placeholder={label || "••••••••"}
        />

        {/* Botón del ojo */}
        <button
          type="button"
          onClick={toggleShowPwd}
          className="absolute inset-y-0 right-2 flex items-center"
        >
          <img
            src="/icons/eyeicon.png"
            alt="Mostrar/Ocultar contraseña"
            className="w-5 h-5 opacity-70 hover:opacity-100"
          />
        </button>
      </div>
    </div>
  );
}