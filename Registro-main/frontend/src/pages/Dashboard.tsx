import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, User, UserRound, Briefcase } from "lucide-react";
import StatsCard from "../components/StatsCard";
import MemberCard from "../components/MemberCard";
import { getDashboardStats } from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { DashboardStats } from "../types";

const MES_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function mesLabel(key: string) {
  const [, m] = key.split("-");
  return MES_LABELS[Number(m) - 1] ?? key;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err)));
  }, []);

  if (error) {
    return <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>;
  }

  if (!stats) {
    return <div className="text-slate-500">Cargando estadísticas…</div>;
  }

  const chartData = stats.crecimientoMensual.map((m) => ({ mes: mesLabel(m.mes), total: m.total }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total de miembros" value={stats.total} icon={<Users size={22} />} accent="brand" />
        <StatsCard title="Hombres" value={stats.hombres} icon={<User size={22} />} accent="blue" />
        <StatsCard title="Mujeres" value={stats.mujeres} icon={<UserRound size={22} />} accent="pink" />
        <StatsCard
          title="Profesiones distintas"
          value={stats.profesiones.length}
          icon={<Briefcase size={22} />}
          accent="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Crecimiento mensual */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Crecimiento mensual (últimos 6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#1e3a5f" radius={[6, 6, 0, 0]} name="Nuevos miembros" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profesiones más frecuentes */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Profesiones más frecuentes</h3>
          {stats.profesiones.length === 0 ? (
            <p className="text-sm text-slate-400">Sin datos aún.</p>
          ) : (
            <ul className="space-y-3">
              {stats.profesiones.map((p) => {
                const max = stats.profesiones[0].total || 1;
                return (
                  <li key={p.profesion}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{p.profesion}</span>
                      <span className="text-slate-500">{p.total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gold-500"
                        style={{ width: `${(p.total / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Últimos registrados */}
      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Últimos miembros registrados</h3>
        {stats.ultimos.length === 0 ? (
          <p className="text-sm text-slate-400">Aún no hay miembros registrados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.ultimos.map((m) => (
              <MemberCard key={m.id} member={{ ...m, apellidos: m.apellidos }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
