import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus, X } from "lucide-react";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  UserPayload,
} from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ROL_LABELS, Usuario } from "../types";
import { formatDate } from "../lib/utils";
import UserForm, { UserFormValues } from "../components/forms/UserForm";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(u: Usuario) {
    setEditing(u);
    setShowForm(true);
  }

  async function handleSubmit(values: UserFormValues) {
    const payload: UserPayload = {
      nombre: values.nombre,
      correo: values.correo,
      rol: values.rol,
    };
    if (values.password) payload.password = values.password;

    if (editing) {
      await updateUser(editing.id, payload);
    } else {
      await createUser(payload);
    }
    setShowForm(false);
    await load();
  }

  async function handleDelete(u: Usuario) {
    if (!confirm(`¿Eliminar al usuario ${u.nombre}?`)) return;
    try {
      await deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Usuarios del sistema</h2>
        <button className="btn-primary" onClick={openNew}>
          <UserPlus size={16} /> Nuevo Usuario
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Cargando…
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.nombre}</td>
                  <td className="px-4 py-3">{u.correo}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.rol === "ADMINISTRADOR"
                          ? "bg-brand-100 text-brand-700"
                          : "bg-gold-400/30 text-gold-600"
                      }`}
                    >
                      {ROL_LABELS[u.rol]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="rounded-md p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                        onClick={() => openEdit(u)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        onClick={() => handleDelete(u)}
                        disabled={u.id === user?.id}
                        title={u.id === user?.id ? "No puedes eliminarte" : "Eliminar"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-semibold text-brand-800">
                {editing ? "Editar usuario" : "Nuevo usuario"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <UserForm
                initial={editing ?? undefined}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
