import { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./IdCard.css";

import logo from "../assets/logo_crop.png";
import background from "../assets/idcard-bg.png";

interface IdCardProps {
  nama: string;
  noKK: string;
  kodeWarga: string;
  status: string;
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="id-icon" fill="currentColor">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7H4z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="id-icon" fill="currentColor">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="10" r="2" fill="white" />
      <path
        d="M5.5 15c.7-1.3 1.5-2 2.5-2s1.8.7 2.5 2"
        fill="white"
      />
      <rect x="13" y="9" width="6" height="1.5" rx=".75" fill="white" />
      <rect x="13" y="12" width="6" height="1.5" rx=".75" fill="white" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="id-icon" fill="currentColor">
      <path d="M12 2l8 3v6c0 5.3-3.4 9.5-8 11-4.6-1.5-8-5.7-8-11V5l8-3z" />
      <path
        d="M9 12l2 2 4-5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="status-icon" fill="currentColor">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M3 20c0-3.7 2.7-6 6-6s6 2.3 6 6H3z" />
      <path d="M14 14c3.2-.7 6 1.5 6 5h-4c0-2.1-.7-3.8-2-5z" />
    </svg>
  );
}

export default function IdCard({
  nama,
  noKK,
  kodeWarga,
  status,
}: IdCardProps) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!kodeWarga) {
      setQr("");
      return;
    }

    QRCode.toDataURL(kodeWarga, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 500,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).then(setQr);
  }, [kodeWarga]);

  return (
    <div className="id-card">
      {/* BACKGROUND */}
      <img
        src={background}
        className="id-background"
        alt=""
        draggable={false}
      />

      {/* LOGO */}
      <div className="logo-frame">
  <img
    src={logo}
    className="id-logo"
    alt="Logo Koperasi"
    draggable={false}
  />
</div>

      {/* HEADER */}
      <div className="id-title-small">
        KOPERASI DESA
      </div>

      <div className="id-title-main">
        MERAH PUTIH
      </div>

      <div className="id-title-village">
        <span className="title-line" />
        <span>BUKIT JAYA</span>
        <span className="title-line" />
      </div>

      <div className="title-dot" />

      {/* NAMA */}
      <div className="data-row row-name">
        <div className="icon-wrapper">
          <UserIcon />
        </div>

        <div className="data-content">
          <div className="data-label">
            NAMA
          </div>

          <div className="data-value name-value">
            {nama || "-"}
          </div>
        </div>
      </div>

      <div className="separator separator-name" />

      {/* NOMOR KK */}
      <div className="data-row row-kk">
        <div className="icon-wrapper">
          <CardIcon />
        </div>

        <div className="data-content">
          <div className="data-label">
            NOMOR KK
          </div>

          <div className="data-value kk-value">
            {noKK || "-"}
          </div>
        </div>
      </div>

      <div className="separator separator-kk" />

      {/* KODE WARGA */}
      <div className="data-row row-code">
        <div className="icon-wrapper">
          <ShieldIcon />
        </div>

        <div className="data-content">
          <div className="data-label">
            KODE WARGA
          </div>
        </div>
      </div>

      <div className="code-box">
        {kodeWarga || "-"}
      </div>

      <div className="separator separator-code" />

      {/* QR */}
      <div className="qr-frame">
        {qr && (
          <img
            src={qr}
            className="qr-image"
            alt="QR Code"
            draggable={false}
          />
        )}
      </div>

      {/* STATUS */}
      <div className="membership">
        <div className="membership-title">
          STATUS KEANGGOTAAN
        </div>

        <div className="membership-badge">
          <UsersIcon />

          <span>
            {status || "ANGGOTA"}
          </span>
        </div>

        
      </div>

            {/* FOOTER */}
      <div className="footer-title">
        <span className="footer-line" />

        <div className="footer-pill">
  Kartu Pelanggan KDMP
</div>

        <span className="footer-line" />
      </div>
    </div>
  );
}