import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, FileText, Loader2, X } from "lucide-react";
import { Miembro } from "../types";
import { generateQrDataUrl } from "../lib/qr";
import CredentialCard from "./CredentialCard";

interface Props {
  member: Miembro;
  onClose: () => void;
}

export default function CredentialModal({ member, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // El QR contiene el código de miembro (p. ej. MEM-000001).
    generateQrDataUrl(member.codigoMiembro).then(setQrDataUrl);
  }, [member.codigoMiembro]);

  async function renderCanvas() {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      backgroundColor: null,
      useCORS: true,
    });
  }

  async function handlePng() {
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `credencial-${member.codigoMiembro}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  }

  async function handlePdf() {
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const img = canvas.toDataURL("image/png");
      // PDF vertical con la proporción 1080x1920.
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1920] });
      pdf.addImage(img, "PNG", 0, 0, 1080, 1920);
      pdf.save(`credencial-${member.codigoMiembro}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-brand-800">Credencial Digital</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-5">
          {/* Vista previa escalada. El nodo capturado mantiene 1080x1920. */}
          <div
            className="mx-auto overflow-hidden rounded-lg shadow-lg"
            style={{ width: 270, height: 480 }}
          >
            <div style={{ transform: "scale(0.25)", transformOrigin: "top left" }}>
              {qrDataUrl && (
                <CredentialCard ref={cardRef} member={member} qrDataUrl={qrDataUrl} />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-5 py-4">
          <button onClick={handlePng} className="btn-ghost flex-1" disabled={busy || !qrDataUrl}>
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            PNG
          </button>
          <button onClick={handlePdf} className="btn-gold flex-1" disabled={busy || !qrDataUrl}>
            {busy ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
