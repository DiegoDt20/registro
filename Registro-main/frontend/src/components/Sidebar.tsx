import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ShieldCheck,
  ShieldHalf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Rol } from "../types";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: Rol[];
}

const items: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ["ADMINISTRADOR"] },
  { to: "/members", label: "Miembros", icon: <Users size={18} /> },
  { to: "/validate", label: "Validación", icon: <ShieldCheck size={18} /> },
  { to: "/users", label: "Usuarios", icon: <UserCog size={18} />, roles: ["ADMINISTRADOR"] },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visible = items.filter((i) => !i.roles || (user && i.roles.includes(user.rol)));

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-brand-900 text-slate-100 md:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-brand-900">
          <ShieldHalf size={22} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold">Registro</p>
          <p className="text-xs text-slate-400">Miembros y Credenciales</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-gold-500 text-brand-900"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} Organización
      </div>
    </aside>
  );
}
