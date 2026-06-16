/** Convierte un archivo de imagen a Data URL (base64). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Formatea una fecha ISO a dd/mm/aaaa. */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Devuelve el valor yyyy-mm-dd para <input type="date">. */
export function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function fullName(nombres: string, apellidos: string): string {
  return `${nombres} ${apellidos}`.trim();
}

export function initials(nombres: string, apellidos: string): string {
  return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
}
