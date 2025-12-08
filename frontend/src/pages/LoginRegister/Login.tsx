import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

// import eyeIcon from "./eyeicon.png"; //Buscar una forma de que esto ande

import { Toast, FormField,  InputPassword } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { setAccessToken } from "@/common/utils/auth/TokenStorage";
import { HandleErrorResponse } from "@/common/utils";
import { useAuth } from "@/common/utils/auth/AuthContext";

export default function Login() {
  const [datos, setDatos] = useState({
    mail: "",
    password: "",
    isActive: true,
  });
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const eyeIconUrl = new URL("./eyeicon.png", import.meta.url).href; //Pasar a componente
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { setUser } = useAuth();

useEffect(() => {
    const toastData = (navigate as any).location?.state?.toastMessage;

    if (toastData) {
        setToast(toastData);
    }
}, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   let { name, value } = e.target;
   let newDatos = { ...datos, [name]: value };
  setDatos(newDatos);
  }
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!datos.mail || !datos.password) {
        const toastData = { 
            message: "Por favor, ingrese su correo electrónico y contraseña.", 
            type: "error" as const 
        };
        setToast(toastData); 
        return}; 
    try {

    const res = await fetch("http://localhost:2000/User/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!res.ok) {
      const toastData = await HandleErrorResponse(res); //Use este, crear un handleResponse de user
      setToast(toastData);
      return;
    }

    const data = await res.json();

    setAccessToken(data.accessToken);
    setUser(data.user);
    
    const name = data.name;
    console.log('Nombre usado para el toast:', name);
    const toastData = { 
        message: "¡Bienvenido ${name}!",
        type: "success" as const
    };
   
    navigate("/", { state: { toastMessage: toastData } });
    
  
    } catch (error) {
    alert("Error de conexión con el servidor");
    console.error(error);
    };
  }

return (


<Page>
    <main className="min-h-[calc(100vh-var(--nav-h))] flex justify-center items-start p-4 pt-10">

    <form
        className="mt-8 w-full max-w-[420px] bg-white text-[#111] rounded-xl p-6 grid gap-6"
      noValidate
    >
      {/* Encabezado */}
      <div className="text-center">
         <SectionHeader title="Bienvenido a Narrativas" />
      </div>

      <div className="text-center">
        <NavLink
          to="/register"
          className="text-[20px] font-medium text-cyan-600 underline whitespace-nowrap"
        >
          ¿Primera vez? Registrarse
        </NavLink>
      </div>

      {/* Email */}
      <FormField label="Correo electrónico" htmlFor="mail">
        <div className="flex items-center gap-2 w-full border border-[#b5b6b7] rounded-[10px] bg-white px-4 py-[14px]">
          <input
            id="mail"
            name="mail"
            type="email"
            className="flex-1 w-full border-0 outline-0 bg-transparent text-[16px] leading-[22px] text-black placeholder:text-[#7d7d7d]"
            placeholder="psico@narrativas.com.ar"
            value={datos.mail}
            onChange={handleInputChange}
            autoComplete="email"
            required
          />
        </div>
      </FormField>

      {/* Password */}
      <FormField label="Contraseña" htmlFor="password">
        <InputPassword
          id="password"
          name="password"
          value={datos.password}
          onChange={handleInputChange}
          showPwd={showPwd}
          toggleShowPwd={() => setShowPwd(v => !v)}
          eyeIconUrl={eyeIconUrl}
        />
      </FormField>

      {/* CTA + fila inferior */}
      <div className="grid gap-4">
        <button
          type="submit"
          className="w-full rounded-[10px] px-3 py-[13px] bg-cyan-600 text-white text-[16px] font-bold leading-[22px] hover:brightness-95 active:translate-y-[1px] transition-[filter,transform] duration-150 ease-in-out"
        >
          Iniciar sesión
        </button>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2">
            <input
              className="w-[18px] h-[18px]"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="text-[16px] font-normal text-black">Recordarme</span>
          </label>

          <NavLink
            to="/forgot-password"
            className="text-[16px] font-medium text-cyan-600 whitespace-nowrap no-underline"
          >
            ¿Olvidaste tu contraseña?
          </NavLink>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  </main>
</Page>

  );
}