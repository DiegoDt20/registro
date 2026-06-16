import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, IdCard, Pencil, Trash2 } from "lucide-react";
import { deleteMember, getMember } from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  ESTADO_CIVIL_LABELS,
  Miembro,
  SEXO_LABELS,
} from "../types";
import { formatDate, fullName, initials } from "../lib/utils";
import CredentialModal from "../components/CredentialModal";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMINISTRADOR";

  const [member, setMember] = useState<Miembro | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCredential, setShowCredential] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMember(id)
      .then(setMember)
      .catch((err) => setError(getApiErrorMessage(err)));
  }, [id]);

  async function handleDelete() {
    if (!member) return;
    if (!confirm(`¿Eliminar a ${fullName(member.nombres, member.apellidos)}?`)) return;
    try {
      await deleteMember(member.id);
      navigate("/members");
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  }

  if (error) return <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>;
  if (!member) return <div className="text-slate-500">Cargando…</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <Link
          to="/members"
          className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"
        >
          <ArrowLeft size={16} /> Volver al listado
        </Link>
        <div className="flex gap-2">
          <button className="btn-gold" onClick={() => setShowCredential(true)}>
            <IdCard size={16} /> Generar Credencial
          </button>
          <button className="btn-ghost" onClick={() => navigate(`/members/${member.id}/edit`)}>
            <Pencil size={16} /> Editar
          </button>
          {isAdmin && (
            <button className="btn-danger" onClick={handleDelete}>
              <Trash2 size={16} /> Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-3xl font-bold text-brand-700">
              {member.foto ? (
                <img src={member.foto} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(member.nombres, member.apellidos)
              )}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                member.activo ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {member.activo ? "ACTIVO" : "INACTIVO"}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">
              {fullName(member.nombres, member.apellidos)}
            </h2>
            <p className="font-mono text-sm font-semibold text-gold-600">{member.codigoMiembro}</p>

            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <Field label="DNI" value={member.dni} />
              <Field label="Profesión" value={member.profesion} />
              <Field label="Sexo" value={SEXO_LABELS[member.sexo]} />
              <Field label="Estado civil" value={ESTADO_CIVIL_LABELS[member.estadoCivil]} />
              <Field label="Fecha de nacimiento" value={formatDate(member.fechaNacimiento)} />
              <Field label="Celular" value={member.celular} />
              <Field label="Correo" value={member.correo} />
              <Field label="Dirección" value={member.direccion} />
              <Field label="Fecha de registro" value={formatDate(member.createdAt)} />
            </div>
          </div>
        </div>
      </div>

      {showCredential && (
        <CredentialModal member={member} onClose={() => setShowCredential(false)} />
      )}
    </div>
  );
}
