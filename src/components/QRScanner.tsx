import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const hasScannedRef = useRef(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('qr-reader');
        }

        hasScannedRef.current = false;
        setIsScanning(true);

        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText: string) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true;
              onScan(decodedText);

              try {
                await html5QrCodeRef.current?.stop();
              } catch (err) {
                console.error('Error stopping scanner:', err);
              }

              html5QrCodeRef.current = null;
              setIsScanning(false);
            }
          },
          (error: any) => {
            if (typeof error === 'string' && error.includes('NotFoundException')) {
              // Normal scanning flow; do nothing
              return;
            }

            console.error('QR scan error:', error);
            if (onError && !hasScannedRef.current) {
              onError('Failed to scan QR code. Please try again.');
            }
          }
        );
      } catch (err) {
        console.error('Failed to start scanner:', err);
        setIsScanning(false);
        if (onError) {