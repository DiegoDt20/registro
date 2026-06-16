import QRCode from "qrcode";

/** Genera un Data URL (PNG) del código QR para el contenido dado. */
export async function generateQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 512,
    color: { dark: "#0a1828", light: "#ffffff" },
  });
}
