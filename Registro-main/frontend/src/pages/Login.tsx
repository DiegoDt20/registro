import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn, ShieldHalf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/client";

const schema = z.object({
  correo: z.string().email("Correo inválido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

type Values = z.infer<typeof schema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      await login(values.correo, values.password);
      const to = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";
      navigate(to, { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err, "No se pudo iniciar sesión."));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-brand-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-brand-900">
            <ShieldHalf size={34} />
          </div>
          <h1 className="text-xl font-bold">Gestión de Miembros</h1>
          <p className="text-sm text-slate-300">Credenciales Digitales</p>
        </div>

        <div className="card p-8">
          <h2 className="mb-6 text-lg font-semibold text-brand-800">Iniciar sesión</h2>
          {serverError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Correo</label>
              <input className="input" placeholder="admin@registro.com" {...register("correo")} />
              {errors.correo && <p className="field-error">{errors.correo.message}</p>}
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />}
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
