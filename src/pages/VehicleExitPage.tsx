import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { formatDate } from '../utils/helpers';
import { LogOut, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import BarrierController from '../components/BarrierController';

const VehicleExitPage: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [tokenNumber, setTokenNumber] = useState('');
  const [processedVehicle, setProcessedVehicle] = useState<ReturnType<typeof useParking>['processExit']>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [barrierOpen, setBarrierOpen] = useState(false);
  const { processExit, getVehicleByLicensePlate } = useParking();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = processExit(licensePlate.trim(), tokenNumber.trim());
    if (result) {
      setProcessedVehicle(result);
      setError(null);
      setBarrierOpen(true);
    } else {
      setError('Invalid details or vehicle has already exited');
    }
  };

  const handleScanComplete = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const params = new URLSearchParams(url.search);
      const scannedPlate = params.get('plate');
      const scannedToken = params.get('token');

      if (scannedPlate && scannedToken) {
        const result = processExit(scannedPlate, scannedToken);
        if (result) {
          setProcessedVehicle(result);
          setError(null);
          setScannerError(null);
          setBarrierOpen(true);
          setShowScanner(false);
        } else {
          setScannerError('Invalid QR code or vehicle has already exited');
        }
      } else {
        setScannerError('Invalid QR code format');
      }
    } catch (err) {
      setScannerError('Failed to process QR code');
    }
  };

  const handleScannerError = (errorMessage: string) => {
    setScannerError(errorMessage);
  };
  
  const handleNewExit = () => {
    setProcessedVehicle(null);
    setError(null);
    setScannerError(null);
    setBarrierOpen(false);
    setLicensePlate('');
    setTokenNumber('');
  };

  const handleShowScanner = () => {
    setShowScanner(true);
    setScannerError(null);
  };

  const handleCancelScanning = () => {
    setShowScanner(false);
    setScannerError(null);
  };
  
  const getParkingDuration = () => {
    if (!processedVehicle || !processedVehicle.exitTime) return null;
    
    const entryTime = new Date(processedVehicle.entryTime).getTime();
    const exitTime = new Date(processedVehicle.exitTime).getTime();
    const durationMs = exitTime - entryTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };
  
  const duration = processedVehicle ? getParkingDuration() : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <LogOut className="h-6 w-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Exit</h1>
        </div>
        
        <BarrierController 
          isOpen={barrierOpen}
          onStateChange={(state) => setBarrierOpen(state)}
        />

        {!processedVehicle && !showScanner ? (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Scan QR code or enter details manually to process the vehicle exit.
              </p>
              <button
                onClick={handleShowScanner}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <QrCode size={18} />
                <span>Scan QR</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate Number
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter license plate (e.g., ABC-123)"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="tokenNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Token Number
                </label>
                <input
                  type="text"
                  id="tokenNumber"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter the token number from the receipt"
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
              >
                Process Vehicle Exit
              </button>
            </form>
          </div>
        ) : showScanner ? (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
            <QRScanner onScan={handleScanComplete} onError={handleScannerError} />
            
            {scannerError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{scannerError}</span>
              </div>
            )}
            
            <button
              onClick={handleCancelScanning}
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel Scanning
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Exit Successfully Processed
            </h2>
            
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-semibold">{processedVehicle.licensePlate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Token Number</p>
                  <p className="font-semibold">{processedVehicle.tokenNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Entry Time</p>
                  <p>{formatDate(new Date(processedVehicle.entryTime))}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Exit Time</p>
                  <p>{processedVehicle.exitTime ? formatDate(new Date(processedVehicle.exitTime)) : "-"}</p>
                </div>
              </div>
            </div>
            
            {duration && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
                <p className="text-center font-medium text-blue-800">
                  Parking Duration: {duration.hours} hours and {duration.minutes} minutes
                </p>
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={handleNewExit}
                className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
              >
                Process Another Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleExitPage;