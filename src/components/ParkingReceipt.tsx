import React, { useRef } from 'react';
import { Vehicle } from '../types';
import { formatDate } from '../utils/helpers';
import { Printer, Car } from 'lucide-react';
import QRCode from '../components/QRCode';

interface ParkingReceiptProps {
  vehicle: Vehicle;
}

const ParkingReceipt: React.FC<ParkingReceiptProps> = ({ vehicle }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = `
        <html>
          <head>
            <title>Parking Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .receipt { border: 1px solid #ccc; padding: 20px; max-width: 300px; margin: 0 auto; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-body { margin-bottom: 20px; }
              .receipt-footer { text-align: center; font-size: 0.8em; }
              .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .label { font-weight: bold; }
              .qr-code { text-align: center; margin: 20px 0; }
              .monthly-badge { background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${printContents}
            </div>
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Parking Receipt</h2>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
      </div>
      
      <div ref={receiptRef} className="receipt-content">
        <div className="receipt-header mb-6 text-center">
          <div className="flex justify-center mb-2">
            <Car size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SmartPark</h1>
          <p className="text-gray-500">Secure Parking Management</p>
          {vehicle.isMonthly && (
            <div className="mt-2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                Monthly Pass Holder
              </span>
            </div>
          )}
        </div>
        
        <div className="receipt-body space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">License Plate:</span>
            <span className="font-bold">{vehicle.licensePlate}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Token Number:</span>
            <span className="font-bold">{vehicle.tokenNumber}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Entry Time:</span>
            <span>{formatDate(new Date(vehicle.entryTime))}</span>
          </div>

          {vehicle.monthlyPassExpiry && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Pass Expires:</span>
              <span>{formatDate(new Date(vehicle.monthlyPassExpiry))}</span>
            </div>
          )}
          
          <div className="qr-code my-6 flex justify-center">
            <QRCode value={vehicle.qrCode} />
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800">
            <p className="font-medium">Instructions:</p>
            <p>Please keep this receipt safe. You will need to provide your license plate and token number when exiting.</p>
          </div>
        </div>
        
        <div className="receipt-footer mt-6 text-center text-sm text-gray-500">
          <p>Thank you for using SmartPark</p> <span>by</span>
          <p> 7starsoftwareservice </p> <span>03057027172</span>
                                        
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ParkingReceipt;