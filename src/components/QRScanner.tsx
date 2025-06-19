import React, { useEffect, useRef, useState } from "react";

const QRScanner: React.FC<{ onScan: (code: string) => void }> = ({ onScan }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (input.length > 0) {
          onScan(input);
          setInput("");
        }
      } else {
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      value={input}
      readOnly
      placeholder="Scan QR Code..."
      style={{ width: 300, padding: 10, fontSize: 16 }}
    />
  );
};

export default QRScanner;
