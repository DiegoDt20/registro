import { useState } from "react";
import { CheckCircle2, XCircle, Search, Loader2 } from "lucide-react";
import { validateByCodigo, validateByDni } from "../api/endpoints";
import { getApiErrorMessage } from "../api/client";
import { ValidationResult } from "../types";
import { initials } from "../lib/utils";

type Mode = "codigo" | "dni";

export default function Validate() {
  const [mode, setMode] = useState<Mode>("codigo");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res =
        mode === "codigo"
          ? await validateByCodigo(value.trim())
          : await validateByDni(value.trim());
      setResult(res);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Validar Miembro</h2>

      <div className="card p-6">
        <div className="mb-4 flex gap-2">
          <button
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "codigo" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
            onClick={() => setMode("codigo")}
          >
            Por Código
          </button>
          <button
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              mode === "dni" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
            onClick={() => setMode("dni")}
          >
            Por DNI
          </button>
          <button
            className="flex-1 cursor-not-allowed rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-300"
            disabled
            title="Disponible en una fase futura"
          >
            Escanear QR
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="input"
            placeholder={mode === "codigo" ? "Ej. MEM-000001" : "Ej. 12345678"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            Validar
          </button>
        </form>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {result && (result.valido && result.miembro ? (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 bg-green-600 px-6 py-3 text-white">
            <CheckCircle2 size={22} />
            <span className="text-lg font-bold tracking-wide">VÁLIDO</span>
          </div>
          <div className="flex items-center gap-5 p-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-xl font-bold text-brand-700">
              {result.miembro.foto ? (
                <img src={result.miembro.foto} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(result.miembro.nombres, result.miembro.apellidos)
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-800">
                {result.miembro.nombres} {result.miembro.apellidos}
              </p>
              <p className="text-sm text-slate-600">{result.miembro.profesion}</p>
              <p className="text-sm text-slate-500">DNI: {result.miembro.dni}</p>
              <p className="font-mono text-sm font-semibold text-gold-600">
                {result.miembro.codigoMiembro}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center gap-2 p-8 text-center">
          <XCircle className="text-red-500" size={40} />
          <p className="text-lg font-bold text-slate-800">MIEMBRO NO ENCONTRADO</p>
          <p className="text-sm text-slate-500">
            {result.miembro && !result.valido
              ? "El miembro existe pero está inactivo."
              : "No se encontró ningún miembro con ese dato."}
          </p>
        </div>
      ))}
    </div>
  );
}
