import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROL_LABELS } from "../types";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <h1 className="text-lg font-semibold text-brand-800">
        Sistema de Gestión de Miembros
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-right">
          <UserCircle2 className="text-brand-700" size={32} />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">{user?.nombre}</p>
            <p className="text-xs text-slate-500">{user ? ROL_LABELS[user.rol] : ""}</p>
          </div>
        </div>
        <button
          onClick={() => setShowChangePassword(true)}
          className="btn-ghost"
          title="Cambiar contraseña"
        >
          <KeyRound size={16} />
          <span className="hidden sm:inline">Contraseña</span>
        </button>
        <button onClick={handleLogout} className="btn-ghost" title="Cerrar sesión">
          <LogOut size={16} />
          Salir
        </button>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </header>
  );
}
