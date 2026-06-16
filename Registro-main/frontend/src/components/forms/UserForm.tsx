import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Usuario } from "../../types";

function buildSchema(isEdit: boolean) {
  return z.object({
    nombre: z.string().min(2, "El nombre es obligatorio."),
    correo: z.string().email("Correo inválido."),
    password: isEdit
      ? z.string().min(6, "Mínimo 6 caracteres.").or(z.literal(""))
      : z.string().min(6, "Mínimo 6 caracteres."),
    rol: z.enum(["ADMINISTRADOR", "REGISTRADOR"]),
  });
}

export type UserFormValues = {
  nombre: string;
  correo: string;
  password: string;
  rol: "ADMINISTRADOR" | "REGISTRADOR";
};

interface Props {
  initial?: Usuario;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ initial, onSubmit, onCancel }: Props) {
  const isEdit = Boolean(initial);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues: {
      nombre: initial?.nombre ?? "",
      correo: initial?.correo ?? "",
      password: "",
      rol: initial?.rol ?? "REGISTRADOR",
    },
  });

  async function submit(values: UserFormValues) {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "No se pudo guardar el usuario.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}
      <div>
        <label className="label">Nombre</label>
        <input className="input" {...register("nombre")} />
        {errors.nombre && <p className="field-error">{errors.nombre.message}</p>}
      </div>
      <div>
        <label className="label">Correo</label>
        <input className="input" {...register("correo")} />
        {errors.correo && <p className="field-error">{errors.correo.message}</p>}
      </div>
      <div>
        <label className="label">
          Contraseña {isEdit && <span className="text-slate-400">(dejar vacío para mantener)</span>}
        </label>
        <input type="password" className="input" {...register("password")} />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>
      <div>
        <label className="label">Rol</label>
        <select className="input" {...register("rol")}>
          <option value="REGISTRADOR">Registrador</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          {isEdit ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
