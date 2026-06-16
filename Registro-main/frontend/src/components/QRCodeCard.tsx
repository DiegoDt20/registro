import { useEffect, useState } from "react";
import { generateQrDataUrl } from "../lib/qr";

interface Props {
  value: string;
  size?: number;
  className?: string;
}

/** Muestra un código QR a partir de un valor (por ejemplo, el código de miembro). */
export default function QRCodeCard({ value, size = 160, className }: Props) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    generateQrDataUrl(value).then((url) => {
      if (active) setDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [value]);

  if (!dataUrl) {
    return (
      <div
        className={className}
        style={{ width: size, height: size, background: "#e2e8f0", borderRadius: 8 }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR ${value}`}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
