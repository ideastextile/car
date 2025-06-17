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
          onError('Failed to access the camera. Please check permissions.');
        }
      }
    };

    startScanner();

    // Clean up scanner on unmount
    return () => {
      const stopScanner = async () => {
        try {
          await html5QrCodeRef.current?.stop();
        } catch (err) {
          console.error('Error while stopping scanner:', err);
        }
        html5QrCodeRef.current = null;
        setIsScanning(false);
      };

      stopScanner();
    };
  }, [onScan, onError]);

  return (
    <div className="qr-scanner">
      <div id="qr-reader" className="w-full max-w-md mx-auto min-h-[300px]"></div>
      {isScanning && (
        <p className="text-center mt-4 text-gray-600">
          Position the QR code in front of the camera
        </p>
      )}
    </div>
  );
};

export default QRScanner;

