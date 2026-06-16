import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Miembro } from "../../types";
import { fileToDataUrl, toDateInput } from "../../lib/utils";
import { getApiErrorMessage } from "../../api/client";

const schema = z.object({
  nombres: z.string().min(2, "Los nombres son obligatorios."),
  apellidos: z.string().min(2, "Los apellidos son obligatorios."),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos."),
  sexo: z.enum(["MASCULINO", "FEMENINO"]),
  estadoCivil: z.enum(["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO"]),
  profesion: z.string().min(2, "La profesión es obligatoria."),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  celular: z.string().regex(/^\d{6,15}$/, "Celular inválido (solo dígitos)."),
  correo: z.string().email("Correo inválido.").or(z.literal("")),
  direccion: z.string().min(3, "La dirección es obligatoria."),
});

export type MemberFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Miembro;
  onSubmit: (values: MemberFormValues & { foto: string | null }) => Promise<void>;
  submitLabel?: string;
}

export default function MemberForm({ initial, onSubmit, submitLabel = "Guardar Miembro" }: Props) {
  const [foto, setFoto] = useState<string | null>(initial?.foto ?? null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombres: initial?.nombres ?? "",
      apellidos: initial?.apellidos ?? "",
      dni: initial?.dni ?? "",
      sexo: initial?.sexo ?? "MASCULINO",
      estadoCivil: initial?.estadoCivil ?? "SOLTERO",
      profesion: initial?.profesion ?? "",
      fechaNacimiento: toDateInput(initial?.fechaNacimiento),
      celular: initial?.celular ?? "",
      correo: initial?.correo ?? "",
      direccion: initial?.direccion ?? "",
    },
  });

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setFoto(dataUrl);
  }

  async function submit(values: MemberFormValues) {
    setServerError(null);
    const payload = { ...values, foto };
    // LOG temporal de diagnóstico: payload exacto que se enviará al backend.
    console.debug("[MemberForm] Enviando payload:", payload);
    try {
      await onSubmit(payload);
    } catch (err) {
      // Antes se usaba err.message → en axios es el genérico
      // "La solicitud falló con el código de estado 409".
      // Ahora extraemos el mensaje descriptivo del backend (response.data.message).
      const message = getApiErrorMessage(err, "No se pudo guardar el miembro.");
      console.error("[MemberForm] Error al guardar miembro:", err, "→ mensaje:", message);
      setServerError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Fotografía */}
        <div className="md:col-span-1">
          <span className="label">Fotografía (opcional)</span>
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
              {foto ? (
                <>
                  <img src={foto} alt="Foto" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFoto(null)}
                    className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <ImagePlus className="text-slate-400" size={32} />
              )}
            </div>
            <label className="btn-ghost cursor-pointer">
              <ImagePlus size={16} />
              Subir foto
              <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </label>
          </div>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
          <div>
            <label className="label">Nombres</label>
            <input className="input" {...register("nombres")} />
            {errors.nombres && <p className="field-error">{errors.nombres.message}</p>}
          </div>
          <div>
            <label className="label">Apellidos</label>
            <input className="input" {...register("apellidos")} />
            {errors.apellidos && <p className="field-error">{errors.apellidos.message}</p>}
          </div>
          <div>
            <label className="label">DNI</label>
            <input className="input" maxLength={8} {...register("dni")} />
            {errors.dni && <p className="field-error">{errors.dni.message}</p>}
          </div>
          <div>
            <label className="label">Fecha de Nacimiento</label>
            <input type="date" className="input" {...register("fechaNacimiento")} />
            {errors.fechaNacimiento && (
              <p className="field-error">{errors.fechaNacimiento.message}</p>
            )}
          </div>
          <div>
            <label className="label">Sexo</label>
            <select className="input" {...register("sexo")}>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
            </select>
          </div>
          <div>
            <label className="label">Estado Civil</label>
            <select className="input" {...register("estadoCivil")}>
              <option value="SOLTERO">Soltero</option>
              <option value="CASADO">Casado</option>
              <option value="DIVORCIADO">Divorciado</option>
              <option value="VIUDO">Viudo</option>
            </select>
          </div>
          <div>
            <label className="label">Profesión</label>
            <input className="input" {...register("profesion")} />
            {errors.profesion && <p className="field-error">{errors.profesion.message}</p>}
          </div>
          <div>
            <label className="label">Celular</label>
            <input className="input" {...register("celular")} />
            {errors.celular && <p className="field-error">{errors.celular.message}</p>}
          </div>
          <div>
            <label className="label">Correo (opcional)</label>
            <input className="input" {...register("correo")} />
            {errors.correo && <p className="field-error">{errors.correo.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Dirección</label>
            <input className="input" {...register("direccion")} />
            {errors.direccion && <p className="field-error">{errors.direccion.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
