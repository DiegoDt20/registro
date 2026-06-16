import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, IdCard, Search, UserPlus } from "lucide-react";
import {
  deleteMember,
  getMembers,
  MemberQuery,
} from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  ESTADO_CIVIL_LABELS,
  Miembro,
  SEXO_LABELS,
} from "../types";
import { fullName } from "../lib/utils";
import { formatDate } from "../lib/utils";
import CredentialModal from "../components/CredentialModal";

export default function Members() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.rol === "ADMINISTRADOR";

  const [members, setMembers] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentialFor, setCredentialFor] = useState<Miembro | null>(null);

  const [filters, setFilters] = useState<MemberQuery>({
    search: "",
    profesion: "",
    sexo: "",
    estadoCivil: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clean: MemberQuery = {};
      if (filters.search) clean.search = filters.search;
      if (filters.profesion) clean.profesion = filters.profesion;
      if (filters.sexo) clean.sexo = filters.sexo;
      if (filters.estadoCivil) clean.estadoCivil = filters.estadoCivil;
      setMembers(await getMembers(clean));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleDelete(m: Miembro) {
    if (!confirm(`¿Eliminar a ${fullName(m.nombres, m.apellidos)}? Esta acción no se puede deshacer.`))
      return;
    try {
      await deleteMember(m.id);
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Miembros</h2>
        <Link to="/members/new" className="btn-primary">
          <UserPlus size={16} />
          Nuevo Miembro
        </Link>
      </div>

      {/* Filtros */}
      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            className="input pl-9"
            placeholder="DNI, nombre o código…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <input
          className="input"
          placeholder="Profesión"
          value={filters.profesion}
          onChange={(e) => setFilters((f) => ({ ...f, profesion: e.target.value }))}
        />
        <select
          className="input"
          value={filters.sexo}
          onChange={(e) => setFilters((f) => ({ ...f, sexo: e.target.value }))}
        >
          <option value="">Todos los sexos</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
        </select>
        <select
          className="input"
          value={filters.estadoCivil}
          onChange={(e) => setFilters((f) => ({ ...f, estadoCivil: e.target.value }))}
        >
          <option value="">Todo estado civil</option>
          <option value="SOLTERO">Soltero</option>
          <option value="CASADO">Casado</option>
          <option value="DIVORCIADO">Divorciado</option>
          <option value="VIUDO">Viudo</option>
        </select>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Nombre completo</th>
                <th className="px-4 py-3">Profesión</th>
                <th className="px-4 py-3">Sexo</th>
                <th className="px-4 py-3">Estado civil</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Cargando…
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron miembros.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold text-brand-700">
                      {m.codigoMiembro}
                    </td>
                    <td className="px-4 py-3">{m.dni}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {fullName(m.nombres, m.apellidos)}
                    </td>
                    <td className="px-4 py-3">{m.profesion}</td>
                    <td className="px-4 py-3">{SEXO_LABELS[m.sexo]}</td>
                    <td className="px-4 py-3">{ESTADO_CIVIL_LABELS[m.estadoCivil]}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(m.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Ver"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                          onClick={() => navigate(`/members/${m.id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Editar"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                          onClick={() => navigate(`/members/${m.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Generar credencial"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-gold-100 hover:text-gold-600"
                          onClick={() => setCredentialFor(m)}
                        >
                          <IdCard size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            title="Eliminar"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(m)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {credentialFor && (
        <CredentialModal member={credentialFor} onClose={() => setCredentialFor(null)} />
      )}
    </div>
  );
}
