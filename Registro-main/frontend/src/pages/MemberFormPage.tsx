import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MemberForm, { MemberFormValues } from "../components/forms/MemberForm";
import { createMember, getMember, updateMember } from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { Miembro } from "../types";

export default function MemberFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initial, setInitial] = useState<Miembro | undefined>(undefined);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getMember(id)
      .then(setInitial)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: MemberFormValues & { foto: string | null }) {
    const payload = {
      ...values,
      correo: values.correo || null,
    };
    // LOG temporal: payload exacto enviado al backend.
    console.debug("[MemberFormPage] payload →", JSON.stringify(payload));
    if (isEdit && id) {
      const updated = await updateMember(id, payload);
      console.debug("[MemberFormPage] respuesta updateMember →", updated);
      navigate(`/members/${id}`);
    } else {
      const created = await createMember(payload);
      console.debug("[MemberFormPage] respuesta createMember →", created);
      navigate(`/members/${created.id}`);
    }
  }

  if (loading) return <div className="text-slate-500">Cargando…</div>;
  if (error) return <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/members" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        <ArrowLeft size={16} /> Volver al listado
      </Link>
      <div className="card p-6">
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          {isEdit ? "Editar Miembro" : "Registrar Miembro"}
        </h2>
        <MemberForm
          initial={initial}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? "Guardar cambios" : "Guardar Miembro"}
        />
      </div>
    </div>
  );
}
