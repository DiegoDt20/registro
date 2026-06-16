import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, KeyRound, Loader2, X } from "lucide-react";
import { changePassword } from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";

const schema = z
  .object({
    actual: z.string().min(1, "La contraseña actual es obligatoria."),
    nueva: z.string().min(6, "Mínimo 6 caracteres."),
    confirmar: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((data) => data.nueva === data.confirmar, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmar"],
  })
  .refine((data) => data.actual !== data.nueva, {
    message: "La nueva contraseña debe ser distinta de la actual.",
    path: ["nueva"],
  });

type Values = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setServerError(null);
    try {
      await changePassword(values.actual, values.nueva);
      setSuccess(true);
    } catch (err) {
      setServerError(getApiErrorMessage(err, "No se pudo cambiar la contraseña."));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-brand-800">
            <KeyRound size={18} /> Cambiar contraseña
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="text-green-500" size={44} />
            <p className="text-lg font-semibold text-slate-800">Contraseña actualizada</p>
            <p className="text-sm text-slate-500">
              Tu contraseña se cambió correctamente.
            </p>
            <button className="btn-primary mt-2" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
            {serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}
            <div>
              <label className="label">Contraseña actual</label>
              <input type="password" className="input" {...register("actual")} />
              {errors.actual && <p className="field-error">{errors.actual.message}</p>}
            </div>
            <div>
              <label className="label">Nueva contraseña</label>
              <input type="password" className="input" {...register("nueva")} />
              {errors.nueva && <p className="field-error">{errors.nueva.message}</p>}
            </div>
            <div>
              <label className="label">Confirmar nueva contraseña</label>
              <input type="password" className="input" {...register("confirmar")} />
              {errors.confirmar && <p className="field-error">{errors.confirmar.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
