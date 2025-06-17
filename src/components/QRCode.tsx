import React, { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 128 }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        // Dynamically import QRCode library
        const QRCodeStyling = (await import('qr-code-styling')).default;
        
        if (qrContainerRef.current) {
          // Clear previous QR code if any
          qrContainerRef.current.innerHTML = '';
          
          const qrCode = new QRCodeStyling({
            width: size,
            height: size,
            type: 'svg',
            data: value,
            dotsOptions: {
              color: '#1E40AF',
              type: 'rounded'
            },
            cornersSquareOptions: {
              color: '#1E40AF',
              type: 'extra-rounded'
            },
            cornersDotOptions: {
              color: '#1E40AF',
              type: 'dot'
            },
            backgroundOptions: {
              color: '#FFFFFF',
            },
            imageOptions: {
              crossOrigin: 'anonymous',
              margin: 0
            }
          });
          
          qrCode.append(qrContainerRef.current);
        }
      } catch (error) {
        console.error('Failed to load QR code:', error);
        
        // Fallback to displaying the value if QR code fails
        if (qrContainerRef.current) {
          qrContainerRef.current.innerHTML = `
            <div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; text-align: center; padding: 10px;">
              ${value.substring(0, 20)}...
            </div>
          `;
        }
      }
    };

    loadQRCode();
  }, [value, size]);

  return <div ref={qrContainerRef} className="qr-code-container"></div>;
};

export default QRCode;