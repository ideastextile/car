import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeCameraScanConfig, CameraDevice } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const hasScannedRef = useRef(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);

  useEffect(() => {
    // Step 1: Get external camera
    Html5Qrcode.getCameras()
      .then((devices: CameraDevice[]) => {
        if (devices && devices.length) {
          // You can improve this logic to find a specific external device
          const externalCam = devices.find(d => !d.label.toLowerCase().includes("integrated")) || devices[0];
          setCameraId(externalCam.id);
        } else {
          throw new Error("No cameras found");
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
        if (onError) onError("Camera not found.");
      });
  }, []);

  useEffect(() => {
    if (!cameraId) return;

    const startScanner = async () => {
      try {
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('qr-reader');
        }

        hasScannedRef.current = false;
        setIsScanning(true);

        await html5QrCodeRef.current.start(
          cameraId,
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
        if (onError) onError("Scanner failed to start.");
      }
    };

    startScanner();
  }, [cameraId]);

  return <div id="qr-reader" style={{ width: '300px' }} />;
};

export default QRScanner;
