// components/QRScannerInput.tsx
import React, { useEffect, useState } from "react";

interface QRScannerInputProps {
  onScan: (data: string) => void;
}

const QRScannerInput: React.FC<QRScannerInputProps> = ({ onScan }) => {
  const [scanned, setScanned] = useState("");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (scanned.trim()) {
          onScan(scanned.trim());
          setScanned(""); // reset after scan
        }
      } else {
        setScanned((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [scanned]);

  return (
    <div>
      <h3>Scan QR Code to Exit</h3>
      <input
        type="text"
        value={scanned}
        placeholder="Scan QR Code..."
        readOnly
        style={{ width: "100%", padding: "10px" }}
      />
    </div>
  );
};

export default QRScannerInput;
