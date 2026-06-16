import { forwardRef } from "react";
import { Miembro } from "../types";

interface Props {
  member: Miembro;
  qrDataUrl: string;
  /** Texto del nombre de la organización mostrado en la cabecera. */
  orgName?: string;
}

/**
 * Credencial digital en formato vertical 1080x1920 px.
 * Se renderiza a tamaño real (escalado por CSS solo para vista previa) para que
 * html2canvas la capture en alta resolución.
 */
const CredentialCard = forwardRef<HTMLDivElement, Props>(
  ({ member, qrDataUrl, orgName = "ORGANIZACIÓN POLÍTICA" }, ref) => {
    const nombreCompleto = `${member.nombres} ${member.apellidos}`.toUpperCase();

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background: "linear-gradient(160deg, #0a1828 0%, #162d4a 55%, #0f2238 100%)",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Banda dorada superior */}
        <div style={{ height: 16, background: "#d4af37", width: "100%" }} />

        {/* Cabecera: logo + organización */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            paddingTop: 70,
            paddingBottom: 30,
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "#d4af37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a1828",
              fontSize: 58,
              fontWeight: 800,
            }}
          >
            ★
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>{orgName}</div>
            <div style={{ fontSize: 26, color: "#e6c463", fontWeight: 600, letterSpacing: 4 }}>
              CREDENCIAL DE MIEMBRO
            </div>
          </div>
        </div>

        {/* Fotografía */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
          <div
            style={{
              width: 460,
              height: 460,
              borderRadius: "50%",
              border: "12px solid #d4af37",
              overflow: "hidden",
              background: "#1e3a5f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {member.foto ? (
              <img
                src={member.foto}
                alt={nombreCompleto}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 180, fontWeight: 700, color: "#d4af37" }}>
                {member.nombres.charAt(0)}
                {member.apellidos.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Nombre + profesión */}
        <div style={{ textAlign: "center", marginTop: 55, paddingLeft: 60, paddingRight: 60 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>{nombreCompleto}</div>
          <div style={{ fontSize: 38, color: "#e6c463", marginTop: 18, fontWeight: 600 }}>
            {member.profesion}
          </div>
        </div>

        {/* Panel de datos */}
        <div
          style={{
            margin: "60px 90px 0",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "40px 50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 26, color: "#9fb3c8", letterSpacing: 2 }}>DNI</div>
            <div style={{ fontSize: 46, fontWeight: 700 }}>{member.dni}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, color: "#9fb3c8", letterSpacing: 2 }}>CÓDIGO</div>
            <div style={{ fontSize: 46, fontWeight: 700, color: "#e6c463" }}>
              {member.codigoMiembro}
            </div>
          </div>
        </div>

        {/* QR */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div style={{ background: "#ffffff", padding: 22, borderRadius: 20 }}>
            <img src={qrDataUrl} alt="QR" style={{ width: 280, height: 280, display: "block" }} />
          </div>
          <div style={{ fontSize: 28, color: "#9fb3c8", letterSpacing: 3 }}>
            Escanea para validar
          </div>
        </div>

        {/* Banda dorada inferior */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            height: 16,
            background: "#d4af37",
            width: "100%",
          }}
        />
      </div>
    );
  }
);

CredentialCard.displayName = "CredentialCard";

export default CredentialCard;
